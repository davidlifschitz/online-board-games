-- Community Favorites voting extension for the Builder Board.
-- Apply after supabase/schema.sql on a fresh project.
-- The production Supabase project received the equivalent migration on 2026-08-18.

alter table public.builder_submissions
  add column vote_count integer not null default 0 check (vote_count >= 0);

create table public.build_votes (
  submission_id uuid not null references public.builder_submissions(id) on delete cascade,
  voter_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (submission_id, voter_user_id)
);

create index build_votes_voter_user_id_idx
  on public.build_votes (voter_user_id);

alter table public.build_votes enable row level security;

create or replace function private.prepare_build_vote()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_owner uuid;
  target_status public.submission_status;
begin
  if (select auth.uid()) is null then
    raise exception 'Sign in to vote';
  end if;

  select user_id, status
  into target_owner, target_status
  from public.builder_submissions
  where id = new.submission_id;

  if not found then
    raise exception 'Build not found';
  end if;

  if target_status <> 'approved' then
    raise exception 'Only approved builds can receive votes';
  end if;

  if target_owner = (select auth.uid()) then
    raise exception 'You cannot vote for your own build';
  end if;

  new.voter_user_id := (select auth.uid());
  new.created_at := now();
  return new;
end;
$$;

revoke all on function private.prepare_build_vote() from public, anon, authenticated;

create trigger prepare_build_vote_before_insert
before insert on public.build_votes
for each row execute function private.prepare_build_vote();

create or replace function private.sync_submission_vote_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_submission_id uuid;
begin
  target_submission_id := coalesce(new.submission_id, old.submission_id);

  update public.builder_submissions
  set vote_count = (
    select count(*)::integer
    from public.build_votes
    where submission_id = target_submission_id
  )
  where id = target_submission_id;

  return coalesce(new, old);
end;
$$;

revoke all on function private.sync_submission_vote_count() from public, anon, authenticated;

create trigger sync_submission_vote_count_after_change
after insert or delete on public.build_votes
for each row execute function private.sync_submission_vote_count();

create policy "users see own build votes"
on public.build_votes
for select
to authenticated
using ((select auth.uid()) = voter_user_id);

create policy "users can vote once as themselves"
on public.build_votes
for insert
to authenticated
with check ((select auth.uid()) = voter_user_id);

create policy "users can remove own build votes"
on public.build_votes
for delete
to authenticated
using ((select auth.uid()) = voter_user_id);

-- Voter UUIDs are intentionally never granted for client-side SELECT.
revoke all on table public.build_votes from anon, authenticated;
grant select (submission_id, created_at) on table public.build_votes to authenticated;
grant insert (submission_id) on table public.build_votes to authenticated;
grant delete on table public.build_votes to authenticated;

grant select (
  id,
  builder_key,
  game_id,
  implementation_name,
  live_url,
  source_url,
  models,
  notes,
  status,
  builder_display_name,
  builder_avatar_url,
  identity_provider,
  first_implementation,
  submitted_at,
  approved_at,
  updated_at,
  vote_count
) on table public.builder_submissions to anon, authenticated;

-- Preserve the base Builder Board's latest-approved identity semantics and
-- append only the aggregate community-vote column.
create or replace view public.builder_leaderboard
with (security_invoker = true)
as
select
  builder_key as builder_id,
  (array_agg(builder_display_name order by approved_at desc))[1] as builder_display_name,
  (array_agg(builder_avatar_url order by approved_at desc))[1] as builder_avatar_url,
  (array_agg(identity_provider order by approved_at desc))[1] as identity_provider,
  count(*)::int as games_shipped,
  count(*) filter (where first_implementation)::int as first_implementations,
  count(distinct game_id)::int as distinct_game_concepts,
  min(approved_at) as first_ship_at,
  max(approved_at) as latest_ship_at,
  sum(vote_count)::int as community_votes
from public.builder_submissions
where status = 'approved'
group by builder_key;

grant select on public.builder_leaderboard to anon, authenticated;
