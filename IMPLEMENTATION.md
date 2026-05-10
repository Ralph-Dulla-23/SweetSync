# Implementation Roadmap: SweetSync "Engine" Refactor

## 🚩 Hidden Loopholes & System Flaws

### 1. The "Ghost Conflict" (Cross-Room Sync)
- **Loophole**: Currently, availability is siloed by `Room`. If you are busy in "Study Squad" at 2 PM, "Friday Gang" might still see you as "Free" because your global schedule isn't unified.
- **Fix**: Centralize a `UserSchedules` table in Supabase. Rooms should fetch a *computed* group availability derived from individual user master schedules.

### 2. The "TZ Trap" (Timezone Drift)
- **Loophole**: Hardcoding 8 AM to 10 PM assumes everyone is in the same timezone. If Marco is in NYC and Raphael is in London, "8 AM" means two different things.
- **Fix**: All schedule blocks MUST be stored in UTC. The frontend must convert UTC -> Local based on the user's `System.timezone` for rendering the grid.

### 3. The "Stale Screenshot" (OCR Lifecycle)
- **Loophole**: Users upload a schedule for "Spring Semester." When Summer starts, the app continues to use the old data.
- **Fix**: Every uploaded schedule must have a `valid_from` and `valid_until` date range. The engine must filter active schedules based on the room's target date.

### 4. The "Preference Gap" (Binary vs. Weighted)
- **Loophole**: "Free" is currently binary. I might be "Free" at 8 AM, but I hate morning meetings. 
- **Fix**: Introduce a `Preference` weight (0: Busy, 1: Free, 2: Preferred). The heat map should use a "Weighted Signal" where `Preferred` slots glow more intensely (Indigo -> Neon).

### 5. Rendering Bottleneck (Grid Bloat)
- **Loophole**: Moving to 30-minute slots and 24-hour days increases cells from 112 to **672 per week**. Rendering 672 `Animated.View` components will cause frame drops on older Android devices.
- **Fix**: Implement "Canvas Rendering" or optimized `PureComponent` cells. Avoid wrapping every single cell in its own `useEffect` for animations.

---

## 🛠️ Phase-by-Phase Roadmap

### Phase A: The Data Model (The Foundation)
1. **Refactor `TimeSlot`**: Change `hourIndex` to `slotIndex` (0.5h increments).
2. **Date-Based Logic**: Replace `dayIndex` (0-6) with `ISO 8601` date strings.
3. **UTC Normalization**: Implement a `time.ts` library for TZ-safe conversions.

### Phase B: The Heat Map Engine
1. **Vertical Scaling**: Allow the grid to expand/contract based on a `visibleHours` setting (e.g. 7 AM to 12 AM).
2. **Weighted Heat Map**: Update `getHeatShade` to account for `Prefer` votes.
3. **Performance Audit**: Batch animations at the `DayColumn` level rather than the `Cell` level.

### Phase C: Global Synchronization
1. **Master Schedule**: Create a hook `useGlobalAvailability` that aggregates data from all rooms.
2. **Conflict Prevention**: Add "Overlap Warning" in the `vote-slots.tsx` if a slot conflicts with another room's session.

---

## 📅 Refactor Checklist (First 3 Steps)

- [ ] Create `lib/time.ts` utility for 30m slot calculations and TZ formatting.
- [ ] Update `types/index.ts` to include `date` and `preference` fields.
- [ ] Refactor `hooks/useHeatMap.ts` to generate data based on a 48-slot day (30m blocks).
