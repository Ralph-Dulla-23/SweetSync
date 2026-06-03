import Toast, { ToastShowParams } from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

const show = (params: ToastShowParams) => {
  // Provide haptic feedback based on toast type
  if (params.type === 'success') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } else if (params.type === 'error') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } else if (params.type === 'info' || !params.type) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
  
  Toast.show(params);
};

const hide = () => {
  Toast.hide();
};

export const useSweetToast = () => {
  return { show, hide };
};
