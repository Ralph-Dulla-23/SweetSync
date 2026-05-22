# SweetSync — Project Overview 🍑

**Warm, Clear, Alive.** The social scheduling app that actually understands your group's free time.

## 🌟 Project Identity
SweetSync is a mobile-first (React Native/Expo) coordination platform designed for friend groups and students. It replaces the friction of "when are you free?" group chat deadlocks with a seamless, AI-powered scheduling engine.

### Design Pillars
1. **Warm**: Peach and indigo tones create a social, non-corporate atmosphere.
2. **Clear**: Intentional spacing and semantic colors ensure instant understanding of app states.
3. **Alive**: Fluid animations and responsive heat maps make the coordination process feel human and dynamic.

---

## 🏗️ Technical Architecture
- **Frontend**: React Native + Expo + TypeScript
- **State & Real-time**: Supabase (Auth, Database, Real-time subscriptions)
- **AI Engine**: Google Gemini (via Supabase Edge Functions) for OCR and slot finding.
- **Motion**: React Native Reanimated for high-performance interactions.
- **Styling**: Theme-driven Vanilla StyleSheet with performance-optimized components.

---

## 📱 Page Breakdown

### 1. Home (Rooms List)
The landing hub showing all active coordination spaces.
- **Status Pills**: Instant visibility of room state (Waiting, Voting Open, Confirmed).
- **Dashboard Hero**: A dynamic card that surfaces urgent actions (e.g., "The group is waiting for your vote!").
- **Avatar Stacks**: Visual representation of squad members in each room.

### 2. Room Interior
The coordination nerve center for a specific squad.
- **Squad Progress**: A progress bar showing how many members have synced their schedules.
- **Member List**: Social list with "Nudge" actions to remind pending friends.
- **Reveal Gaps**: The primary CTA that unlocks once everyone has synced.

### 3. Group Calendar (Heat Map)
A performance-optimized visualization of collective availability.
- **Heat Map View**: Shades from light peach (free) to deep indigo (busy). Tapping a cell reveals a breakdown of *who* is free.
- **Magic Slots**: AI-found windows of opportunity highlighted with a glowing peach ring.
- **My Schedule Tab**: A personal view for verifying AI-extracted blocks or manually adding busy time.
- **Interactive Bottom Sheet**: Contextual detail about any selected slot with a "Start Voting" entry point.

### 4. Voting Flow (Two Steps)
A card-based interface for reaching consensus.
- **Step 1: Vote on Time**: Members mark AI-found slots as "Free," "Prefer," or "Can't." Conflicts with other rooms are surfaced here.
- **Step 2: Vote on Activity**: Once time is locked, the group votes on AI-suggested or member-added activities.

### 5. Results & Confirmed Event
The celebration screen for a successful sync.
- **Winner Card**: High-impact visualization of the locked-in plan.
- **Calendar Integration**: One-tap addition to the system calendar.
- **Celebration Motion**: Animated success states to reinforce the social win.

### 6. Global Calendar Tab
A unified view aggregating your personal schedule and confirmed events across *all* your rooms.

---

## ⚡ Performance Strategy
The app is built for 60fps responsiveness on mobile:
- **Static-First Grid**: Heat map cells are static by default, mounting heavy animation hooks only for active/magic slots.
- **Memoized UI Kit**: Core components (Cards, Avatars, Buttons) are strictly memoized to prevent render thrashing.
- **O(1) Data Access**: Schedule lookups use pre-calculated Maps for instant responsiveness in complex grids.
