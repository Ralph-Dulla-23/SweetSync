-- Full Schema Migration for SweetSync
-- Based on Rules/RELATIONSHIPS.md

-- 1. USERS (Profiles)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name varchar,
  email varchar,
  avatar_url varchar,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ROOMS
CREATE TABLE public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name varchar NOT NULL,
  description text,
  session_status varchar DEFAULT 'collecting' NOT NULL, -- collecting | processing | voting_slots | voting_activity | confirmed | expired
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ROOM_MEMBERS
CREATE TABLE public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status varchar DEFAULT 'pending' NOT NULL, -- pending | uploaded
  joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(room_id, user_id)
);

-- 4. INVITES
CREATE TABLE public.invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  token varchar UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at timestamp with time zone,
  used boolean DEFAULT false NOT NULL
);

-- 5. SCHEDULES
CREATE TABLE public.schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  blocks jsonb DEFAULT '[]'::jsonb NOT NULL, -- array of { day, start_time, end_time, label }
  confirmed_at timestamp with time zone,
  UNIQUE(room_id, user_id)
);

-- 6. SESSIONS
CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  status varchar DEFAULT 'collecting' NOT NULL, -- mirrors ROOMS.session_status
  voting_deadline timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. SLOTS
CREATE TABLE public.slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  ai_generated boolean DEFAULT false NOT NULL
);

-- 8. VOTES
CREATE TABLE public.votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id uuid REFERENCES public.slots(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  response varchar NOT NULL, -- free | prefer | cant
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(slot_id, user_id)
);

-- 9. ACTIVITIES
CREATE TABLE public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  name varchar NOT NULL,
  suggested_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- null if ai_generated
  is_ai boolean DEFAULT false NOT NULL
);

-- 10. ACTIVITY_VOTES
CREATE TABLE public.activity_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES public.activities(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  response varchar NOT NULL, -- free | prefer | cant
  UNIQUE(activity_id, user_id)
);

-- 11. EVENTS
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  slot_id uuid REFERENCES public.slots(id) ON DELETE CASCADE NOT NULL UNIQUE,
  activity_id uuid REFERENCES public.activities(id) ON DELETE CASCADE NOT NULL UNIQUE,
  confirmed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. HEAT_MAP_CACHE
CREATE TABLE public.heat_map_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL UNIQUE,
  grid jsonb DEFAULT '{}'::jsonb NOT NULL, -- precomputed availability grid
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. NOTIFICATIONS_LOG
CREATE TABLE public.notifications_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  type varchar NOT NULL, -- invite | nudge_upload | slots_ready | nudge_vote | confirmed | day_before | hour_before
  send_at timestamp with time zone NOT NULL,
  sent_at timestamp with time zone -- null until fired
);

-- RLS POLICIES (Example for rooms)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view rooms they are members of" ON public.rooms
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.members WHERE room_id = id
    ) OR host_id = auth.uid()
  );

-- Enable RLS on other tables as needed...
