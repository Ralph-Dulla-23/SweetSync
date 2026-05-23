# SweetSync — Animation System Coherence

**Version:** 1.0  
**Last updated:** May 8, 2026  
**Author:** Raphael  
**Companion to:** `MASTER_ANIMATIONS.md`, `DESIGN.md`, `CLAUDE.md`

---

## Why the animations feel disconnected

Every section in `MASTER_ANIMATIONS.md` answers "how does this component animate" but nobody answered "how does this screen relate to the screen before it." The VotePills know how to select. The celebration sequence knows how to enter. But when you go from the home screen to a room to the heat map to voting to confirmation — each screen wakes up and does its own thing. There is no thread connecting them.

Three specific reasons this happens.

---

## Root cause 1 — No shared entering and exiting contract

Every screen has an entering animation. Almost no screen has an exiting animation. The home screen card list cascades in beautifully — and then when you tap a room it cuts or slides to whatever the OS default is. The entering animation was built. The exiting animation was never considered.

High-end apps define both sides. When you tap a room card, the card you tapped scales up and the other cards fade down and scale slightly away — before the new screen appears. The new screen's entrance is choreographed to feel like it's coming from the card you just tapped. Exit and entrance are one continuous motion, not two separate events.

```tsx
// What's in MASTER_ANIMATIONS.md — entrance only
entering={FadeInUp.springify().damping(20).stiffness(90).delay(index * 50)}

// What's missing — the exit when user taps a card
exiting={FadeOutDown.springify().damping(20).stiffness(90).delay(index * 30)}
// + the tapped card itself scales up via shared element
```

---

## Root cause 2 — Spring tokens used inconsistently across screens

The token table in `MASTER_ANIMATIONS.md` defines `snappy`, `elegant`, and `bouncy`. But if the agent built screens in separate missions — which it did — each screen may use slightly different spring values that weren't pulled from the token file. One screen's "elegant" might be damping 20 stiffness 90. Another might be damping 18 stiffness 100 because the agent approximated.

The result is subtle but your eye catches it. The home screen list feels slightly different from the voting card entrance, which feels slightly different from the bottom sheet spring. None of them are wrong individually. Together they feel like four different developers worked on them.

**Fix:** audit every `withSpring` call in the codebase and replace raw values with the token constants. The agent can do this in one mission.

```tsx
// Find and replace all instances of this pattern
withSpring(value, { damping: 18, stiffness: 200 })

// With the token reference
withSpring(value, springConfigs.snappy)
```

Run this to find every hardcoded spring value in the project:

```bash
grep -rn "damping:" app/ components/ --include="*.tsx" | grep -v "springConfigs"
```

Every result is a place where the animation system is speaking a different dialect. Fix them all, and the whole app starts moving in the same language.

---

## Root cause 3 — No motion narrative across the scheduling flow

SweetSync has five phases. Each phase should feel like a progression — the animations should get slightly more energetic as the flow advances toward confirmation, then release fully on the confirmed screen.

Right now all five phases use the same animation language. The home screen and the confirmed event screen feel tonally equivalent. That is wrong. The confirmed screen is the emotional payoff of everything that came before it. It should feel dramatically different — bigger, bouncier, more alive — not just a different layout with the same spring values.

---

## Motion escalation rule

Spring tokens are assigned by phase, not by component type. Later phase means more energy.

| Phase | Screens | Spring token | Character |
|---|---|---|---|
| 1 | Home — rooms list | `elegant` | Calm, browsing, no urgency |
| 2 | Room interior | `elegant` → `snappy` | Slightly more alive, active space |
| 3 | Heat map, AI reveal | `snappy` | Responsive, physical, you're touching data |
| 4 | Voting | `snappy`, tighter delays | Momentum, decisive, you're close |
| 5 | Confirmed event | `bouncy` for everything | Full release of tension |

Each phase escalates. Spring damping decreases slightly as you move forward — things get a little bouncier. Stagger delays get shorter — things move faster. By the time the confirmed screen appears the whole system feels like it exhaled.

This is not a massive implementation change. It means being intentional about which spring token each screen uses and not defaulting to `elegant` everywhere because it is the safest choice.

---

## Screen transition contract

Every screen must define both entering and exiting behavior. The exiting animation of screen A and the entering animation of screen B must feel like one continuous motion — not two separate events that happen to be adjacent.

### Home → Room interior

```
Home exit:
  - Tapped card: scale 1 → 1.05, then expand toward room interior
  - Other cards: FadeOutDown with stagger, 30ms apart, elegant spring
  - Duration: 220ms total before room interior begins

Room interior enter:
  - Header (room name): slides down from card's name position — shared element
  - Member list: FadeInUp staggered, 40ms apart, elegant spring
  - Progress bar: fills in after list settles, 200ms delay
```

