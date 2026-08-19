-- Per-game ranked leaderboard extension for OS Online Board Games.
-- Apply after supabase/community-voting.sql on a fresh project.

create index if not exists builder_submissions_game_rank_idx
  on public.builder_submissions (game_id, vote_count desc, approved_at asc, implementation_name asc)
  where status = 'approved';

create or replace view public.game_leaderboard
with (security_invoker = true)
as
select
  row_number() over (
    partition by game_id
    order by vote_count desc, approved_at asc nulls last, lower(implementation_name) asc, id asc
  )::int as rank,
  id,
  game_id,
  implementation_name,
  live_url,
  source_url,
  models,
  builder_display_name,
  builder_avatar_url,
  identity_provider,
  vote_count as score,
  approved_at
from public.builder_submissions
where status = 'approved';

grant select on public.game_leaderboard to anon, authenticated;
