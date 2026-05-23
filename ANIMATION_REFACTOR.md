# Animation Audit & Refactor Plan

## The "Disconnected" vs. "High Quality" Gap

Currently, SweetSync's animations feel "low quality" because they rely on generic presets and instant state snaps. This document outlines the specific failures identified in the **Votes Tab** and the path to fixing them.

---

### 1. The Core Issues

| Feature | Current State (Disconnected) | Target State (High Quality) |
| :--- | :--- | :--- |
| **List Reveals** | Uses generic `FadeInUp` presets. Linear and "web-like." | **Staggered Spring Reveal.** Each card follows the next with a 50ms delay using `springConfigs.elegant`. |
| **Vote Selection** | Scale "pops" but border and opacity **snap** instantly. | **Interpolated Fluidity.** Border width, opacity, and scale all animate together over 150ms. |
| **Task Completion** | Content "swaps" immediately. Background snaps to green. | **Morphing Transition.** Background color interpolates; success icon scales in while old text fades out. |
| **Tab Navigation** | Color changes instantly. No motion. | **Bottom-Up Wipe.** Active icons fill with peach color from bottom-to-top over 200ms. |

---

### 2. Implementation Strategy: Mission 1

We will move away from `exiting={FadeOutLeft}` and `entering={FadeInUp}` in favor of custom `useAnimatedStyle` hooks that utilize our `springConfigs`.

#### Refactored VotePill Snippet
This snippet demonstrates how to animate **Border Width**, **Opacity**, and **Scale** simultaneously for a premium feel.

```tsx
// Improved VotePill Logic
const animatedStyle = useAnimatedStyle(() => {
  const isSelected = selected.value;
  
  return {
    transform: [{ 
      scale: withSpring(isSelected ? 1.08 : 1, springConfigs.snappy) 
    }],
    borderWidth: withTiming(isSelected ? 1.5 : 0.5, { duration: 150 }),
    opacity: withTiming(isSelected ? 1 : 0.6, { duration: 150 }),
    backgroundColor: interpolateColor(
      selected.value,
      [0, 1],
      [colors.white, background]
    )
  };
});
```

---

### 3. Priority Roadmap

1.  **Refactor VotePills:** Fix the "snapping" borders and aggressive scale.
2.  **Tab Bar "Wipe":** Implement the fluid active indicator in `_layout.tsx`.
3.  **TaskCard Morph:** Replace the hard state toggle with a background color interpolation.
4.  **Staggered Lists:** Implement custom staggered entrance for `TaskCard` using `delay` + `withSpring`.

---

*Reference: See `app/animations.md` for the full high-fidelity vision.*
