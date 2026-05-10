import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, Platform, TouchableOpacity, Text } from 'react-native';
import { 
  House, 
  CalendarBlank, 
  Plus, 
  ListChecks, 
  UserCircle 
} from 'phosphor-react-native';
import { colors } from '@/constants/theme';
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
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.createButtonTab}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.createButton, animatedStyle]}>
        <Plus weight="bold" size={24} color={colors.white} />
      </Animated.View>
    </TouchableOpacity>
  );
};

// Custom Tab Bar Component for Sliding Pill Animation
function CustomTabBar({ state, descriptors, navigation, insets }: any) {
  const activeIndex = state.index;
  const translateX = useSharedValue(0);

  useEffect(() => {
    // Update pill position when tab changes
    translateX.value = withSpring(activeIndex, {
      damping: 18,
      stiffness: 120,
    });
  }, [activeIndex]);

  return (
    <View style={[styles.tabBarContainer, { 
      height: Platform.OS === 'web' ? 70 : 64 + insets.bottom,
      paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
    }]}>
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
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrapper, isFocused && styles.activePill]}>
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
          </TouchableOpacity>
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
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar' }} />
      <Tabs.Screen name="create" options={{ title: '' }} />
      <Tabs.Screen name="votes" options={{ title: 'Votes' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
