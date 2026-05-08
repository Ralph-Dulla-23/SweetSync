# SweetSync — Relationships and System Design

**Version:** 1.0  
**Status:** Draft  
**Last updated:** May 8, 2026  
**Author:** Raphael  
**Companion to:** `sweetsync-prd.md`, `TECH.md`, `CLAUDE.md`

---

## Table of contents

1. [Actors](#actors)
2. [Use cases](#use-cases)
3. [Entity relationship diagram](#entity-relationship-diagram)
4. [Session state machine](#session-state-machine)
5. [Core scheduling sequence](#core-scheduling-sequence)
6. [Key relationship notes](#key-relationship-notes)

---

## Actors

SweetSync has two categories of actors — human actors and system actors.

### Human actors

| Actor | Description | Inherits from |
|---|---|---|
| Guest | Unauthenticated user. Can view onboarding and tap an invite link. Cannot access any room data. | — |
| Member | Authenticated user. Can join rooms, upload schedules, view the heat map, and vote. | Guest (post-auth) |
| Host | Room creator. Inherits all Member capabilities plus exclusive room management actions. | Member |

Host extends Member — every use case available to a Member is automatically available to the Host. Host-only use cases are additive, not separate.

### System actors

| Actor | Technology | Role |
|---|---|---|
| Gemini 2.5 Flash | Google AI Studio API | OCR schedule extraction, slot finding, activity suggestions |
| Expo Push service | Expo Push API + FCM/APNs | Push notification delivery to iOS and Android |
| pg_cron | Supabase pg_cron extension | Scheduled triggers — nudges, reminders, voting deadline enforcement |

System actors are triggered by database events (Edge Function webhooks) or scheduled jobs (pg_cron). They have no user-facing interface.

---

## Use cases

Use cases are grouped by phase and actor. Host use cases do not duplicate Member use cases — the Host inherits all of them.

### Phase 1 — Onboarding

| Actor | Use case |
|---|---|
| Guest | Sign up via Google OAuth |
| Guest | Sign up via Apple OAuth |
| Guest | Sign in to existing account |
| Guest | Tap invite link and deep-link to room |
| Member | Grant push notification permission |
| Member | View own profile |
| Member | Edit display name and avatar |
| Host | Create a new room |
| Host | Name the room |
| Host | Generate invite link or room code |
| Host | Share invite to external apps |

### Phase 2 — Schedule collection

| Actor | Use case |
|---|---|
| Member | Upload timetable photo or PDF |
| Member | Review AI-extracted schedule |
| Member | Correct misread blocks on personal calendar |
| Member | Manually add busy blocks |
| Member | Confirm schedule |
| Member | View group heat map |
| Member | Tap heat map slot to see who's free |
| Host | Monitor upload progress |
| Host | Nudge members who haven't uploaded |
| Host | Trigger AI processing manually |
| Host | Set voting deadline |
| Gemini | Extract schedule blocks from image (OCR) |
| Gemini | Extract schedule blocks from PDF (OCR) |
| pg_cron | Fire 24-hour nudge to members who haven't uploaded |

**Include relationship:** "Extract schedule blocks" includes "validate file type and size" — file validation is a precondition of every Gemini OCR call.

### Phase 3 — AI processing

| Actor | Use case |
|---|---|
| Gemini | Cross-reference all member schedules |
| Gemini | Find overlapping free windows |
| Gemini | Rank slots by attendance count |
| Gemini | Generate activity suggestions |
| Push service | Notify all members — slots ready to vote |
| Push service | Notify host — AI processing complete |
| Member | View AI-found free slots |
| Member | View group heat map with slot highlights |
| Member | Tap AI slot to verify free zone on heat map |

**Include relationship:** "Generate activity suggestions" includes group size, slot duration, and optional location as inputs.

### Phase 4 — Voting

| Actor | Use case |
|---|---|
| Member | Mark slot as Free / Prefer / Can't |
| Member | Vote on activity suggestions |
| Member | Add a manual activity suggestion |
| Member | View live vote tally |
| Host | Break voting tie — time slot |
| Host | Break voting tie — activity |
| Host | Close voting early |
| Host | Extend voting deadline |
| pg_cron | Fire 24-hour nudge to members who haven't voted |
| pg_cron | Auto-close voting at deadline |
| pg_cron | Notify host of tie after deadline closes |

### Phase 5 — Confirmed and beyond

| Actor | Use case |
|---|---|
| Member | View confirmed event celebration screen |
| Member | Add event to device calendar |
| Member | Share confirmed event externally |
| Member | View confirmed event pinned on group heat map |
| Host | Edit event details (location, notes) |
| Host | Start a new scheduling session in the same room |
| Host | Archive or close the room |
| pg_cron | Fire day-before reminder to all members |
| pg_cron | Fire 1-hour reminder to all members |
| pg_cron | Mark notification as sent in notifications_log |

---

## Entity relationship diagram

### Entities and attributes

```
USERS
  id              uuid        PK
  display_name    varchar
  email           varchar
  avatar_url      varchar
  created_at      timestamp

ROOMS
  id              uuid        PK
  host_id         uuid        FK → USERS.id
  name            varchar
  session_status  varchar     -- collecting | processing | voting_slots | voting_activity | confirmed | expired
  created_at      timestamp

ROOM_MEMBERS
  room_id         uuid        FK → ROOMS.id
  user_id         uuid        FK → USERS.id
  joined_at       timestamp

INVITES
  id              uuid        PK
  room_id         uuid        FK → ROOMS.id
  token           varchar     UNIQUE
  created_at      timestamp
  expires_at      timestamp
  used            boolean

SCHEDULES
  id              uuid        PK
  room_id         uuid        FK → ROOMS.id
  user_id         uuid        FK → USERS.id
  blocks          jsonb       -- array of { day, start_time, end_time, label }
  confirmed_at    timestamp

SESSIONS
  id              uuid        PK
  room_id         uuid        FK → ROOMS.id
  status          varchar     -- mirrors ROOMS.session_status
  voting_deadline timestamp
  created_at      timestamp

SLOTS
  id              uuid        PK
  session_id      uuid        FK → SESSIONS.id
  start_time      timestamp
  end_time        timestamp
  ai_generated    boolean

VOTES
  id              uuid        PK
  slot_id         uuid        FK → SLOTS.id
  user_id         uuid        FK → USERS.id
  response        varchar     -- free | prefer | cant
  created_at      timestamp

ACTIVITIES
  id              uuid        PK
  session_id      uuid        FK → SESSIONS.id
  name            varchar
  suggested_by    uuid        FK → USERS.id  -- null if ai_generated
  is_ai           boolean

ACTIVITY_VOTES
  id              uuid        PK
  activity_id     uuid        FK → ACTIVITIES.id
  user_id         uuid        FK → USERS.id
  response        varchar     -- free | prefer | cant

EVENTS
  id              uuid        PK
  room_id         uuid        FK → ROOMS.id
  slot_id         uuid        FK → SLOTS.id       UNIQUE
  activity_id     uuid        FK → ACTIVITIES.id  UNIQUE
  confirmed_at    timestamp

HEAT_MAP_CACHE
  id              uuid        PK
  room_id         uuid        FK → ROOMS.id  UNIQUE
  grid            jsonb       -- precomputed availability grid
  updated_at      timestamp

NOTIFICATIONS_LOG
  id              uuid        PK
  user_id         uuid        FK → USERS.id
  room_id         uuid        FK → ROOMS.id
  type            varchar     -- invite | nudge_upload | slots_ready | nudge_vote | confirmed | day_before | hour_before
  send_at         timestamp
  sent_at         timestamp   -- null until fired
```

### Relationships

```
USERS           ||--o{    ROOMS               hosts (one user hosts many rooms)
USERS           ||--o{    ROOM_MEMBERS         joins (one user is member of many rooms)
ROOMS           ||--o{    ROOM_MEMBERS         has (one room has many members)
ROOMS           ||--o{    INVITES              generates (one room generates many invites)
ROOMS           ||--o{    SCHEDULES            collects (one room collects many schedules)
USERS           ||--o{    SCHEDULES            owns (one user owns one schedule per room)
ROOMS           ||--o{    SESSIONS             runs (one room runs many sessions over time)
SESSIONS        ||--o{    SLOTS                surfaces (one session surfaces many slots)
SLOTS           ||--o{    VOTES                receives (one slot receives many votes)
USERS           ||--o{    VOTES                casts (one user casts one vote per slot)
SESSIONS        ||--o{    ACTIVITIES           suggests (one session has many activities)
USERS           ||--o{    ACTIVITIES           adds (one user adds many manual activities)
ACTIVITIES      ||--o{    ACTIVITY_VOTES       receives (one activity receives many votes)
USERS           ||--o{    ACTIVITY_VOTES       casts (one user casts one vote per activity)
ROOMS           ||--||    EVENTS               confirms (one room has one active confirmed event)
SLOTS           ||--||    EVENTS               becomes (one slot becomes exactly one event)
ACTIVITIES      ||--||    EVENTS               becomes (one activity becomes exactly one event)
ROOMS           ||--o|    HEAT_MAP_CACHE       caches (one room has at most one cache entry)
USERS           ||--o{    NOTIFICATIONS_LOG    receives (one user receives many notifications)
ROOMS           ||--o{    NOTIFICATIONS_LOG    triggers (one room triggers many notifications)
```

### Key constraints

- `SLOTS.id → EVENTS.slot_id` is a **one-to-one** relationship — enforced with UNIQUE constraint on `events.slot_id`. A slot can only become one event.
- `ACTIVITIES.id → EVENTS.activity_id` is a **one-to-one** relationship — enforced with UNIQUE constraint on `events.activity_id`. An activity can only become one event.
- `HEAT_MAP_CACHE.room_id` is UNIQUE — one cache entry per room. Upsert on update, never insert duplicates.
- `VOTES(slot_id, user_id)` — composite unique constraint. One vote per member per slot.
- `ACTIVITY_VOTES(activity_id, user_id)` — composite unique constraint. One vote per member per activity.
- `SCHEDULES(room_id, user_id)` — composite unique constraint. One schedule per member per room.

### blocks jsonb structure

```json
[
  {
    "day": "monday",
    "start_time": "09:00",
    "end_time": "12:00",
    "label": "Math 101"
  },
  {
    "day": "wednesday",
    "start_time": "14:00",
    "end_time": "16:00",
    "label": "Physics Lab"
  }
]
```

### heat_map_cache grid jsonb structure

```json
{
  "week_start": "2026-05-04",
  "slots": [
    {
      "day": "monday",
      "hour": 9,
      "free_count": 5,
      "total_members": 5,
      "busy_members": []
    },
    {
      "day": "monday",
      "hour": 10,
      "free_count": 2,
      "total_members": 5,
      "busy_members": ["user-id-1", "user-id-3", "user-id-5"]
    }
  ]
}
```

---

## Session state machine

A session is the scheduling cycle that runs inside a room. Sessions move through six states with explicit guard conditions at every transition.

### States

| State | Description |
|---|---|
| `collecting` | Room is waiting for all members to upload and confirm their schedules |
| `processing` | All schedules confirmed. Gemini is finding free slots and generating activity suggestions. |
| `voting_slots` | AI has surfaced free slots. Members are marking their availability. |
| `voting_activity` | Time slot winner determined. Members are voting on what activity to do. |
| `confirmed` | Both a time slot and activity are confirmed. Event is created. |
| `expired` | Session timed out (72 hours without completion). Room returns to idle. |

### Transitions

```
[start]
  → collecting          (room created, session kicked off)

collecting
  → processing          GUARD: all room members have confirmed_at IS NOT NULL
  → expired             GUARD: 72 hours elapsed with incomplete uploads

processing
  → voting_slots        GUARD: Gemini returned ≥ 1 slot
  → collecting          GUARD: host manually re-triggers (e.g. member late-uploads)

voting_slots
  → voting_activity     GUARD: all members voted OR voting_deadline passed
  → expired             GUARD: 72 hours elapsed with no votes

voting_activity
  → confirmed           GUARD: activity winner is clear (majority) OR host breaks tie
  → voting_activity     GUARD: host extends deadline

confirmed
  → [end]               (event stored, notifications scheduled)

expired
  → collecting          GUARD: host starts a new session in the same room
```

### Guard condition detail

| Transition | Guard | Tie-breaking rule |
|---|---|---|
| `collecting → processing` | `COUNT(confirmed schedules) = COUNT(room members)` | Host can force-trigger if willing to proceed without all schedules |
| `voting_slots → voting_activity` | All voted OR deadline passed | Slot with most "free" votes wins. Tie → host picks. |
| `voting_activity → confirmed` | All voted OR deadline passed | Activity with most votes wins. Tie → host picks. |

### State is authoritative in the database

Session state is stored in `sessions.status` and `rooms.session_status`. State transitions happen via Edge Functions, not client-side. The client reads state and renders accordingly — it never writes state directly.

---

## Core scheduling sequence

The sequence below covers the full Phase 2 to Phase 5 interaction between all actors.

### Phase 2 — Schedule collection

```
Member          Supabase        Gemini          Push service
  |                |               |                |
  |-- upload file →|               |                |
  |                |-- OCR call →  |                |
  |                |               |-- extract blocks
  |                |← blocks []   |                |
  |← open My Schedule tab         |                |
  |                |               |                |
  |-- correct + confirm schedule →|                |
  |                |               |                |
  |  [real-time]   |               |                |
  |← progress update (3 of 5)     |                |
  |← heat map re-renders          |                |
  |                |               |                |
  Host             |               |                |
  |-- (optional) nudge member →   |                |
  |                |-- push nudge →|→ "Upload your schedule"
```

### Phase 3 — AI processing

```
Host            Supabase        Gemini          Push service
  |                |               |                |
  |-- trigger AI processing →     |                |
  |                |-- find slots →|                |
  |                |-- suggest activities →         |
  |                |← slots[] + activities[]        |
  |                |                                |
  |                |-- push "slots ready" -------→  |
  |                |                                |-- notify all members
  |                |                               Member
  |                |                                |← "Free slots ready — go vote"
```

### Phase 4 — Voting

```
Member          Supabase
  |                |
  |-- mark slot (Free/Prefer/Can't) →
  |  [real-time]   |
  |← live vote tally updates
  |                |
  |-- vote on activity →
  |  [real-time]   |
  |← activity tally updates
  |                |
  [all voted OR deadline]
  |                |
  Host             |
  |-- break tie (if needed) →
```

### Phase 5 — Confirmed

```
Supabase        Member          Push service     pg_cron
  |                |               |                |
  |-- real-time: event confirmed →|                |
  |-- real-time: event confirmed → Host            |
  |                |               |                |
  |-- schedule T-24hr + T-1hr push -----------→    |
  |                |               |                |
  [event day - 24hrs]              |                |
  |                |               |←-- fire T-24hr |
  |                |               |-- push ------→ |
  |                |← "Tomorrow: Movie Night at 4PM"|
  |                |               |                |
  [event day - 1hr]                |                |
  |                |               |←-- fire T-1hr  |
  |                |               |-- push ------→ |
  |                |← "Movie Night starts in 1 hour"|
  |                |               |                |
  |-- tap: add to device calendar  |                |
```

### Sequence notes

- Solid arrows are synchronous calls — the sender waits for a response
- Real-time arrows are subscription updates — Supabase pushes to all subscribed clients
- Push notification arrows go through the Expo Push API which forwards to FCM (Android) or APNs (iOS)
- All Gemini calls originate from Supabase Edge Functions — never from the client directly
- pg_cron fires a Supabase Edge Function every 15 minutes to check for pending notifications

---

## Key relationship notes

### Why one-to-one on EVENTS → SLOTS and EVENTS → ACTIVITIES

An event is the intersection of exactly one confirmed time slot and one confirmed activity. These are enforced as UNIQUE constraints at the database level — not just application logic — because an event with two slots or two activities is a data integrity violation, not just a bug.

### Why SCHEDULES uses jsonb for blocks

Timetable formats vary across universities and countries. A rigid relational schema with a `schedule_blocks` table would require migrating every time a new format appears. jsonb is flexible enough to store any block structure while still being queryable. The trade-off is that block-level queries (e.g. "find all users free on Monday at 9am") happen in application code rather than SQL — acceptable at this scale, revisit if heat map computation moves server-side.

### Why HEAT_MAP_CACHE is separate from SCHEDULES

The heat map is a derived view — it's computed from schedules, not stored alongside them. Keeping the cache in a separate table means the cache can be invalidated and rebuilt without touching schedule data. It also means the cache can be populated lazily (first access) or eagerly (on every schedule confirmation) without changing the schema.

### Why SESSIONS is separate from ROOMS

A room is persistent and long-lived. A session is a single scheduling cycle inside that room. Separating them means a room can have a history of past sessions and run new ones without overwriting old slot, vote, or activity data. This also makes it possible to show past confirmed events in the room's history without a complex query.

### Why pg_cron instead of a webhook-only approach

Webhooks fire on database events — inserts, updates, deletes. But some SweetSync notifications are time-based, not event-based: "24 hours after joining, you haven't uploaded" or "event is tomorrow." There is no database event for "24 hours have passed." pg_cron running every 15 minutes checks the `notifications_log` table for rows where `send_at <= now() AND sent_at IS NULL` and fires them. This handles all time-based notifications without a separate scheduler service.
