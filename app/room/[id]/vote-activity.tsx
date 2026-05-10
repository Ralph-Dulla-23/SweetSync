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
import { styles } from './vote-activity.styles';

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
  const [activities, setActivities] = useState<ActivityOption[]>(mockActivities);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [newActivity, setNewActivity] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleVote = (activityId: string) => {
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
    // Simulate finalizing decision
    setTimeout(() => {
      setLoading(false);
      router.push(`/room/${id}/results`);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="What's the plan?" 
        subtitle="Step 2 of 2" 
        showBack 
        backLabel="Time" 
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(600).delay(100)}>
            <View style={styles.hero}>
              <View style={styles.iconCircle}>
                <MagicWand size={32} color={colors.peachPunch} weight="duotone" />
              </View>
              <Text style={styles.heroTitle}>Pick an Activity</Text>
              <Text style={styles.heroSubtitle}>
                The AI suggested these based on your group's interests.
              </Text>
            </View>
          </Animated.View>

          <View style={styles.list}>
            {activities.map((activity, index) => (
              <Animated.View 
                key={activity.id}
                entering={FadeInUp.duration(500).delay(300 + index * 100)}
                layout={Layout.springify()}
              >
                <View style={[
                  styles.cardWrapper,
                  selectedIds.has(activity.id) && styles.selectedWrapper
                ]}>
                  <ActivityCard 
                    title={activity.title}
                    votes={activity.votes + (selectedIds.has(activity.id) ? 1 : 0)}
                    onPress={() => toggleVote(activity.id)}
                  />
                  {activity.isAI && (
                    <View style={styles.aiBadge}>
                      <Sparkle size={10} color={colors.indigoPunch} weight="fill" />
                      <Text style={styles.aiText}>AI</Text>
                    </View>
                  )}
                </View>
              </Animated.View>
            ))}
          </View>

          <Animated.View entering={FadeInUp.delay(800)} style={styles.addSection}>
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
                icon={<Plus size={20} color={colors.white} weight="bold" />}
              />
            </View>
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            title={selectedIds.size > 0 ? "Lock it in!" : "Select an option"}
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

