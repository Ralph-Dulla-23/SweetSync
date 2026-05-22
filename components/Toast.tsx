import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeOutUp,
  SlideInUp,
  Easing
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { CheckCircle, WarningCircle, Info } from 'phosphor-react-native';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (options: { type: ToastType; message: string; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback(({ type, message, duration = 3000 }: { type: ToastType; message: string; duration?: number }) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, type, message });

    timerRef.current = setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <ToastItem key={toast.id} toast={toast} />}
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast }: { toast: ToastMessage }) => {
  const insets = useSafeAreaInsets();
  
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={24} color={colors.mintPunch} weight="fill" />;
      case 'error':
        return <WarningCircle size={24} color={colors.peachPunch} weight="fill" />;
      case 'info':
      default:
        return <Info size={24} color={colors.indigoPunch} weight="fill" />;
    }
  };

  const getContainerStyle = () => {
    switch (toast.type) {
      case 'success':
        return { backgroundColor: colors.mintBase, borderColor: colors.mintSoft };
      case 'error':
        return { backgroundColor: colors.conflictBg, borderColor: colors.conflictBorder };
      case 'info':
      default:
        return { backgroundColor: colors.indigoBase, borderColor: colors.indigoSoft };
    }
  };

  const getTextStyle = () => {
    switch (toast.type) {
      case 'success':
        return { color: colors.mintPunch };
      case 'error':
        return { color: colors.peachDeep };
      case 'info':
      default:
        return { color: colors.indigoDeep };
    }
  };

  return (
    <Animated.View
      entering={SlideInUp.duration(400).easing(Easing.out(Easing.back(1.5)))}
      exiting={FadeOutUp.duration(300)}
      style={[
        styles.container,
        { top: insets.top + spacing[2] },
        getContainerStyle(),
      ]}
    >
      <View style={styles.iconContainer}>{getIcon()}</View>
      <Text style={[styles.message, getTextStyle()]}>{toast.message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing[4],
    right: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: radius.xl,
    borderWidth: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 9999,
  },
  iconContainer: {
    marginRight: spacing[3],
  },
  message: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    flex: 1,
  },
});