### Room interior → Heat map

```
Room exit:
  - Content FadeOutUp, 150ms, ease-in
  - Header stays in place and morphs into heat map header

Heat map enter:
  - Grid cells fill in column by column, left to right
  - Each column: 12ms apart
  - Each cell within column: 6ms apart
  - Color fills from pageBg to computed heat shade over 200ms per cell
  - Total grid entrance: approximately 400ms
```

### Heat map → AI results

```
Heat map exit:
  - Grid cells fade to indigoBase uniformly (the AI is "reading" everything)
  - 150ms ease-in-out
  - Then screen transitions

AI results enter:
  - Headline "We found X free slots" — FadeInUp, snappy spring, 0ms delay
  - Slot cards: staggered FadeInUp, 60ms apart, snappy spring
  - Each card is slightly more visible than if it used elegant — snappy makes
    the results feel urgent and real
```

### Voting → Confirmed

```
Voting exit:
  - Cards FadeOutDown fast — 120ms, no spring, just timing
  - Speed signals that something decisive just happened
  - Do not use a gentle exit here — the abruptness is intentional

Confirmed enter:
  - Full bouncy celebration sequence (see MASTER_ANIMATIONS.md section F)
  - Updated timing (see corrected timeline below)
```

---

## Corrected celebration sequence timing

The original timeline in `MASTER_ANIMATIONS.md` is slightly rushed. The sparkle needs more solo time before the title enters — it is the emotional anchor of the screen.

```
0ms:    Background fades from white to #E1F5EE — 200ms ease-out
200ms:  Sparkle mark scales in — bouncy spring (damping 12, stiffness 150)
          scale: 0 → 1.2 → 1 — the overshoot is intentional
420ms:  Room label "FRIDAY GANG" slides up 8px, fades in — 180ms ease-out
580ms:  Event name "Movie Night" scales in — elegant spring (damping 20, stiffness 90)
          This is the money moment. Fraunces italic 36pt needs its own beat.
740ms:  "is happening!" fades in — 160ms ease-out
860ms:  Details mint card slides up 16px — snappy spring
980ms:  Avatar stack — each avatar pops in 30ms apart, scale 0 → 1.1 → 1, bouncy
1160ms: Buttons fade up — 200ms ease-out
1200ms: Particle burst fires (see below)
```

### Particle burst

14 dots in peach and indigo scatter outward from the sparkle center and fade. Small, minimal, tasteful — not confetti.

```tsx
// CelebrationParticles.tsx
const particles = Array.from({ length: 14 }, (_, i) => ({
  angle: (i / 14) * 360 + Math.random() * 20, // evenly distributed with slight randomness
  distance: 50 + Math.random() * 40,           // 50–90px from center
  color: i % 2 === 0 ? colors.peachSoft : colors.indigoSoft,
  delay: Math.random() * 60,                   // 0–60ms random stagger
}));

// Each particle:
// opacity: 1 → 0 over 600ms ease-out
// scale:   1 → 0 over 600ms ease-out
// translateX/Y: computed from angle and distance
// All run simultaneously after 1200ms mount delay
```

---

## Missing animations to add to MASTER_ANIMATIONS.md

Four animations from the original discussion are not in the current file. Add them as sections G through J.

### G — Heat map cell color transition on schedule upload

When a member confirms their schedule and the real-time subscription fires, affected cells transition color smoothly rather than snapping.

```tsx
// HeatCell.tsx
const colorIndex = useSharedValue(initialIndex);

// When freeCount changes via real-time update:
colorIndex.value = withTiming(newIndex, {
  duration: 220,
  easing: Easing.out(Easing.cubic),
});

const animatedCellStyle = useAnimatedStyle(() => ({
  backgroundColor: interpolateColor(
    colorIndex.value,
    [0, 1, 2, 3, 4],
    [
      colors.pageBg,      // everyone free
      colors.indigoBase,  // mostly free
      colors.indigoSoft,  // mixed
      colors.indigoMid,   // mostly busy
      colors.indigoPunch, // everyone busy
    ]
  ),
}));
```

Row stagger on bulk update: cells update top to bottom, 8ms apart, so the heat map visibly "breathes" into its new state rather than flashing all at once.

### H — Magic slot tap ring expansion

The idle pulse is in `MASTER_ANIMATIONS.md` section E. Missing: what happens when the user taps a magic slot.

```tsx
// HeatMap.tsx — on magic slot press
const onMagicSlotPress = (slotId: string) => {
  ringScale.value = withSequence(
    withSpring(1.2, springConfigs.bouncy),
    withTiming(1, { duration: 100 })
  );
  // Open bottom sheet after ring responds
  setTimeout(() => runOnJS(openBottomSheet)(slotId), 150);
};
```

