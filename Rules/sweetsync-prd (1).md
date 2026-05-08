# SweetSync — Product Requirements Document

**Version:** 1.1  
**Status:** Draft  
**Last updated:** May 5, 2026  
**Author:** Raphael  
**Changelog:** Added group calendar (heat map + personal view), updated navigation to 5-tab system

---

## Table of contents

1. [Overview](#overview)
2. [Problem statement](#problem-statement)
3. [Target users](#target-users)
4. [Goals and success metrics](#goals-and-success-metrics)
5. [Platform](#platform)
6. [Core concepts](#core-concepts)
7. [Feature requirements](#feature-requirements)
8. [Navigation](#navigation)
9. [User journey](#user-journey)
10. [Notification system](#notification-system)
11. [Tech stack](#tech-stack)
12. [Out of scope (v1)](#out-of-scope-v1)
13. [Open questions](#open-questions)

---

## Overview

SweetSync is a mobile-first group scheduling app that uses AI to find overlapping free time across multiple people's schedules, then helps the group decide what to do with that time. The core loop is: collect schedules → AI finds gaps → group picks a time → group picks an activity → event confirmed.

It is not another calendar app. The calendar is one layer of the product — a group availability heat map that makes the AI's decisions visible and trustworthy, and a personal schedule view for managing your own blocks. The real value is the coordination layer on top.

---

## Problem statement

Group scheduling is broken. Someone sends a "when are you free?" message in a group chat, six people respond with different formats, nobody agrees, the plan dies. Tools like When2Meet are clunky and web-only. Google Calendar requires everyone to maintain an up-to-date calendar, which most students don't. The gap is a mobile-native, low-friction tool that does the heavy lifting for the group.

---

## Target users

**Primary:** College students coordinating study sessions or social hangouts.  
**Secondary:** Friend groups (any age) planning recurring activities.

**Key behaviors to design for:**
- Mobile-first. Most interactions happen on a phone.
- Schedules exist as screenshots or PDFs from university portals, not structured calendar data.
- Low patience for multi-step flows. If uploading a schedule takes more than 2 minutes, people will skip it.
- Social accountability matters. "Waiting on X members" is motivating in a way that a solo reminder is not.

---

## Goals and success metrics

| Goal | Metric | Target (v1) |
|---|---|---|
| Users complete full scheduling cycle | % of rooms that reach a confirmed event | 60% |
| Low schedule upload drop-off | % of invited members who upload | 75% |
| Fast time-to-first-event | Time from room creation to confirmed event | Under 48 hours |
| Retention | % of rooms used more than once | 40% |

---

## Platform

**Mobile app** built with Expo and React Native, targeting iOS and Android from a single codebase.

Web access is not a v1 requirement. All design decisions prioritize the mobile viewport.

---

## Core concepts

### Room

A room is a persistent group space. Think of it like a group chat dedicated to coordination. The same friend group or study squad uses one room ongoing — it does not get created and discarded per event.

A room contains:
- A member list (host + invited members)
- Each member's uploaded schedule
- A history of past events
- Any active scheduling sessions

### Scheduling session

A session lives inside a room. When the group wants to find a time for something, the host kicks off a session. The session runs through the full AI → vote → confirm cycle. Once confirmed, the session becomes a stored event in the room.

### Event

A confirmed time + activity. Stored in the room's history. Tied to the notification system.

---

## Feature requirements

### 1. Room management

**Host can:**
- Create a room with a name
- Generate an invite link or code
- See who has joined and who has uploaded their schedule
- View a "waiting on X members" status

**Members can:**
- Join via invite link or room code
- See who else is in the room

---

### 2. Schedule upload

Three input methods, in priority order:

**Image or PDF upload (primary)**  
Member uploads a photo or PDF of their timetable — typically a screenshot from a university portal. The AI reads it via OCR and extracts busy time blocks automatically.

After extraction, the member sees a confirmation screen: "Here's what I read from your schedule — does this look right?" They can correct any blocks before confirming.

**Manual blocking (secondary)**  
Member taps into a weekly calendar view and marks busy blocks by selecting time ranges on each day. Good for people whose schedule isn't in a file.

**Google Calendar sync (phase 2, not v1)**  
OAuth-based sync with Google Calendar. Deprioritized because most students don't maintain an up-to-date Google Calendar, and the setup friction is high relative to the benefit at this stage.

---

### 3. AI schedule processing

Once all members have uploaded (or the host triggers processing manually), the AI:

1. Cross-references all members' busy blocks
2. Identifies overlapping free time windows
3. Ranks windows by duration and number of members available
4. Surfaces the top 3–5 free slots for the group to vote on
5. Generates activity suggestions relevant to the slot duration, group size, and optionally location

The AI should surface slots with 100% availability first. If no 100% slot exists, it surfaces the best partial overlaps ranked by attendance count.

---

### 4. Voting — time slots

Uses an availability confirm model, not a preference vote.

Each member marks each surfaced slot as one of:
- **Free** — I can make this
- **Free and prefer** — this works best for me
- **Can't do** — not available

The app ranks slots by:
1. Most members free (descending)
2. Ties broken by "prefer" votes

If two slots are tied at the end of voting, the host picks.

A voting deadline can be set by the host to prevent the session from stalling indefinitely.

---

### 5. Activity suggestions and voting

After a time slot is confirmed, the group moves to activity selection.

**AI suggestions:**  
The AI proposes a list of activities based on:
- Time available (slot duration)
- Group size
- Location (optional — member can input or grant location access)
- Time of day

Examples: "grab dinner," "study session at the library," "movie night," "game night."

**Manual suggestions:**  
Any member can add their own activity suggestion to the list. Manual suggestions join the AI-generated ones in the same voting pool.

**Voting:**  
Same availability confirm model used for time slots. Members vote on activities. Most votes wins. Host breaks ties.

---

### 6. Confirmed event

Once both a time slot and activity are confirmed, an event is created with:
- Event name (from activity choice)
- Date and time
- Group members attending
- Optional: location, notes

The event is stored in the room's history and triggers the notification schedule.

The host can edit event details (location, notes) after confirmation.

---

### 7. Group calendar — heat map + personal view

The calendar is not a standalone screen — it lives inside the Room interior as a two-tab view. It is accessible from the global Calendar tab as well, showing a unified view across all rooms.

#### Two tabs

**Group view (default)**

A weekly heat map showing collective availability across all room members. Each time block is shaded on a scale from white (everyone free) to deep indigo (everyone busy). No individual member colors — the signal is group-level, not personal.

Interaction:
- Tap any block to see a breakdown: who is free and who is busy at that time
- AI-confirmed free slots appear with a peach highlight ring — the heat map becomes the visual proof that the AI found a real gap
- Confirmed events appear as pinned mint blocks directly on the map
- The heat map updates live as members upload their schedules — free zones emerge in real time

**My schedule tab**

Personal week view showing only the user's own busy blocks. This is where members:
- Verify what the AI extracted from their uploaded file
- Manually add, edit, or delete blocks
- Create new busy periods that weren't in their uploaded file

Manual block creation: tap and drag on the calendar to create a block. Tap an existing block to edit or delete it.

#### Why heat map instead of traditional overlay

Three approaches were evaluated:

| Approach | Problem |
|---|---|
| Traditional overlay (all members, color-coded) | Five colored block sets on a phone screen is unreadable. Users see individual chaos, not group availability. |
| Tabbed individual views (one tab per member) | Requires five mental round-trips to understand group availability. Defeats the AI's purpose. |
| Heat map + drill-down (chosen) | Collapses all schedules into one signal. Group picture is instant. Individual detail available on tap. |

#### Calendar integration with the user journey

| Phase | Calendar role |
|---|---|
| Phase 2 — Upload | After AI extracts a schedule, "My schedule" tab opens automatically for review. Member corrects blocks here before confirming. |
| Phase 2→3 — Waiting | Heat map darkens in busy zones as members upload. Free zones stay light. Group sees gaps forming before AI runs. |
| Phase 3 — AI results | AI-found slots appear as peach rings on the heat map. Members see why the AI picked each slot without reading an explanation. |
| Phase 5 — Confirmed | Confirmed event pins as a mint block on the group heat map. Visible to all members from the Room interior. |

---

## Navigation

SweetSync uses a five-tab bottom navigation bar. Each tab has a distinct, non-overlapping job.

| Tab | Icon | Purpose |
|---|---|---|
| **Home** | House | Rooms list — all your rooms with live status (waiting, voting open, confirmed) |
| **Calendar** | Calendar | Personal schedule + all confirmed events across rooms. Group heat map accessible from here when inside a room. |
| **+ (Create)** | Plus (indigo pill) | Create a new room or kick off a new scheduling session inside an existing room |
| **Votes** | List | All open voting sessions across every room. See and cast votes without navigating into individual rooms. |
| **Profile** | Person | Account settings, notification preferences, uploaded schedule history |

**Design notes:**
- The Create tab is a raised indigo pill button, not a flat icon — it is the primary action and should feel distinct
- The active tab uses peach punch (`#D85A30`) for icon and label color
- Inactive tabs use `text-tertiary` (`#A0A0A0`)
- The Votes tab shows a badge count when there are uncast votes

---

## User journey

### Phase 1 — Setup (host-driven)

1. Host creates a room and names it
2. Host shares invite link or code with the group
3. Members join the room

**UX note:** The room should feel alive immediately after creation — not empty. Show a "waiting for members" state that updates in real time as people join.

---

### Phase 2 — Schedule collection (member-driven)

1. Each member uploads their schedule (photo, PDF, or manual)
2. AI extracts busy blocks and shows a confirmation screen
3. Member is taken to the "My schedule" tab — the personal calendar view — to review what was extracted
4. Member corrects any misread blocks directly on the calendar, then confirms
5. Room shows a progress indicator: "3 of 5 schedules uploaded"
6. The group heat map in the Room interior updates live as each member confirms their schedule — free zones begin to emerge visually

**UX note:** This is the highest-friction phase and the most likely drop-off point. The "waiting on X members" indicator creates social accountability. The heat map updating in real time as members join adds a secondary motivator — the group can see the picture forming. The nudge notification fires after 24 hours of inaction.

---

### Phase 3 — AI processing (system-driven)

1. All schedules confirmed (or host triggers manually)
2. AI processes schedules and finds overlapping free windows
3. AI generates activity suggestions
4. AI-found slots appear as peach highlight rings on the group heat map — members can see exactly where the gaps are before they even open the voting screen
5. Members are notified: "Your free slots are ready — go vote"

**UX note:** This phase should feel fast. Show a brief loading state with something like "Finding your free time..." — not a blank screen. The heat map update after AI processing is a key trust-building moment — seeing the slot highlighted inside a visibly light zone on the map is more convincing than a list of times.

---

### Phase 4 — Group decision (collaborative)

1. Members open the voting screen
2. Each member marks availability for each time slot
3. Each member votes on activity suggestions (or adds their own)
4. App tallies results in real time
5. Winning slot and activity are surfaced
6. Host confirms — or breaks a tie if needed

**UX note:** Voting should feel like swiping through options, not filling out a form. Each slot or activity gets its own card with a clear three-option response.

---

### Phase 5 — Confirmed (automated)

1. Event is created and stored in the room
2. All members see the confirmed event screen
3. The confirmed event is pinned as a mint block on the group heat map — visible from the Room interior and the global Calendar tab
4. Notification schedule kicks in automatically
5. On event day, the event appears in the room's feed

---

## Notification system

Notifications are split by role. The goal is maximum signal, minimum noise — no more than 4–5 notifications per person per scheduling cycle.

Every notification taps directly into the relevant screen. No hunting.

### Host notifications

| Trigger | Message |
|---|---|
| Member joins the room | "[Name] joined [Room Name]" |
| Member hasn't uploaded after 24 hrs | "Still waiting on [Name] to upload their schedule" |
| All schedules uploaded | "Everyone's in — AI is finding your free time" |
| Voting deadlocked | "It's a tie — you have the final say" |

### Member notifications

| Trigger | Message |
|---|---|
| Invited to a room | "[Name] invited you to [Room Name]" |
| Haven't uploaded after 24 hrs | "Your group is waiting on your schedule" |
| AI found slots, voting open | "Your free slots are ready — go vote" |
| Event confirmed | "[Activity] is on — [Date] at [Time]" |

### Everyone

| Trigger | Message |
|---|---|
| Day before event | "Tomorrow: [Activity] at [Time]" |
| 1 hour before event | "[Activity] starts in 1 hour" |

---

## Tech stack

| Layer | Choice | Reason |
|---|---|---|
| Mobile framework | Expo + React Native | Single codebase for iOS and Android. Familiar from prior projects. |
| Language | TypeScript | Type safety across the codebase. |
| AI — OCR / schedule reading | Google Gemini API (gemini-1.5-flash, v1beta) | Already integrated in prior Expo project. Handles image and PDF input well. |
| AI — slot finding + activity suggestions | Gemini API | Same model handles both tasks. |
| Backend / database | Supabase | Real-time updates for room state and voting. Auth built in. |
| Push notifications | Expo Notifications + FCM/APNs | Native push via Expo's notification service. |
| File handling | Expo Document Picker + Image Picker | Handles both PDF and image upload. |
| Calendar sync (phase 2) | Google Calendar API + OAuth | Deferred to v2. |

---

## Out of scope (v1)

- Google Calendar sync
- Web app
- In-app messaging or chat
- Recurring event scheduling
- Public rooms (all rooms are invite-only)
- Payment splitting or expense tracking
- Map integration for location-based suggestions

---

## Open questions

| Question | Priority | Notes |
|---|---|---|
| What happens if a member leaves mid-session? | High | Does their schedule get removed from the AI processing and heat map? |
| Should the host be able to re-run AI processing after a member late-uploads? | High | Probably yes — needs a "re-run" button; heat map should update accordingly |
| What is the default week shown in the group heat map? | High | Current week? Or the week with the most upcoming AI-found slots? |
| How far ahead does the heat map show? | Medium | Two weeks is a reasonable default — configurable by host per session |
| How long does a room stay active? | Medium | No expiry for now, revisit based on usage |
| Should activity suggestions factor in weather or nearby places? | Medium | Interesting for v2, too much scope for v1 |
| Can a member belong to more than one room? | Low | Yes — global Calendar tab must handle events from multiple rooms cleanly |
| Should voting be anonymous? | Low | Probably not for friend groups, but worth asking |
| Should the heat map be visible before all schedules are uploaded? | Low | Yes — partial data is still useful; show it with a "X of Y schedules loaded" disclaimer |
