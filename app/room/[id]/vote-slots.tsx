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
import { VotePills } from '@/components/VotePills';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Info, Sparkle, Clock, Warning, CalendarStar, Calendar } from 'phosphor-react-native';
import Animated, { FadeInUp, FadeInDown, Layout } from 'react-native-reanimated';
import { styles } from './_vote-slots.styles';
import { useGlobalAvailability } from '@/hooks/useGlobalAvailability';
import { useTimeVoting, VoteType } from '@/hooks/useTimeVoting';
import { getWeekDays, slotIndexToTime } from '@/lib/time';
import { format, parseISO } from 'date-fns';
import { CoordinationSkeleton } from '@/components/CoordinationSkeleton';

// Optional Haptics
let Haptics: any;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  Haptics = null;
}

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
  const { votes, castVote } = useTimeVoting(id as string);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const { checkConflict } = useGlobalAvailability();

  React.useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => setInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const weekDays = useMemo(() => getWeekDays(), []);

  const mockSlotOptions: TimeSlotOption[] = useMemo(() => [
    { id: '1', date: weekDays[4], slotIndex: 36, durationSlots: 4, freeCount: 5, totalCount: 5 }, // Friday 6pm
    { id: '2', date: weekDays[5], slotIndex: 32, durationSlots: 4, freeCount: 4, totalCount: 5 }, // Saturday 4pm
    { id: '3', date: weekDays[1], slotIndex: 22, durationSlots: 4, freeCount: 3, totalCount: 5 }, // Tuesday 11am - CONFLICT with Study Session
  ], [weekDays]);

  const handleVote = (slot: TimeSlotOption, type: VoteType) => {
    if (Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    castVote(slot.id, slot.date, slot.slotIndex, slot.slotIndex + slot.durationSlots - 1, type);
  };

  const handleConfirm = () => {
    setLoading(true);
    if (Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push(`/room/${id}/vote-activity`);
    }, 1500);
  };

  const hasVotes = Object.keys(votes).length > 0;

  const slotOptionsWithConflicts = useMemo(() => {
    return mockSlotOptions.map(slot => ({
      ...slot,
      conflicts: checkConflict(slot.date, slot.slotIndex, slot.slotIndex + slot.durationSlots - 1)
    }));
  }, [mockSlotOptions, checkConflict]);

  if (initialLoading) {
    return <CoordinationSkeleton type="time" />;
  }

  if (mockSlotOptions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Pick a Time" showBack />
        <EmptyState 
          icon={<CalendarStar size={64} color={colors.peachSoft} weight="duotone" />}
          title="No gaps found yet"
          description="The AI couldn't find a time that works for everyone. Try adding more availability or inviting more friends."
          action={
            <Button 
              title="Add Availability" 
              onPress={() => router.push('/(tabs)/calendar')} 
              variant="primary"
            />
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="When should we meet?" 
        subtitle="Step 1 of 2" 
        showBack 
        backLabel="Room" 
      />

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.hero}
        >
          <View style={styles.iconCircle}>
            <Clock size={32} color={colors.indigoPunch} weight="duotone" />
          </View>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Pick a Time</Text>
            <Text style={styles.heroSubtitle}>
              AI found {mockSlotOptions.length} gaps that work for the squad.
            </Text>
          </View>
        </Animated.View>

        <View style={styles.slotList}>
          {slotOptionsWithConflicts.map((slot, index) => {
            const hasConflict = slot.conflicts.length > 0;
            const formattedDay = format(parseISO(slot.date), 'EEEE');
            const formattedTime = slotIndexToTime(slot.slotIndex);
            const currentVoteType = votes[slot.id]?.type;

            return (
              <Animated.View 
                key={slot.id} 
                entering={FadeInUp.delay(400 + index * 100).duration(600)}
                layout={Layout.springify()}
                style={[
                  styles.slotContainer,
                  slot.freeCount === slot.totalCount && { borderColor: colors.mintSoft, backgroundColor: colors.mintBase }
                ]}
              >
                <SlotCard 
                  time={`${formattedDay} at ${formattedTime}`}
                  freeCount={slot.freeCount}
                  totalCount={slot.totalCount}
                  transparent
                  style={{ padding: spacing[4] }}
                />
                
                {hasConflict && (
                  <View style={[
                    localStyles.conflictWarning,
                    currentVoteType === 'free' && { borderColor: colors.peachPunch, borderWidth: 1 }
                  ]}>
                    <Calendar size={14} color={colors.peachPunch} weight="bold" />
                    <Text style={localStyles.conflictText}>
                      {currentVoteType === 'free' 
                        ? "Wait, your schedule changed!" 
                        : `Schedule Conflict: ${slot.conflicts[0].title}`}
                    </Text>
                  </View>
                )}

                <View style={[
                  styles.voteArea,
                  slot.freeCount === slot.totalCount && { borderTopColor: colors.mintSoft, backgroundColor: colors.mintSoft + '40' }
                ]}>
                  <VotePills 
                    selectedVote={currentVoteType}
                    onVote={(type) => handleVote(slot, type)}
                  />
                </View>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View 
          entering={FadeInUp.delay(800).duration(600)}
          style={styles.infoBox}
        >
          <Sparkle size={20} color={colors.peachPunch} weight="fill" />
          <Text style={styles.infoText}>
            Voting 'Prefer' helps the AI prioritize slots that are best for everyone. We'll suggest activities based on the winning time!
          </Text>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title={hasVotes ? "Confirm Times" : "Vote on a slot"}
          disabled={!hasVotes || loading}
          loading={loading}
          pulse={hasVotes}
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
    backgroundColor: colors.peachBase,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
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
