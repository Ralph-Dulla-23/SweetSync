# Toast Implementation Findings and Architecture

## Analysis
The `package.json` did not contain any global toast libraries (such as `react-native-toast-message` or `sonner`). Due to the project's requirement to maintain high visual polish ("Pro Max" styling) using standard design tokens, I decided to build a custom Animated Toast Context instead of adding another heavy external dependency.

## Architecture
1. **Toast Component/Context (`components/Toast.tsx`)**:
   - I built a `ToastProvider` that encapsulates state for displaying a toast (currently managing one toast at a time for simplicity).
   - I exposed a custom hook `useToast()` providing a `showToast({ type, message })` method.
   - The UI component (`ToastItem`) uses `react-native-reanimated` with `SlideInUp` and `FadeOutUp` layout animations to create a native-feeling drop-down toast from the top of the screen (respecting safe area insets).
   - The design strictly references colors, typography, border radius, and shadows from `@/constants/theme.ts`.
   - I used `phosphor-react-native` icons for varying states (`CheckCircle` for success, `WarningCircle` for error, and `Info` for default/info).

2. **Root Injection (`app/_layout.tsx`)**:
   - Integrated the `ToastProvider` outside of the `Stack` navigation, ensuring any screen inside the app can fire notifications globally without being limited to a specific page's unmounting cycle.

3. **Demonstration (`hooks/useRoom.ts`)**:
   - Validated the behavior by wrapping the async simulation calls in `hooks/useRoom.ts`. When updating a member's status or nudging a member, the system now calls `showToast()` to provide immediate user feedback on success or failure.

## Security
No environment variables, secrets, or protected credentials were hardcoded, exposed, or written during this implementation.