import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import { 
  House, 
  CalendarBlank, 
  Plus, 
  ListChecks, 
  UserCircle 
} from 'phosphor-react-native';
import { colors, fonts, spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  useSharedValue, 
  withSpring
} from 'react-native-reanimated';

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
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.createButtonTab}
              activeOpacity={0.8}
            >
              <View style={styles.createButton}>
                <Plus weight="bold" size={24} color={colors.white} />
              </View>
            </TouchableOpacity>
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

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 8,
    elevation: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 42,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  activePill: {
    backgroundColor: colors.peachBase,
  },
  tabLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  createButtonTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  createButton: {
    top: -20,
    width: 52,
    height: 52,
    backgroundColor: colors.indigoPunch,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: colors.indigoPunch,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    borderWidth: 3,
    borderColor: colors.white,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: '20%',
    backgroundColor: colors.peachPunch,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.bodySemibold,
  },
});
