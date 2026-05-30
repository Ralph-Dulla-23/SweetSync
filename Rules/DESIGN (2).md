# SweetSync — Design System

**Version:** 1.1  
**Status:** Draft  
**Last updated:** May 5, 2026  
**Companion to:** `sweetsync-prd.md`  
**Changelog:** Added group calendar design spec (heat map + personal view), updated navigation section to 5-tab system

---

## Table of contents

1. [Design philosophy](#design-philosophy)
2. [Color system](#color-system)
3. [Typography](#typography)
4. [Spacing and layout](#spacing-and-layout)
5. [Cards and surfaces](#cards-and-surfaces)
6. [Buttons and interactive elements](#buttons-and-interactive-elements)
7. [Navigation](#navigation)
8. [Group calendar](#group-calendar)
9. [Iconography](#iconography)
10. [Motion and animation](#motion-and-animation)
11. [Screen-by-screen type rules](#screen-by-screen-type-rules)
12. [Design principles](#design-principles)
13. [Implementation notes (Expo/React Native)](#implementation-notes-exporeact-native)

---

## Design philosophy

SweetSync is a social coordination app for friend groups and students. The design should feel like something a person made — warm, considered, a little playful — not a productivity tool that tolerates fun.

Three words that should describe every screen: **warm, clear, alive.**

- **Warm** — peach and indigo together, never cold. The app should feel like a group chat, not a calendar.
- **Clear** — the user always knows what phase they're in and what to do next. No hunting.
- **Alive** — display type, color-coded cards, and micro-interactions give the app personality. Empty states are illustrated, not blank.

The visual reference points are Tiimo (layout generosity, large display type, breathing room) and Luma (clean card structure, strong CTAs). The palette and personality are entirely SweetSync's own.

---

## Color system

### Primary palette

| Token | Hex | Usage |
|---|---|---|
| `peach-base` | `#FDF6F0` | Page background, peach card fill |
| `peach-soft` | `#F5C4B3` | Peach card border, pill fills, secondary accents |
| `peach-mid` | `#F0997B` | Hover states on peach elements |
| `peach-punch` | `#D85A30` | Primary CTAs, active states, peach text on dark |
| `peach-deep` | `#712B13` | Text on peach cards, dark accents |
| `indigo-base` | `#EEEDFE` | Indigo card fill (AI results, slot cards) |
| `indigo-soft` | `#AFA9EC` | Indigo card border, pill fills |
| `indigo-mid` | `#7F77DD` | Indigo hover states |
| `indigo-punch` | `#534AB7` | Indigo CTAs, active states |
| `indigo-deep` | `#3C3489` | Text on indigo cards, headings on indigo bg |
| `mint-base` | `#E1F5EE` | Confirmed event card fill |
| `mint-soft` | `#9FE1CB` | Confirmed card border, success indicators |
| `mint-punch` | `#0F6E56` | Text on confirmed cards |
| `page-bg` | `#FAFAF9` | App background (near-white warm gray) |
| `surface` | `#FFFFFF` | Modal surfaces, sheet backgrounds |
| `text-primary` | `#1A1A1A` | Default body text |
| `text-secondary` | `#6B6B6B` | Captions, labels, muted content |
| `text-tertiary` | `#A0A0A0` | Placeholders, disabled states |
| `border-default` | `rgba(0,0,0,0.08)` | Default card borders |

### Color as semantic meaning

Color in SweetSync is not decorative — it encodes what type of thing you're looking at.

| Color | Meaning | Where |
|---|---|---|
| Peach | Rooms and people | Room cards, member indicators, host badge |
| Indigo | AI and scheduling | Slot cards, AI suggestions, processing states |
| Mint / green | Confirmed and success | Confirmed event cards, success toasts |
| Neutral gray | Passive / waiting | Unuploaded schedule states, empty room |

When a user sees a peach card, they know it's about a room or a person. When they see an indigo card, they know the AI found something. This mapping must stay consistent across the entire app.

### Dark mode

All tokens must have dark mode equivalents. In dark mode:
- Page background shifts to `#1A1918`
- Cards invert to deeper tints: peach base becomes `#3D2218`, indigo base becomes `#1E1C4A`, mint base becomes `#0D2820`
- Text inverts to light equivalents
- Punchy accent colors remain the same hue but may lighten slightly for contrast

---

## Typography

### Font families

**Display — Fraunces**
- Source: `@expo-google-fonts/fraunces`
- Variable font with optical size axis (`opsz`)
- Use at 700 weight for all display moments
- Italic variant (`700i`) for celebration screens and confirmed events
- At sizes above 28px, the optical size axis makes it more expressive automatically

**Body — Plus Jakarta Sans**
- Source: `@expo-google-fonts/plus-jakarta-sans`
- Use at 400 (regular) and 600 (semibold)
- All functional text, labels, captions, buttons, body copy

```javascript
// fonts.ts — preload both families
import {
  useFonts,
  Fraunces_700Bold,
  Fraunces_700Bold_Italic,
} from '@expo-google-fonts/fraunces';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
```

### Type scale

| Name | Font | Size | Weight | Line height | Usage |
|---|---|---|---|---|---|
| `display-xl` | Fraunces | 40px | 700 | 1.05 | Splash screen, confirmed event name |
| `display-lg` | Fraunces | 32px | 700 | 1.1 | Screen titles, room names (detail view) |
| `display-md` | Fraunces | 24px | 700 | 1.2 | Room names in list, AI reveal headline |
| `display-sm` | Fraunces italic | 20px | 700i | 1.25 | Event name on card, celebration subtext |
| `heading-lg` | Plus Jakarta Sans | 18px | 600 | 1.3 | Section headers |
| `heading-md` | Plus Jakarta Sans | 16px | 600 | 1.4 | Card titles (functional), modal headers |
| `body-md` | Plus Jakarta Sans | 14px | 400 | 1.5 | Body copy, descriptions |
| `body-sm` | Plus Jakarta Sans | 13px | 400 | 1.5 | Secondary info, member names |
| `caption` | Plus Jakarta Sans | 12px | 400 | 1.4 | Timestamps, counts, labels |
| `label` | Plus Jakarta Sans | 11px | 600 | 1 | Pills, badges, tags |
| `button` | Plus Jakarta Sans | 15px | 600 | 1 | All button text |

### Typography rules

- Fraunces is used **only** at display moments. Task screens, voting cards, upload flows, and settings use Plus Jakarta Sans exclusively.
- Never mix both fonts in the same text block. Headings use one, body uses the other.
- Letter spacing on `label` and `caption`: `0.02em` for breathing room.
- No italic on Plus Jakarta Sans — italic is reserved for Fraunces celebration moments only.

---

## Spacing and layout

### Base unit

The base unit is **4px**. All spacing values are multiples of 4.

### Spacing tokens

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Micro gaps (icon-to-label, badge padding) |
| `space-2` | 8px | Tight element gaps (pill to pill, list item sub-elements) |
| `space-3` | 12px | Default gap between cards in a list |
| `space-4` | 16px | Card internal padding |
| `space-5` | 20px | Screen horizontal padding (left/right edge) |
| `space-6` | 24px | Section gaps, between major UI blocks |
| `space-8` | 32px | Large breathing room, between sections on detail screens |
| `space-10` | 40px | Bottom safe area padding |

### Screen layout

```
Screen edge padding (left/right): 20px
Top safe area: device-dependent (use SafeAreaView)
Bottom safe area: 40px + tab bar height
Between cards in a list: 12px
Between sections: 24px
Card internal padding (top/bottom): 16px
Card internal padding (left/right): 16px
```

### Border radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 8px | Pills, badges, small chips |
| `radius-md` | 12px | Buttons, input fields |
| `radius-lg` | 16px | Cards (default) |
| `radius-xl` | 24px | Bottom sheets, modals |
| `radius-full` | 999px | Avatar circles, toggle tracks |

---

## Cards and surfaces

### Card style: pastel tint fill

SweetSync uses **pastel tint fill** cards — no drop shadows, no elevation. The card background color is a light tint derived from the semantic color for that content type. A subtle border (0.5px, same color family) defines the edge.

This approach puts the color system to work. A user can scan a screen and know what they're looking at before reading a single word.

### Card anatomy

```
border-radius: 16px
border: 0.5px solid [color-soft]
background: [color-base]
padding: 16px
overflow: hidden
```

### Card types

**Room card (peach)**
```javascript
{
  background: '#FDF6F0',
  borderColor: '#F5C4B3',
  titleColor: '#712B13',      // peach-deep
  subtitleColor: '#993C1D',   // peach-deep 80%
  pillBackground: '#F5C4B3',
  pillTextColor: '#712B13',
}
```

**Slot card (indigo) — AI-found time slots**
```javascript
{
  background: '#EEEDFE',
  borderColor: '#AFA9EC',
  titleColor: '#3C3489',      // indigo-deep
  subtitleColor: '#534AB7',   // indigo-punch
  pillBackground: '#AFA9EC',
  pillTextColor: '#26215C',
}
```

**Confirmed event card (mint)**
```javascript
{
  background: '#E1F5EE',
  borderColor: '#9FE1CB',
  titleColor: '#085041',      // mint-deep
  subtitleColor: '#0F6E56',   // mint-punch
  pillBackground: '#9FE1CB',
  pillTextColor: '#04342C',
}
```

**Neutral card (gray) — task/upload states**
```javascript
{
  background: '#F7F6F3',
  borderColor: 'rgba(0,0,0,0.08)',
  titleColor: '#1A1A1A',
  subtitleColor: '#6B6B6B',
}
```

### Surface hierarchy

| Surface | Background | Usage |
|---|---|---|
| Page | `#FAFAF9` | App background |
| Card | Tinted (see above) | Content cards |
| Sheet | `#FFFFFF` | Bottom sheets, modals |
| Input | `#FFFFFF` | Text inputs, upload zones |
| Overlay | `rgba(0,0,0,0.4)` | Modal backdrop |

---

## Buttons and interactive elements

### Primary button (peach punch)

```javascript
{
  background: '#D85A30',
  color: '#FFFFFF',
  borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 24,
  fontSize: 15,
  fontFamily: 'PlusJakartaSans_600SemiBold',
  // Active state
  activeOpacity: 0.85,
  activeScale: 0.98,
}
```

Used for: "Create Room," "Start Voting," "Confirm Event," all primary CTAs.

### Secondary button (outlined)

```javascript
{
  background: 'transparent',
  borderWidth: 1,
  borderColor: '#D85A30',
  color: '#D85A30',
  borderRadius: 12,
  paddingVertical: 13,
  paddingHorizontal: 24,
  fontSize: 15,
  fontFamily: 'PlusJakartaSans_600SemiBold',
}
```

Used for: "Add Manually," "Skip for Now," secondary actions.

### Indigo button (AI actions)

```javascript
{
  background: '#534AB7',
  color: '#FFFFFF',
  borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 24,
  fontSize: 15,
  fontFamily: 'PlusJakartaSans_600SemiBold',
}
```

Used for: "Find Free Time," "Run AI," anything that triggers AI processing.

### Voting response buttons

Three-state tap targets on slot and activity cards:

| State | Background | Border | Text |
|---|---|---|---|
| Free | `#E1F5EE` | `#9FE1CB` | `#085041` |
| Prefer | `#EEEDFE` | `#AFA9EC` | `#3C3489` |
| Can't do | `#FCEBEB` | `#F09595` | `#791F1F` |

These are pill-shaped (`border-radius: 999px`), not rectangular. They should feel like tags you tap, not form buttons.

### Input fields

```javascript
{
  background: '#FFFFFF',
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,0.1)',
  borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 16,
  fontSize: 15,
  fontFamily: 'PlusJakartaSans_400Regular',
  color: '#1A1A1A',
  // Focus state
  focusBorderColor: '#534AB7',
  focusBorderWidth: 1.5,
}
```

---

## Navigation

### Bottom tab bar

Five tabs: Home, Calendar, Create (+), Votes, Profile.

```javascript
{
  background: '#FFFFFF',
  borderTopWidth: 0.5,
  borderTopColor: 'rgba(0,0,0,0.08)',
  height: 56,   // + safe area
  // Active tab
  activeIconColor: '#D85A30',
  activeLabelColor: '#D85A30',
  // Inactive tab
  inactiveIconColor: '#A0A0A0',
  inactiveLabelColor: '#A0A0A0',
  // Label
  labelFontSize: 10,
  labelFontFamily: 'PlusJakartaSans_600SemiBold',
}
```

### Tab definitions

| Tab | Icon (Phosphor) | Active color | Purpose |
|---|---|---|---|
| Home | `House` | Peach punch | Rooms list with live status per room |
| Calendar | `CalendarBlank` | Peach punch | Personal schedule + confirmed events across all rooms |
| + Create | Custom pill | Always indigo | New room or new scheduling session |
| Votes | `ListChecks` | Peach punch | All open voting sessions across every room |
| Profile | `UserCircle` | Peach punch | Account, notifications, schedule history |

The Create (+) tab is the exception — it uses a raised indigo pill button (`background: #534AB7, color: #FFFFFF`) that sits slightly elevated above the tab bar, centered. It is never in a passive/inactive state — it always looks actionable.

The Votes tab displays a peach badge count when the user has uncast votes pending across any room.

### Screen headers

Minimal. No heavy navigation bars.

- Title uses `display-md` (Fraunces 24px) for main screens, `heading-md` (Plus Jakarta Sans 600, 16px) for sub-screens
- Back button uses a simple chevron with `peach-punch` color
- Action icons (share, settings) are 24px, `text-secondary` color

---

## Group calendar

The calendar is a two-tab view that lives inside the Room interior and is also accessible globally from the Calendar tab.

### Two tabs

**Group view (default)**

A weekly heat map of collective group availability. Each hourly time block is shaded on a scale from near-white (everyone free) to deep indigo (everyone busy). There are no individual member colors — the signal is always group-level.

Color scale for heat map blocks:

| Availability | Fill | Meaning |
|---|---|---|
| 100% free | `#FAFAF9` (page bg) | Everyone available |
| 80% free | `#EEEDFE` (indigo base) | Most people free |
| 60% free | `#AFA9EC` (indigo soft) | Mixed availability |
| 40% free | `#7F77DD` (indigo mid) | Mostly busy |
| 0–20% free | `#534AB7` (indigo punch) | Nearly everyone busy |

AI-found free slots: rendered as a peach outline ring (`border: 2px solid #D85A30`) over the relevant heat map blocks. The block itself stays light (everyone is free) — the ring is the AI's annotation.

Confirmed events: rendered as a solid mint block (`background: #E1F5EE, border: 0.5px solid #9FE1CB`) pinned directly on the heat map.

Tap behavior:
- Tap any block → bottom sheet slides up showing member list: who is free (mint check) and who is busy (gray circle) at that time
- Tap an AI-highlighted slot → bottom sheet shows the slot details with a "Vote on this slot" shortcut button

**My schedule tab**

Personal week view showing only the current user's busy blocks. Used for:
- Post-upload verification — opened automatically after AI extracts a schedule
- Manual block creation — tap and hold on a time slot to create a block
- Block editing — tap an existing block to rename, resize, or delete it

Busy blocks in personal view use the peach card style (`background: #FDF6F0, border: 0.5px solid #F5C4B3`) to distinguish them from the indigo heat map of the group view.

### Calendar implementation notes

```typescript
// Heat map shade calculation
function getHeatShade(freeCount: number, totalMembers: number): string {
  const ratio = freeCount / totalMembers;
  if (ratio === 1)   return '#FAFAF9'; // everyone free
  if (ratio >= 0.8)  return '#EEEDFE'; // indigo-base
  if (ratio >= 0.6)  return '#AFA9EC'; // indigo-soft
  if (ratio >= 0.4)  return '#7F77DD'; // indigo-mid
  return '#534AB7';                    // indigo-punch — mostly busy
}
```

The heat map is built as a `FlatList` of 30-minute time slots across 7 days. Each cell is a `TouchableOpacity` that fires the bottom sheet on press. The grid is 7 columns wide (days) × 32 rows tall (16 hours × 2 slots per hour). Cell height: 28px. Day column width: (screen width − 40px horizontal padding − 32px time label column) ÷ 7.

Real-time updates via Supabase channel subscriptions — when a member confirms their schedule, the heat map recomputes and re-renders affected cells only.

### Screen-by-screen calendar rules

| Screen | Calendar role |
|---|---|
| Room interior | Two-tab calendar (group heat map + my schedule) visible as a scrollable section below the member list |
| Global Calendar tab | Personal week view showing all confirmed events across rooms as pinned mint blocks. Tap any event to open the room it belongs to. |
| AI results screen | Heat map shown in read-only mode with AI slots highlighted — no tab switcher, group view only |
| Post-upload confirmation | "My schedule" tab shown automatically — no tab switcher, personal view only |

---

## Iconography

Use **Phosphor Icons** (`phosphor-react-native`). They are clean, consistent, and have a slightly rounded quality that fits the SweetSync personality.

Icon sizes:
- Tab bar icons: 24px
- In-card icons: 18px
- Inline with text: 16px
- Large decorative (empty states): 48px

Icon weight: `regular` for most uses, `bold` for active/selected states.

Do not use filled icons as a default — filled icons are reserved for selected/active states only.

---

## Motion and animation

### Principles

- Animations should feel like natural responses, not performance.
- Duration sweet spot: 200–350ms. Nothing slower unless it's a page transition.
- Use `Easing.out(Easing.cubic)` as the default easing curve — it decelerates into place and feels physical.
- Every card that appears should entrance — a subtle fade + 4px upward translate.

### Standard transitions

| Interaction | Duration | Easing | Notes |
|---|---|---|---|
| Card entrance | 280ms | `easeOut` | Fade + translateY(8px → 0) |
| Button press | 120ms | `easeIn` | Scale 1 → 0.97 |
| Screen transition | 320ms | `easeInOut` | Slide left (push), slide right (pop) |
| Bottom sheet open | 380ms | Spring (damping 20) | Slides up from bottom |
| Loading state | Loop 1s | `easeInOut` | Skeleton pulse opacity 0.4 → 0.9 |
| AI processing | Loop 1.5s | `easeInOut` | Indigo pulse on the processing indicator |
| Confirmed event | 400ms | Spring (damping 14) | Scale 0.8 → 1.05 → 1 (bouncy pop) |

### Stagger lists

When rendering a list of cards (rooms list, slots list), stagger each card's entrance by 50ms.

```javascript
// Each card at index i:
delay: i * 50,
duration: 280,
animation: fadeInUp,
```

### The AI processing moment

When the AI is finding free slots, show a centered indigo orb (similar to the Luma spark) with a slow breathing pulse animation. Text below reads "Finding your free time..." in Plus Jakarta Sans body. This should feel calm and confident, not anxious.

---

## Screen-by-screen type rules

| Screen | Display font (Fraunces) | Body font (Plus Jakarta Sans) |
|---|---|---|
| Splash | "SweetSync" at display-xl | Tagline at body-md |
| Onboarding | Hero headline at display-lg | Body copy, CTA button |
| Home (rooms list) | Room names at display-md | Member count, status, timestamps |
| Room interior | Room name at display-lg (header) | Everything else — members, status, progress |
| Calendar — group view | None — data screen | Day labels, time labels, slot counts in bottom sheet |
| Calendar — my schedule | None — task screen | Block titles, time ranges, edit prompts |
| Schedule upload | None — task screen | All instructions, confirmation text |
| AI processing | "Finding your free time..." at display-md | Supporting body copy |
| AI results | "We found X free slots!" at display-md | Slot details, member count per slot |
| Voting — time | None | Slot card content, vote counts, response pills |
| Voting — activity | Activity name at display-sm (italic) | Vote counts, member responses |
| Confirmed event | Event name at display-xl (italic) | Date, time, location, member list |
| Notifications | None | All notification text is body-only |
| Settings / profile | None | All functional, no display moments |

---

## Design principles

### 1. Color carries meaning before words do
Every card color encodes its content type. A user scanning the home screen should be able to find their room, check a slot, or see a confirmed event without reading. Color does that work.

### 2. Display type is earned
Fraunces appears at moments of identity (room names), discovery (AI results), and celebration (confirmed events). It does not appear on task screens, upload flows, or settings. The contrast between where it appears and where it doesn't is the point — when it shows up, it means something.

### 3. Punchy accents signal action
Peach punch (`#D85A30`) and indigo punch (`#534AB7`) are the action colors. They appear on buttons, active states, and focused inputs. Soft tints are passive. When something is dark and saturated, it means "do something here."

### 4. Breathing room is not wasted space
The 20px screen padding and 24px section gaps are not laziness — they make the app easier to scan on a moving bus or in a noisy dorm room. Every element should have enough space to be understood at a glance.

### 5. Empty states are never blank
Every empty state (no rooms yet, no schedule uploaded, waiting for members) has a simple illustration and a single actionable sentence. The app should never feel broken or abandoned. Empty is an opportunity, not a failure.

### 6. The AI is a collaborator, not a machine
AI moments (processing, suggestions, results) use indigo — a color that feels considered and calm, not clinical. The language around AI features ("We found your free time" not "Processing complete") reinforces this. The AI is on the group's side.

---

## Implementation notes (Expo/React Native)

### Font loading

```typescript
// app/_layout.tsx
import {
  useFonts,
  Fraunces_700Bold,
  Fraunces_700Bold_Italic,
} from '@expo-google-fonts/fraunces';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_700Bold,
    Fraunces_700Bold_Italic,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return <Slot />;
}
```

### Theme constants

```typescript
// constants/theme.ts
export const colors = {
  peachBase: '#FDF6F0',
  peachSoft: '#F5C4B3',
  peachMid: '#F0997B',
  peachPunch: '#D85A30',
  peachDeep: '#712B13',

  indigoBase: '#EEEDFE',
  indigoSoft: '#AFA9EC',
  indigoMid: '#7F77DD',
  indigoPunch: '#534AB7',
  indigoDeep: '#3C3489',

  mintBase: '#E1F5EE',
  mintSoft: '#9FE1CB',
  mintPunch: '#0F6E56',

  pageBg: '#FAFAF9',
  surface: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#A0A0A0',
  borderDefault: 'rgba(0,0,0,0.08)',
} as const;

export const fonts = {
  display: 'Fraunces_700Bold',
  displayItalic: 'Fraunces_700Bold_Italic',
  body: 'PlusJakartaSans_400Regular',
  bodySemibold: 'PlusJakartaSans_600SemiBold',
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;
```

### Reusable card component

```typescript
// components/Card.tsx
import { View, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '@/constants/theme';

type CardVariant = 'peach' | 'indigo' | 'mint' | 'neutral';

const cardStyles: Record<CardVariant, { background: string; borderColor: string }> = {
  peach:   { background: colors.peachBase,  borderColor: colors.peachSoft  },
  indigo:  { background: colors.indigoBase, borderColor: colors.indigoSoft },
  mint:    { background: colors.mintBase,   borderColor: colors.mintSoft   },
  neutral: { background: '#F7F6F3',         borderColor: colors.borderDefault },
};

export function Card({
  variant = 'neutral',
  children,
  style,
}: {
  variant?: CardVariant;
  children: React.ReactNode;
  style?: object;
}) {
  const { background, borderColor } = cardStyles[variant];
  return (
    <View style={[styles.card, { backgroundColor: background, borderColor }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 0.5,
    padding: spacing[4],
  },
});
```

### Animation constants

```typescript
// constants/animation.ts
import { Easing } from 'react-native-reanimated';

export const transitions = {
  cardEntrance: {
    duration: 280,
    easing: Easing.out(Easing.cubic),
  },
  buttonPress: {
    duration: 120,
    easing: Easing.in(Easing.cubic),
  },
  screenPush: {
    duration: 320,
    easing: Easing.inOut(Easing.cubic),
  },
  confirmedPop: {
    duration: 400,
    damping: 14,
    stiffness: 180,
  },
  listStaggerDelay: 50,
} as const;
```

---

## References

| Reference | What we borrow |
|---|---|
| Tiimo | Large display type, generous layout, card breathing room |
| Luma | Card structure, clean CTAs, strong brand moment on splash |
| SweetSync original | Peach + indigo palette, tinted card system, semantic color mapping |

---

*This document is the source of truth for all SweetSync visual decisions. Any deviation from this spec in implementation should be discussed and updated here.*
