create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text not null check (char_length(name) between 1 and 120),
  attending boolean not null,
  guest_count integer not null,
  message text not null default '' check (char_length(message) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint attendance_count check ((attending and guest_count between 1 and 10) or (not attending and guest_count = 0))
);
alter table public.rsvps enable row level security;
revoke all on public.rsvps from anon, authenticated;
-- Only the server-side service role may read or write responses.
