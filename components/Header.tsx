import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { CaretLeft } from "phosphor-react-native";
import { colors, fonts, spacing } from "@/constants/theme";
import { Avatar } from "./Avatar";

interface HeaderProps {
  title: string;
  subtitle?: string;
  subtitlePosition?: "above" | "below";
  showBack?: boolean;
  backLabel?: string;
  rightElement?: React.ReactNode;
  userAvatar?: boolean;
}

export function Header({ 
  title, 
  subtitle, 
  subtitlePosition = "above",
  showBack = false, 
  backLabel = "Back",
  rightElement,
  userAvatar = false
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Go back to ${backLabel}`}
          >
            <CaretLeft size={18} color={colors.peachPunch} weight="bold" />
            <Text style={styles.backLabel}>{backLabel}</Text>
          </TouchableOpacity>
        )}
        
        {subtitle && subtitlePosition === "above" && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle && subtitlePosition === "below" && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>

      {(rightElement || userAvatar) && (
        <View style={styles.rightContainer}>
          {rightElement}
          {userAvatar && (
            <Avatar name="Raphael" size={38} color={colors.peachSoft} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Changed from flex-end to allow vertical breathing
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6], // Increased from spacing[4]
    paddingBottom: spacing[4],
    backgroundColor: colors.pageBg,
  },
  leftContainer: {
    flex: 1,
    gap: spacing[1], // Added consistent gap between elements
  },
  rightContainer: {
    paddingTop: spacing[1],
    justifyContent: "flex-start",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[2], // Increased gap between back and title
    marginLeft: -4,
    paddingVertical: 8, // Ensure 44px+ hit area
    paddingRight: 16,
  },
  backLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14, // Increased from 12px
    color: colors.peachPunch,
    marginLeft: 4,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13, // Increased from 12px
    color: colors.textSecondary,
    marginBottom: 2,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28, // Slightly increased from 26px for better Fraunces impact
    color: colors.textPrimary,
    lineHeight: 34,
  },
});
