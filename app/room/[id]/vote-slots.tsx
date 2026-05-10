import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Header } from '@/components/Header';
import { SlotCard } from '@/components/SlotCard';
import { VotePills, VoteType } from '@/components/VotePills';
import { Button } from '@/components/Button';
import { Info, Sparkle, Clock } from 'phosphor-react-native';
import Animated, { FadeInUp, FadeInDown, Layout } from 'react-native-reanimated';
import { styles } from './vote-slots.styles';

interface TimeSlotOption {
  id: string;
  day: string;
  time: string;
  freeCount: number;
  totalCount: number;
  myVote?: VoteType;
}

const mockSlotOptions: TimeSlotOption[] = [
  { id: '1', day: 'Friday', time: '6:00 PM', freeCount: 5, totalCount: 5 },
  { id: '2', day: 'Saturday', time: '4:00 PM', freeCount: 4, totalCount: 5 },
  { id: '3', day: 'Sunday', time: '12:00 PM', freeCount: 3, totalCount: 5 },
];

export default function VoteSlotsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [votes, setVotes] = useState<Record<string, VoteType>>({});
  const [loading, setLoading] = useState(false);

  const handleVote = (slotId: string, type: VoteType) => {
    setVotes(prev => ({
      ...prev,
      [slotId]: type
    }));
  };

  const handleConfirm = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push(`/room/${id}/vote-activity`);
    }, 1500);
  };

  const allVoted = mockSlotOptions.every(slot => votes[slot.id]);

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Vote on Time" 
        subtitle="Step 1 of 2" 
        showBack 
        backLabel="Room" 
      />

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <View style={styles.hero}>
            <View style={styles.iconCircle}>
              <Clock size={32} color={colors.indigoPunch} weight="duotone" />
            </View>
            <Text style={styles.heroTitle}>When should we meet?</Text>
            <Text style={styles.heroSubtitle}>
              The AI found {mockSlotOptions.length} gaps that work for most of the squad.
            </Text>
          </View>
        </Animated.View>

        <View style={styles.slotList}>
          {mockSlotOptions.map((slot, index) => (
            <Animated.View 
              key={slot.id}
              entering={FadeInUp.duration(500).delay(300 + index * 100)}
              layout={Layout.springify()}
            >
              <View style={styles.slotContainer}>
                <SlotCard 
                  time={`${slot.day} at ${slot.time}`}
                  freeCount={slot.freeCount}
                  totalCount={slot.totalCount}
                />
                <View style={styles.voteArea}>
                  <VotePills 
                    selectedVote={votes[slot.id]}
                    onVote={(type) => handleVote(slot.id, type)}
                  />
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInUp.delay(800)} style={styles.infoBox}>
          <Sparkle size={18} color={colors.peachPunch} weight="fill" />
          <Text style={styles.infoText}>
            Prefer higher counts! We'll suggest activities based on the winning time.
          </Text>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title={allVoted ? "Confirm Times" : "Vote on all slots"}
          disabled={!allVoted || loading}
          loading={loading}
          variant="primary"
          onPress={handleConfirm}
        />
      </View>
    </SafeAreaView>
  );
}

