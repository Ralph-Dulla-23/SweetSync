# SweetSync Master Animation Guide

This document defines the implementation standards for all animations in SweetSync to ensure a cohesive, high-quality, and "Apple-style" fluid interface.

---

## 1. Physical Principles
**Warm, Clear, Alive.** Every animation must use physical momentum. Avoid linear durations; use springs.

*   **Snappy:** For interactive feedback (buttons, toggles).
*   **Elegant:** For screen reveals and list entrances.
*   **Bouncy:** For playful success moments and celebrations.

---

## 2. Core Transitions & Components

### A. The "Fluid Tab" Wipe
Instead of snapping colors, the active tab indicator fills from the bottom up.

```tsx
// Implementation in _layout.tsx
const animatedStyle = useAnimatedStyle(() => ({
  height: withTiming(isFocused ? '100%' : '0%', { duration: 200 }),
  opacity: withTiming(isFocused ? 1 : 0, { duration: 150 }),
}));

// JSX Structure
<View style={styles.iconContainer}>
  <Icon color={colors.textTertiary} />
  <Animated.View style={[styles.activeFill, animatedStyle]}>
    <Icon color={colors.peachPunch} weight="fill" />
  </Animated.View>
</View>
```

### B. High-Fidelity VotePills
Synchronized interpolation of scale, border, and opacity.

```tsx
// Implementation in VotePills.tsx
const animatedStyle = useAnimatedStyle(() => {
  const isSelected = selected.value;
  return {
    transform: [{ scale: withSpring(isSelected ? 1.08 : 1, springConfigs.snappy) }],
    borderWidth: withTiming(isSelected ? 2 : 1, { duration: 150 }),
    opacity: withTiming(isSelected ? 1 : 0.6, { duration: 150 }),
    backgroundColor: interpolateColor(
      isSelected ? 1 : 0,
      [0, 1],
      [colors.white, background]
    ),
  };
});
```

### C. Reanimated Skeleton Pulse
Replacing legacy `Animated` API for consistent physics.

```tsx
// Implementation in Skeleton.tsx
const opacity = useSharedValue(0.3);

useEffect(() => {
  opacity.value = withRepeat(
    withSequence(
      withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.sin) })
    ),
    -1,
    true
  );
}, []);

const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
```

### D. Staggered List Entrances
Use `.springify()` with a calculated delay for a "cascading" reveal.

```tsx
// Implementation in Index/Home/Votes lists
{items.map((item, index) => (
  <Animated.View
    key={item.id}
    entering={FadeInUp
      .springify()
      .damping(springConfigs.elegant.damping)
      .stiffness(springConfigs.elegant.stiffness)
      .delay(index * 50)
    }
  >
    <Card item={item} />
  </Animated.View>
))}
```

---

## 3. High-Impact Moments

### E. Heat Map "Breathing"
Global pulse for AI-found magic slots to prevent per-cell performance hits.

```tsx
// Parent HeatMap.tsx
const pulse = useSharedValue(0);
// Loop 0 -> 1 -> 0 every 2 seconds
// Pass 'pulse' to all magic-ringed cells
const ringStyle = useAnimatedStyle(() => ({
  opacity: interpolate(pulse.value, [0, 1], [0.4, 1]),
  transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.05]) }]
}));
```

### F. The Celebration Sequence
Sequential "pop-in" of elements on the Confirmed screen.

```tsx
// Timeline Logic
0ms:   Background fades in
150ms: Sparkle scales 0 -> 1.2 -> 1 (Bouncy)
300ms: Title slides up + fades in
450ms: Card slides up + spring bounce
600ms: Avatar stack pops sequentially (30ms apart)
```

---

## 4. Animation Token Reference
Always import these from `@/constants/animation`.

| Token | Damping | Stiffness | Usage |
| :--- | :--- | :--- | :--- |
| `snappy` | 15 | 120 | Interaction (Pills, Buttons) |
| `bouncy` | 12 | 150 | Playful moments (Success) |
| `elegant` | 20 | 90 | Structural (Reveals, Lists) |

---
*Reference: Derived from `app/animations.md` and `ANIMATION_REFACTOR.md`.*
