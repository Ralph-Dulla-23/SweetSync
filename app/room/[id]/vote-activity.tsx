import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Header } from '@/components/Header';
import { ActivityCard } from '@/components/ActivityCard';
import { Button } from '@/components/Button';
import { Sparkle, Plus, MagicWand } from 'phosphor-react-native';
import Animated, { FadeInUp, FadeInDown, Layout } from 'react-native-reanimated';
import { styles } from './_vote-activity.styles';
import { CoordinationSkeleton } from '@/components/CoordinationSkeleton';

// Optional Haptics
let Haptics: any;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  Haptics = null;
}

interface ActivityOption {
  id: string;
  title: string;
  votes: number;
  isAI?: boolean;
}

const mockActivities: ActivityOption[] = [
  { id: '1', title: 'Movie Night at Raphael\'s', votes: 3, isAI: true },
  { id: '2', title: 'Study Session @ Library', votes: 2, isAI: true },
  { id: '3', title: 'Late Night Tacos', votes: 4, isAI: true },
];

export default function VoteActivityScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityOption[]>(mockActivities);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [newActivity, setNewActivity] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => setInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleVote = (activityId: string) => {
    if (Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const newSelected = new Set(selectedIds);
    if (newSelected.has(activityId)) {
      newSelected.delete(activityId);
    } else {
      newSelected.add(activityId);
    }
    setSelectedIds(newSelected);
  };

  const handleAddActivity = () => {
    if (!newActivity.trim()) return;
    if (Haptics) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    const newItem: ActivityOption = {
      id: Math.random().toString(),
      title: newActivity.trim(),
      votes: 1,
      isAI: false,
    };
    setActivities([newItem, ...activities]);
    setSelectedIds(new Set([...selectedIds, newItem.id]));
    setNewActivity("");
  };

  const handleFinalize = () => {
    setLoading(true);
    if (Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // Simulate finalizing decision
    setTimeout(() => {
      setLoading(false);
      router.push(`/room/${id}/results`);
    }, 2000);
  };

  if (initialLoading) {
    return <CoordinationSkeleton type="activity" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="What's the plan?" 
        subtitle="Step 2 of 2" 
        showBack 
        backLabel="Times" 
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            entering={FadeInDown.delay(200).duration(600)}
            style={styles.hero}
          >
            <View style={styles.iconCircle}>
              <MagicWand size={32} color={colors.peachPunch} weight="duotone" />
            </View>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>Pick Activities</Text>
              <Text style={styles.heroSubtitle}>
                AI found these based on your squad's vibe.
              </Text>
            </View>
          </Animated.View>

          <View style={styles.list}>
            {activities.map((activity, index) => (
              <Animated.View 
                key={activity.id}
                entering={FadeInUp.delay(400 + index * 100).duration(600)}
                layout={Layout.springify()}
              >
                <ActivityCard 
                  title={activity.title}
                  votes={activity.votes + (selectedIds.has(activity.id) ? 1 : 0)}
                  selected={selectedIds.has(activity.id)}
                  isAI={activity.isAI}
                  onPress={() => toggleVote(activity.id)}
                />
              </Animated.View>
            ))}
          </View>

          <Animated.View 
            entering={FadeInUp.delay(800).duration(600)}
            style={styles.addSection}
          >
            <Text style={styles.sectionLabel}>Something else?</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Suggest an activity..."
                placeholderTextColor={colors.textTertiary}
                value={newActivity}
                onChangeText={setNewActivity}
              />
              <Button 
                onPress={handleAddActivity}
                style={styles.addButton}
                variant="indigo"
                icon={<Plus size={24} color={colors.white} weight="bold" />}
              />
            </View>
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            title={selectedIds.size > 0 ? "Lock it in!" : "Pick one or more"}
            disabled={selectedIds.size === 0 || loading}
            loading={loading}
            variant="primary"
            onPress={handleFinalize}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
