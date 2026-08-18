-- Community Favorites voting extension for the Builder Board.
-- Apply after supabase/schema.sql on a fresh project.

alter table public.builder_submissions
  add column vote_count integer not null default 0 check (vote_count >= 0);

create table public.build_votes (
  submission_id uuid not null references public.builder_submissions(id) on delete cascade,
  voter_key_hash text not null,
  created_at timestamptz not null default now(),
  primary key (submission_id, voter_key_hash)
);

alter table public.build_votes enable row level security;
revoke all on public.build_votes from public, anon, authenticated;

create or replace function private.hash_voter_key(voter_key text)
returns text
language sql
immutable
set search_path = ''
as $$
  select encode(extensions.digest(voter_key, 'sha256'), 'hex');
$$;
revoke all on function private.hash_voter_key(text) from public, anon, authenticated;

create or replace function private.sync_submission_vote_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare target_submission_id uuid;
begin
  target_submission_id := coalesce(new.submission_id, old.submission_id);
  update public.builder_submissions
  set vote_count = (select count(*)::integer from public.build_votes where submission_id = target_submission_id)
  where id = target_submission_id;
  return coalesce(new, old);
end;
$$;
revoke all on function private.sync_submission_vote_count() from public, anon, authenticated;

create trigger sync_submission_vote_count_after_change
after insert or delete on public.build_votes
for each row execute function private.sync_submission_vote_count();

create or replace function public.set_build_vote(target_submission_id uuid, voter_key text, should_vote boolean)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  key_hash text;
  target_status public.submission_status;
  current_count integer;
begin
  if voter_key is null or voter_key !~ '^[0-9a-fA-F-]{36}$' then raise exception 'Invalid voter token'; end if;
  select status into target_status from public.builder_submissions where id = target_submission_id;
  if not found then raise exception 'Build not found'; end if;
  if target_status <> 'approved' then raise exception 'Only approved builds can receive votes'; end if;
  key_hash := private.hash_voter_key(voter_key);
  if should_vote then
    insert into public.build_votes (submission_id, voter_key_hash) values (target_submission_id, key_hash) on conflict do nothing;
  else
    delete from public.build_votes where submission_id = target_submission_id and voter_key_hash = key_hash;
  end if;
  select vote_count into current_count from public.builder_submissions where id = target_submission_id;
  return current_count;
end;
$$;
revoke all on function public.set_build_vote(uuid,text,boolean) from public;
grant execute on function public.set_build_vote(uuid,text,boolean) to anon, authenticated;

create or replace function public.get_build_votes_for_voter(voter_key text)
returns table (submission_id uuid)
language sql
security definer
set search_path = ''
as $$
  select bv.submission_id from public.build_votes bv
  where bv.voter_key_hash = private.hash_voter_key(voter_key)
  order by bv.created_at desc;
$$;
revoke all on function public.get_build_votes_for_voter(text) from public;
grant execute on function public.get_build_votes_for_voter(text) to anon, authenticated;

grant select (
  id,builder_key,game_id,implementation_name,live_url,source_url,models,notes,status,
  builder_display_name,builder_avatar_url,identity_provider,first_implementation,
  submitted_at,approved_at,updated_at,vote_count
) on table public.builder_submissions to anon, authenticated;

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
