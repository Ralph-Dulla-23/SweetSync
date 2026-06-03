# Comprehensive Codebase Health Refactor Plan

## Background & Motivation
Automated audits using `aicop` and `react-doctor` identified significant technical debt, critical React Native anti-patterns, and AI-smells across the SweetSync codebase. Key issues include a crash risk from a deprecated `SafeAreaView` import, severe performance bottlenecks from animating layout properties and using `ScrollView` for mapped lists, and poor maintainability due to "god files" and high cyclomatic complexity. Addressing these issues now will ensure a stable, scalable foundation for future feature development.

## Scope & Impact
This comprehensive refactor touches the core application flow, including the creation, profile, and room interior screens, as well as shared hooks and global styles. 

**Impact:**
- **Stability:** Eliminates the crash risk from deprecated imports.
- **Performance:** Fixes 60fps frame drops caused by layout property animations, unstable keys, and non-virtualized lists.
- **Maintainability:** Reduces cognitive load by breaking down 500+ line files into modular components.
- **Robustness:** Resolves missing null checks and improves type safety by replacing `any`.

## Proposed Solution
We will systematically address the audit findings through a multi-phase approach, prioritizing critical bugs first, followed by performance and structural refactoring.

### Phase 1: Critical Bug Fixes (React Doctor Errors)
- **Deprecated Imports:** Update `app/(tabs)/create.tsx` (and any other occurrences) to import `SafeAreaView` from `react-native-safe-area-context` instead of `react-native`.
- **Animation Bottlenecks:** Refactor `app/room/[id]/processing.tsx` to separate layout properties (`width`, `height`, `position`) from the `useAnimatedStyle` hook, animating only `transform` and `opacity`.
- **Dimensions API:** Replace `Dimensions.get('window')` with the `useWindowDimensions()` hook in `processing.tsx` for responsive layout handling.

### Phase 2: React Native Anti-Patterns & AI-Smells
- **List Virtualization:** Convert `ScrollView` with `.map()` to `FlatList` in `app/(tabs)/index.tsx` and `app/(tabs)/profile.tsx`.
- **Key Stability:** Replace array indices as keys with stable, unique IDs in `components/AvatarStack.tsx`, `components/HeatMap.tsx`, and `app/index.tsx`.
- **State Optimization:** Convert multiple `useState` calls into a single `useReducer` in `app/(tabs)/create.tsx`, and convert states not triggering UI updates (like `roomId`) to `useRef`.
- **Effect & Hook Cleanup:** Remove `async` from hooks that do not `await` (e.g., in `useRoom.ts`, `lib/gemini.ts`, `lib/supabase.ts`). Add array length checks before index access (`components/Avatar.tsx`, `hooks/useHeatMap.ts`).
- **Styles:** Update `styles/global.ts` to use cross-platform `boxShadow` instead of legacy `elevation`.

### Phase 3: Structural Refactoring (God Files & Complexity)
- **Profile Screen:** Break down `app/(tabs)/profile.tsx` (543 lines) into smaller components (e.g., `<ProfileHeader />`, `<PreferencesForm />`, `<PrivacyModal />`).
- **Room Screen:** Split `app/room/[id].tsx` (600 lines) and `app/room/[id]/calendar.tsx` (532 lines) into focused modules.
- **Function Complexity:** Extract helper functions to reduce cyclomatic complexity in `SignIn`, `GroupCalendar`, and `ActivityCard`.
- **Type Safety:** Replace instances of `as any` in `app/(tabs)/index.tsx`, `app/room/[id].tsx`, and `lib/supabase.ts` with appropriate types or type guards.

## Alternatives Considered
- **Critical Fixes Only:** We considered only fixing the crashing bugs and performance errors. However, leaving the god files and AI-smells intact would slow down upcoming feature work and accumulate more debt over time.

## Verification & Testing
- Run `npx react-doctor --json` to confirm 0 critical errors.
- Run `npx aicop scan .` to confirm warnings are significantly reduced and tech-debt/AI-smell scores are above 90/100.
- Manually test the complete Create Room flow, Profile screen interactions, and Room Interior rendering to verify no regressions in behavior.

## Migration & Rollback
No database migrations are required. If the UI behaves unexpectedly after a file split, we can revert specific modularization commits while retaining the isolated bug fixes from Phase 1.