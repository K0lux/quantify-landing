-- Replace the public read/write policies shared in the Supabase schema export.
-- Public forms now write through validated server routes using the service role.

alter table public.contact_messages enable row level security;
alter table public.waitlist enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.user_profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.referrals enable row level security;
alter table public.analytics enable row level security;

drop policy if exists anon_insert_contact on public.contact_messages;
drop policy if exists anon_select_contact on public.contact_messages;

drop policy if exists anon_insert_waitlist on public.waitlist;
drop policy if exists anon_select_waitlist on public.waitlist;
drop policy if exists anon_update_waitlist on public.waitlist;

drop policy if exists anon_insert_newsletter on public.newsletter_subscribers;
drop policy if exists anon_select_newsletter on public.newsletter_subscribers;
drop policy if exists anon_update_newsletter on public.newsletter_subscribers;

drop policy if exists anon_insert_referrals on public.referrals;
drop policy if exists anon_select_referrals on public.referrals;

drop policy if exists anon_insert_analytics on public.analytics;
drop policy if exists anon_select_analytics on public.analytics;

drop policy if exists auth_insert_profile on public.user_profiles;
drop policy if exists auth_select_own_profile on public.user_profiles;
drop policy if exists auth_update_own_profile on public.user_profiles;

create policy auth_select_own_profile
  on public.user_profiles
  for select
  to authenticated
  using (auth_user_id = (auth.uid())::text);

drop policy if exists auth_select_own_waitlist on public.waitlist;
create policy auth_select_own_waitlist
  on public.waitlist
  for select
  to authenticated
  using (auth_user_id = (auth.uid())::text);

drop policy if exists auth_select_own_user_preferences on public.user_preferences;
create policy auth_select_own_user_preferences
  on public.user_preferences
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.waitlist w
      where w.id = user_preferences.waitlist_id
        and w.auth_user_id = (auth.uid())::text
    )
  );

drop policy if exists auth_insert_own_user_preferences on public.user_preferences;
create policy auth_insert_own_user_preferences
  on public.user_preferences
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.waitlist w
      where w.id = user_preferences.waitlist_id
        and w.auth_user_id = (auth.uid())::text
    )
  );

drop policy if exists auth_update_own_user_preferences on public.user_preferences;
create policy auth_update_own_user_preferences
  on public.user_preferences
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.waitlist w
      where w.id = user_preferences.waitlist_id
        and w.auth_user_id = (auth.uid())::text
    )
  )
  with check (
    exists (
      select 1
      from public.waitlist w
      where w.id = user_preferences.waitlist_id
        and w.auth_user_id = (auth.uid())::text
    )
  );

drop policy if exists auth_select_own_referrals on public.referrals;
create policy auth_select_own_referrals
  on public.referrals
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.waitlist w
      where w.id = referrals.referrer_id
        and w.auth_user_id = (auth.uid())::text
    )
  );

drop policy if exists auth_select_own_analytics on public.analytics;
create policy auth_select_own_analytics
  on public.analytics
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.waitlist w
      where w.id = analytics.user_id
        and w.auth_user_id = (auth.uid())::text
    )
  );