The ring reacts to being pressed before the sheet opens. Small but it makes the interaction feel physical rather than instantaneous.

### I — Conflict warning banner entrance and exit

The Phase C soft warning banner slides down from above the slot card and pushes the vote pills downward as it enters.

```tsx
// ConflictWarning.tsx
<Animated.View
  entering={SlideInDown
    .springify()
    .damping(springConfigs.snappy.damping)
    .stiffness(springConfigs.snappy.stiffness)
  }
  exiting={SlideOutUp.duration(200)}
  style={styles.warningBanner}
>
  {/* Peach card — no emoji, use Phosphor WarningCircle icon at 16px #D85A30 */}
  <Card variant="peach">
    <WarningCircle size={16} color={colors.peachPunch} weight="fill" />
    <Text>You have a tentative event in {conflictRoomName} at this time</Text>
  </Card>
</Animated.View>
```

Note: no ⚠️ emoji. Use `WarningCircle` from `phosphor-react-native` per the no-emoji rule in `DESIGN.md`.

### J — Vote tally count-up on real-time update

When a vote comes in via subscription the count number slides up and the old number exits upward.

```tsx
// AnimatedCount.tsx
// Key trick: changing key forces remount, triggering entering/exiting
<Animated.Text
  key={count}
  entering={SlideInUp.duration(180).easing(Easing.out(Easing.cubic))}
  exiting={SlideOutUp.duration(180).easing(Easing.in(Easing.cubic))}
  style={styles.countText}
>
  {count}
</Animated.Text>

// Wrap in overflow: 'hidden' container to clip the slide
```

---

## Token to add — gestural

Add this fourth token to `constants/animation.ts`. Gesture-driven animations need higher stiffness so the UI tracks the finger without lag. Lower stiffness makes the UI feel like it drags behind your hand.

```typescript
// constants/animation.ts
export const springConfigs = {
  snappy:   { damping: 15, stiffness: 120 }, // interaction — pills, buttons
  elegant:  { damping: 20, stiffness: 90  }, // structural — reveals, lists
  bouncy:   { damping: 12, stiffness: 150 }, // celebration — success moments
  gestural: { damping: 22, stiffness: 250 }, // gesture-driven — sheets, drags
} as const;
```

Use `gestural` for: bottom sheet drag, heat map cell long-press, any animation whose value is driven directly by a gesture handler. Never use `elegant` or `snappy` for gesture-driven motion — they are too slow to track a finger.

---

## Validation — add to CLAUDE.md pre-commit check

```bash
# Audit for hardcoded spring values not using token constants
# Every result is a disconnected animation — fix before committing
grep -rn "damping:" app/ components/ --include="*.tsx" | grep -v "springConfigs"

# Audit for screens missing exiting prop
grep -rn "entering=" app/ --include="*.tsx" -l | xargs grep -L "exiting="
```

The second command lists every file that has an `entering` prop but no `exiting` prop. Those are screens that have a choreographed entrance and an abrupt, undesigned exit. Every file in that list is a disconnection point in the user's flow.

---

## Mission instructions for the agent

When implementing animation coherence, run three separate missions in this order.

**Mission 1 — Spring token audit**

```
Read MASTER_ANIMATIONS.md and constants/animation.ts before starting.

Audit every withSpring() call in app/ and components/ that uses 
raw damping/stiffness values instead of springConfigs tokens.

Replace each raw value with the correct token from springConfigs 
based on the motion escalation rule:
- Phase 1-2 screens: springConfigs.elegant
- Phase 3 screens: springConfigs.snappy  
- Phase 4 screens: springConfigs.snappy
- Phase 5 (confirmed): springConfigs.bouncy

Do not change any layout, colors, or logic. Animation values only.
Show me a diff of every changed file before committing.
```

**Mission 2 — Exit animations**

```
Read the Screen Transition Contract section of ANIMATION_COHERENCE.md.

Add exiting props to every screen component that currently has an 
entering prop but no exiting prop.

Match each screen's exit to its transition contract — the exiting 
animation must feel like the first half of the entering animation 
on the next screen.

Do not change entering animations. Exiting only.
```

**Mission 3 — Missing animations G through J**

```
Read sections G, H, I, and J of ANIMATION_COHERENCE.md.

Implement each missing animation one at a time in this order:
G first (cell color transition), then H (ring tap), then I 
(conflict banner), then J (vote count).

After each one, confirm it runs on the UI thread via a Reanimated 
worklet and uses a springConfigs token, not raw values.
```

---

*This document extends `MASTER_ANIMATIONS.md` — do not duplicate entries. Reference this file for system-level coherence rules. Reference `MASTER_ANIMATIONS.md` for component-level implementation patterns.*
