-- Run once in the Supabase SQL Editor. Accounts use Supabase Auth email/password.
create table public.player_snapshots (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 200),
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 800000),
  created_at timestamptz not null default now()
);
create index player_snapshots_owner_date on public.player_snapshots(owner_id, created_at desc);
alter table public.player_snapshots enable row level security;
revoke all on public.player_snapshots from anon, authenticated;
grant select, insert, delete on public.player_snapshots to authenticated;
create policy own_read on public.player_snapshots for select to authenticated using ((select auth.uid()) = owner_id);
create policy own_insert on public.player_snapshots for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy own_delete on public.player_snapshots for delete to authenticated using ((select auth.uid()) = owner_id);
-- Lock each account during insertion so parallel requests cannot bypass its quota.
create function public.check_player_snapshot_quota() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.owner_id::text, 0));
  if (select count(*) from public.player_snapshots where owner_id=new.owner_id) >= 100 then
    raise exception 'Bulut sınırı: 100 yedek. Eski yedeklerden birini silip tekrar dene.';
  end if;
  return new;
end;
$$;
revoke all on function public.check_player_snapshot_quota() from public, anon, authenticated;
create trigger player_snapshot_quota before insert on public.player_snapshots for each row execute function public.check_player_snapshot_quota();
