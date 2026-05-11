Looking at the project overview and everything we've built, here's what fits SweetSync specifically. Not generic animations — ones that reinforce the "Warm, Clear, Alive" pillars at the moments that matter.

---

## Screen transitions

**Shared element transition — Room card to Room interior**

When a user taps a room card on the home screen, the card should expand into the room interior screen. The room name stays in place and scales up from its card position to the screen header. The card background peach tint fans out to fill the screen before fading to the page background.

This is the highest-impact transition in the app. It makes the room feel like a real place you're entering, not a new screen loading.

```typescript
// React Native Reanimated shared element
// Room name: scale + translate from card position to header
// Card background: expand to full screen, then fade to #FAFAF9
// Duration: 380ms, spring with damping 22
```

**Bottom sheet spring — Slot detail, My Schedule tab**

Any bottom sheet (tapping a heat map cell, the "Start Voting" entry point) uses a spring that overshoots slightly and settles. Not a linear slide — a physical feeling.

```typescript
{
  damping: 18,
  stiffness: 200,
  mass: 0.8,
  // Slight overshoot feels like pulling something into place
}
```

---

## Heat map animations

This is the most animation-rich surface in the app. Three distinct animation layers.

**Cell fill transition — schedule upload reveals**

When a member confirms their schedule, the heat map cells don't snap to their new color instantly. Each affected cell transitions from its current shade to the new shade over 200ms with an ease-out curve. Cells that darken (becoming busier) fade in place. Cells that lighten (a free zone emerging) do a subtle brightness pulse before settling — like a light turning on.

```typescript
// Per-cell color interpolation via interpolateColor
// Trigger: real-time subscription fires
// Stagger: cells update in row order top to bottom, 8ms apart
// The effect reads as the heat map "breathing" into its new state
```

**Magic slot ring — AI-found free slots**

The peach ring around AI-found slots is not static. It has a slow, calm pulse — opacity cycling from 0.6 to 1.0 over 2 seconds, looping. Not aggressive. More like a heartbeat. When the user taps the slot, the ring expands outward briefly (scale 1 → 1.15 → 1) before the bottom sheet opens.

Per the Phase B plan, this animation runs from a single shared value on the parent `HeatMap` component, not one per cell — 336 independent loops would kill frame rate.

```typescript
// Parent HeatMap:
const pulse = useSharedValue(0);
useEffect(() => {
  pulse.value = withRepeat(
    withSequence(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.sin) })
    ),
    -1, // infinite
    true
  );
}, []);
// Pass `pulse` down to magic slot cells only
```

**Cell tap feedback**

