import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { CaretLeft } from "phosphor-react-native";
import { colors } from "@/constants/theme";
import { Avatar } from "./Avatar";
import { styles } from "./Header.styles";

interface HeaderProps {
  title: string;
  subtitle?: string;
  subtitlePosition?: "above" | "below";
  showBack?: boolean;
  backLabel?: string;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  userAvatar?: boolean;
}

export const Header = React.memo(({ 
  title, 
  subtitle, 
  subtitlePosition = "above",
  showBack = false, 
  backLabel = "Back",
  onBackPress,
  rightElement,
  userAvatar = false
}: HeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }
    
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback to home if no history (e.g. opened from notification)
      router.replace("/(tabs)");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
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
});

