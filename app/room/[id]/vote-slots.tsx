import React, { useState, useMemo } from 'react';
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
import { Info, Sparkle, Clock, Warning } from 'phosphor-react-native';
import Animated, { FadeInUp, FadeInDown, Layout, FadeIn } from 'react-native-reanimated';
import { styles } from './_vote-slots.styles';
import { useGlobalAvailability } from '@/hooks/useGlobalAvailability';
import { getWeekDays, slotIndexToTime } from '@/lib/time';
import { format, parseISO } from 'date-fns';

interface TimeSlotOption {
  id: string;
  date: string;
  slotIndex: number;
  durationSlots: number;
  freeCount: number;
  totalCount: number;
  myVote?: VoteType;
}

export default function VoteSlotsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [votes, setVotes] = useState<Record<string, VoteType>>({});
  const [loading, setLoading] = useState(false);
  const { checkConflict } = useGlobalAvailability();

  const weekDays = useMemo(() => getWeekDays(), []);

  const mockSlotOptions: TimeSlotOption[] = useMemo(() => [
    { id: '1', date: weekDays[4], slotIndex: 36, durationSlots: 4, freeCount: 5, totalCount: 5 }, // Friday 6pm
    { id: '2', date: weekDays[5], slotIndex: 32, durationSlots: 4, freeCount: 4, totalCount: 5 }, // Saturday 4pm
    { id: '3', date: weekDays[1], slotIndex: 22, durationSlots: 4, freeCount: 3, totalCount: 5 }, // Tuesday 11am - CONFLICT with Study Session
  ], [weekDays]);

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
          {mockSlotOptions.map((slot, index) => {
            const conflicts = checkConflict(slot.date, slot.slotIndex, slot.slotIndex + slot.durationSlots - 1);
            const hasConflict = conflicts.length > 0;
            const formattedDay = format(parseISO(slot.date), 'EEEE');
            const formattedTime = slotIndexToTime(slot.slotIndex);

            return (
              <Animated.View 
                key={slot.id}
                entering={FadeInUp.duration(500).delay(300 + index * 100)}
                layout={Layout.springify()}
              >
                <View style={styles.slotContainer}>
                  <SlotCard 
                    time={`${formattedDay} at ${formattedTime}`}
                    freeCount={slot.freeCount}
                    totalCount={slot.totalCount}
                  />
                  
                  {hasConflict && (
                    <Animated.View entering={FadeIn.duration(400)} style={styles.conflictWarning}>
                      <Warning size={14} color={colors.peachPunch} weight="bold" />
                      <Text style={styles.conflictText}>
                        Conflict: {conflicts[0].title} {conflicts[0].sourceType === 'room' ? `(${conflicts[0].roomName})` : ''}
                      </Text>
                    </Animated.View>
                  )}

                  <View style={styles.voteArea}>
                    <VotePills 
                      selectedVote={votes[slot.id]}
                      onVote={(type) => handleVote(slot.id, type)}
                    />
                  </View>
                </View>
              </Animated.View>
            );
          })}
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

const localStyles = StyleSheet.create({
  conflictWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.sm,
    marginTop: -8,
    marginBottom: 8,
    marginHorizontal: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.peachSoft,
  },
  conflictText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.peachPunch,
  }
});