Tapping any cell plays a quick scale press — 1 → 0.94 → 1 over 120ms. Standard iOS tap feedback but tighter than the default. No ripple (that's Android). Just the physical press.

---

## Voting screen

**Card swipe / response pill selection**

When a member taps Free, Prefer, or Can't on a slot card, two things happen simultaneously. The selected pill scales up slightly (1 → 1.08 → 1) and its border animates from 0.5px to 1.5px width. The other two pills fade to 60% opacity. The transition takes 150ms — fast enough to feel instant, slow enough to be visible.

```typescript
// Each pill: opacity, scale, borderWidth as animated values
// Selection: selected pill pops, others dim
// Deselection: reverse, then new selection pops
```

**Live vote tally count-up**

When a vote comes in via real-time subscription, the vote count number doesn't just update — it animates. The old number slides up and fades out, the new number slides up from below and fades in. Duration: 180ms. This is the standard iOS number transition used in App Store ratings and notification badges.

```typescript
// Reanimated + react-native-reanimated layout animations
// Key: treat each count value as a different component instance
// LayoutAnimation.configureNext for the count change
```

**Conflict warning banner entrance**

When the ghost conflict warning appears (Phase C), it doesn't snap in. It slides down from above the slot card with a spring — damping 20, stiffness 180. The peach banner pushes the vote pills downward as it enters rather than overlapping them. On dismiss it slides back up.

---

## AI processing screen

**Indigo orb breathing**

The centered indigo sparkle during AI processing has two animation layers. The sparkle mark itself rotates slowly — one full revolution every 8 seconds, imperceptible unless you stare at it. The bloom behind it pulses — scale cycling from 1.0 to 1.12 over 1.5 seconds, opacity from 0.6 to 1.0 simultaneously. The effect is calm and considered, not a loading spinner.

```typescript
// Sparkle: withRepeat(withTiming(360, { duration: 8000 }), -1)
// Bloom scale: withRepeat(withSequence(...), -1, true)
// Both run independently — they don't sync, which feels more organic
```

**Status row checkmark entrance**

As each schedule is processed, the status row transitions from a loading circle to a green check. The check draws itself — a path animation from 0% to 100% stroke-dashoffset over 300ms with ease-out. Then the row's background fades from neutral gray to mint green over 200ms. Small but it makes each confirmation feel earned.

---

## Confirmed event screen

**Celebration entrance — the most important animation in the app**

This screen is the payoff of the entire flow. It needs to feel earned, not just loaded.

The sequence runs on mount:

```
0ms:    Screen background fades in from white to #E1F5EE (200ms)
150ms:  Sparkle mark scales in from 0 with spring (damping 14, stiffness 180)
          — slight overshoot, settles with a bounce
300ms:  Room label slides up from 8px below, fades in (200ms)
420ms:  Event name "Movie Night" scales in from 0.85 to 1.0 (280ms ease-out)
          — Fraunces italic at 36pt, this is the money moment
560ms:  "is happening!" fades in (200ms)
680ms:  Details mint card slides up from 16px below (300ms spring)
820ms:  Avatar stack animates in — each avatar pops in sequentially
          50ms apart, scale 0 → 1.1 → 1, spring
980ms:  Buttons fade up (200ms)
```

After the sequence completes, a burst of small soft particles — 12 to 16 dots in peach and indigo — scatter outward from the sparkle mark and fade over 600ms. Not confetti. Small, minimal, tasteful. Think the iOS Wallet card flip particle effect, not a party popper.

```typescript
// Particles: absolute positioned dots
// Each: randomized angle, distance 40-80px, opacity 1→0, scale 1→0
// Staggered 0-80ms random delay per particle
// This is the one place where you can be a little extra
```

---

## Micro-interactions across the app

**Avatar stack entrance on home screen**

When the rooms list loads, avatar stacks don't appear all at once. Each avatar in a stack pops in sequentially — 40ms apart, scale 0 → 1.05 → 1, spring. For a 5-person stack that's a 200ms cascade. Subtle enough that most users won't consciously notice it, but the screen feels alive rather than painted.

**Progress bar fill**

The schedule upload progress bar fills with a spring, not a linear tween. When it jumps from 60% to 80% (3 of 5 to 4 of 5), it overshoots to 83% and bounces back. The fill color also does a brief brightness flash at the moment of update.

**Button press state**

Every button in the app uses the same press animation — scale 1 → 0.97, opacity 1 → 0.9, duration 100ms on press in, spring back on release. Faster than you'd think necessary. At 100ms it feels physical. At 150ms it starts feeling slow.

**Tab bar active indicator**

When switching tabs, the active icon doesn't just change color. The peach color fills in from the bottom of the icon upward over 200ms — a subtle wipe transition. The label simultaneously fades from gray to peach. The inactive icon does the reverse. iOS-native energy without requiring native code.

---

## What to tell the agent

When you're ready to implement these, break them into three missions:

**Mission 1** — Core micro-interactions: button press, pill selection, progress bar, tab bar. These are the foundation — every screen benefits from them.

**Mission 2** — Heat map animations: cell fill transition, magic slot pulse, cell tap feedback. Reference the Phase B batching plan — the pulse shared value is already in scope.

**Mission 3** — Celebration sequence: confirmed event entrance, particle burst. This is the highest-visibility animation in the app and deserves its own focused session.

The shared element room transition is the most complex and should be its own mission after everything else is stable — it touches both the home screen and room interior simultaneously.