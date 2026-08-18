-- Builder Board schema for OS Online Board Games.
-- Apply to a fresh Supabase project. Never place a service-role/secret key in this repository.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create type public.submission_status as enum ('pending', 'approved', 'rejected');

create table public.builder_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  builder_key text not null,
  game_id text not null check (char_length(game_id) between 1 and 80),
  implementation_name text not null check (char_length(implementation_name) between 2 and 100),
  live_url text not null check (
    live_url ~ '^https://[^[:space:]]+$' and char_length(live_url) <= 2048
  ),
  source_url text not null check (
    source_url ~* '^https://github\.com/[^/[:space:]]+/[^/[:space:]]+(/.*)?$'
    and char_length(source_url) <= 2048
  ),
  models text[] not null check (cardinality(models) between 1 and 12),
  notes text check (notes is null or char_length(notes) <= 2000),
  status public.submission_status not null default 'pending',
  builder_display_name text not null check (char_length(builder_display_name) between 1 and 120),
  builder_avatar_url text check (builder_avatar_url is null or char_length(builder_avatar_url) <= 2048),
  identity_provider text not null check (identity_provider in ('github', 'google')),
  first_implementation boolean not null default false,
  submitted_at timestamptz not null default now(),
  approved_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint approved_has_timestamp check ((status = 'approved') = (approved_at is not null))
);

create unique index builder_submissions_source_game_unique
  on public.builder_submissions (lower(source_url), game_id);
create unique index builder_submissions_one_first_per_game
  on public.builder_submissions (game_id)
  where first_implementation = true;
create index builder_submissions_status_submitted_idx
  on public.builder_submissions (status, submitted_at desc);
create index builder_submissions_game_id_status_idx
  on public.builder_submissions (game_id, status);
create index builder_submissions_user_id_idx
  on public.builder_submissions (user_id);

alter table public.builder_submissions enable row level security;

create or replace function private.prepare_builder_submission()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  auth_user auth.users%rowtype;
  normalized_models text[];
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;

  select * into auth_user
  from auth.users
  where id = (select auth.uid());

  if not found then
    raise exception 'Authenticated user not found';
  end if;

  new.user_id := auth_user.id;
  new.builder_key := md5(auth_user.id::text);
  new.identity_provider := coalesce(auth_user.raw_app_meta_data ->> 'provider', '');

  if new.identity_provider not in ('github', 'google') then
    raise exception 'Sign in with GitHub or Google to submit';
  end if;

  new.builder_display_name := left(coalesce(
    nullif(auth_user.raw_user_meta_data ->> 'user_name', ''),
    nullif(auth_user.raw_user_meta_data ->> 'preferred_username', ''),
    nullif(auth_user.raw_user_meta_data ->> 'full_name', ''),
    nullif(auth_user.raw_user_meta_data ->> 'name', ''),
    'Verified builder'
  ), 120);
  new.builder_avatar_url := nullif(left(coalesce(auth_user.raw_user_meta_data ->> 'avatar_url', ''), 2048), '');

  select array_agg(model order by model)
  into normalized_models
  from (
    select distinct btrim(value) as model
    from unnest(new.models) as value
    where btrim(value) <> ''
  ) normalized;

  if normalized_models is null or cardinality(normalized_models) = 0 then
    raise exception 'At least one model is required';
  end if;

  if exists (
    select 1 from unnest(normalized_models) as model
    where char_length(model) > 120
  ) then
    raise exception 'Model names must be 120 characters or fewer';
  end if;

  new.models := normalized_models;
  new.status := 'pending';
  new.first_implementation := false;
  new.approved_at := null;
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.prepare_builder_submission() from public, anon, authenticated;

create trigger prepare_builder_submission_before_insert
before insert on public.builder_submissions
for each row execute function private.prepare_builder_submission();

create or replace function private.touch_builder_submission_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.touch_builder_submission_updated_at() from public, anon, authenticated;

create trigger touch_builder_submission_updated_at
before update on public.builder_submissions
for each row execute function private.touch_builder_submission_updated_at();

create or replace function private.set_builder_submission_approval_metadata()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.status = 'approved' and old.status is distinct from 'approved' then
    new.approved_at := now();
    new.first_implementation := not exists (
      select 1
      from public.builder_submissions existing
      where existing.game_id = new.game_id
        and existing.status = 'approved'
        and existing.id <> new.id
    );
  elsif new.status <> 'approved' then
    new.approved_at := null;
    new.first_implementation := false;
  end if;
  return new;
end;
$$;

revoke all on function private.set_builder_submission_approval_metadata() from public, anon, authenticated;

create trigger set_builder_submission_approval_metadata
before update of status on public.builder_submissions
for each row execute function private.set_builder_submission_approval_metadata();

create policy "approved submissions are public"
on public.builder_submissions
for select
to anon
using (status = 'approved');

create policy "authenticated users see approved and own submissions"
on public.builder_submissions
for select
to authenticated
using (
  status = 'approved'
  or (select auth.uid()) = user_id
);

create policy "verified builders can submit"
on public.builder_submissions
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and status = 'pending'
);

create policy "owners can edit pending submissions"
on public.builder_submissions
for update
to authenticated
using (
  (select auth.uid()) = user_id
  and status = 'pending'
)
with check (
  (select auth.uid()) = user_id
  and status = 'pending'
);

create policy "owners can delete pending submissions"
on public.builder_submissions
for delete
to authenticated
using (
  (select auth.uid()) = user_id
  and status = 'pending'
);

revoke all on public.builder_submissions from anon, authenticated;
grant select (
  id, builder_key, game_id, implementation_name, live_url, source_url,
  models, notes, status, builder_display_name, builder_avatar_url,
  identity_provider, first_implementation, submitted_at, approved_at, updated_at
) on public.builder_submissions to anon, authenticated;
grant insert (game_id, implementation_name, live_url, source_url, models, notes)
  on public.builder_submissions to authenticated;
grant update (game_id, implementation_name, live_url, source_url, models, notes)
  on public.builder_submissions to authenticated;
grant delete on public.builder_submissions to authenticated;

create view public.builder_leaderboard
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
  max(approved_at) as latest_ship_at
from public.builder_submissions
where status = 'approved'
group by builder_key;

grant select on public.builder_leaderboard to anon, authenticated;

create view public.game_implementation_counts
with (security_invoker = true)
as
select
  game_id,
  count(*)::int as implementations,
  count(distinct builder_key)::int as builders,
  max(approved_at) as latest_ship_at
from public.builder_submissions
where status = 'approved'
  group by game_id;

grant select on public.game_implementation_counts to anon, authenticated;

create view public.model_usage
with (security_invoker = true)
as
select
  model,
  count(*)::int as implementations
from public.builder_submissions
cross join lateral unnest(models) as model
where status = 'approved'
group by model;

grant select on public.model_usage to anon, authenticated;
