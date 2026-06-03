import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, Platform, Pressable, Text } from 'react-native';
import { 
  House, 
  CalendarBlank, 
  Plus, 
  ListChecks, 
  UserCircle 
} from 'phosphor-react-native';
import { colors } from '@/constants/theme';
import { springConfigs } from '@/constants/animation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  withSpring,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated';

import { styles } from './_layout.styles';

const CreatePill = ({ onPress }: { onPress: () => void }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    // Subtle, slow breath instead of aggressive pulse
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.createButtonTab, pressed && { opacity: 0.8 }]}
    >
      <Animated.View style={[styles.createButton, animatedStyle]}>
        <Plus weight="bold" size={24} color={colors.white} />
      </Animated.View>
    </Pressable>
  );
};

// Custom Tab Bar Component for Sliding Pill Animation
function CustomTabBar({ state, descriptors, navigation, insets }: any) {
  const activeIndex = state.index;
  const tabWidth = useSharedValue(0);
  const translateX = useSharedValue(0);

  const onLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    tabWidth.value = width / state.routes.length;
  };

  useEffect(() => {
    if (tabWidth.value > 0) {
      translateX.value = withSpring(activeIndex * tabWidth.value, springConfigs.snappy);
    }
  }, [activeIndex, tabWidth.value]);

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View 
      onLayout={onLayout}
      style={[styles.tabBarContainer, { 
        height: Platform.OS === 'web' ? 70 : 64 + insets.bottom,
        paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
      }]}
    >
      {/* Sliding Pill Background */}
      <Animated.View 
        style={[
          styles.slidingPillContainer, 
          { width: `${100 / state.routes.length}%` }, // Use percentage for stable width
          animatedPillStyle
        ]}
      >
        <View style={styles.activePillIndicator} />
      </Animated.View>

      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Center button is handled differently
        if (route.name === 'create') {
          return (
            <CreatePill key={route.key} onPress={onPress} />
          );
        }

        const Icon = index === 0 ? House : 
                     index === 1 ? CalendarBlank : 
                     index === 3 ? ListChecks : UserCircle;

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={({ pressed }) => [styles.tabItem, pressed && { opacity: 0.7 }]}
          >
            <View style={styles.iconWrapper}>
              <Icon 
                weight={isFocused ? 'fill' : 'regular'} 
                size={22} 
                color={isFocused ? colors.peachPunch : colors.textTertiary} 
              />
            </View>
            {label ? (
              <Text style={[
                styles.tabLabel, 
                { color: isFocused ? colors.peachPunch : colors.textTertiary }
              ]}>
                {label}
              </Text>
            ) : null}
            
            {/* Badge for Votes */}
            {route.name === 'votes' && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} insets={insets} />}
      screenOptions={{ 
        headerShown: false,
        lazy: true,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar' }} />
      <Tabs.Screen name="create" options={{ title: '' }} />
      <Tabs.Screen name="votes" options={{ title: 'Votes' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
