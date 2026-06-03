import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ToastConfig } from 'react-native-toast-message';
import { CheckCircle, XCircle, Info } from 'phosphor-react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { springConfigs } from '@/constants/animation';
import Animated, { ZoomIn } from 'react-native-reanimated';

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <Animated.View 
      entering={ZoomIn.duration(300).springify().damping(springConfigs.snappy.damping).stiffness(springConfigs.snappy.stiffness)}
      style={[styles.container, styles.successContainer]}
      accessibilityRole="alert"
      accessibilityLabel={`Success: ${text1}${text2 ? `. ${text2}` : ''}`}
    >
      <CheckCircle size={24} color={colors.mintPunch} weight="fill" />
      <View style={styles.textContainer}>
        <Text style={styles.text1}>{text1}</Text>
        {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
      </View>
    </Animated.View>
  ),
  error: ({ text1, text2 }) => (
    <Animated.View 
      entering={ZoomIn.duration(300).springify().damping(springConfigs.snappy.damping).stiffness(springConfigs.snappy.stiffness)}
      style={[styles.container, styles.errorContainer]}
      accessibilityRole="alert"
      accessibilityLabel={`Error: ${text1}${text2 ? `. ${text2}` : ''}`}
    >
      <XCircle size={24} color={colors.voteCantText} weight="fill" />
      <View style={styles.textContainer}>
        <Text style={styles.text1}>{text1}</Text>
        {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
      </View>
    </Animated.View>
  ),
  info: ({ text1, text2 }) => (
    <Animated.View 
      entering={ZoomIn.duration(300).springify().damping(springConfigs.snappy.damping).stiffness(springConfigs.snappy.stiffness)}
      style={[styles.container, styles.infoContainer]}
      accessibilityRole="alert"
      accessibilityLabel={`Information: ${text1}${text2 ? `. ${text2}` : ''}`}
    >
      <Info size={24} color={colors.indigoPunch} weight="fill" />
      <View style={styles.textContainer}>
        <Text style={styles.text1}>{text1}</Text>
        {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
      </View>
    </Animated.View>
  ),
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    marginHorizontal: spacing[4],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    width: '90%',
    maxWidth: 400,
  },
  successContainer: {
    backgroundColor: colors.mintBase,
    borderColor: colors.mintSoft,
  },
  errorContainer: {
    backgroundColor: colors.voteCantBg,
    borderColor: colors.voteCantBorder,
  },
  infoContainer: {
    backgroundColor: colors.indigoBase,
    borderColor: colors.indigoSoft,
  },
  textContainer: {
    marginLeft: spacing[3],
    flex: 1,
  },
  text1: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  text2: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 1,
    lineHeight: 18,
  },
});
