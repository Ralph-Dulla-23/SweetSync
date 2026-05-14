import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  Share,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Users, 
  ShareNetwork, 
  Sparkle,
  Warning,
  Trophy
} from 'phosphor-react-native';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  Easing,
  Layout
} from 'react-native-reanimated';
import { useRoom } from '@/hooks/useRoom';
import { useAuth } from '@/hooks/useAuth';
import { globalStyles } from '@/styles/global';
import { styles } from './_results.styles';

interface MockActivity {
  id: string;
  title: string;
  votes: number;
  time: string;
  location: string;
}

const tiedActivities: MockActivity[] = [
  { id: '1', title: 'Movie Night at Raphael\'s', votes: 4, time: 'Friday, May 15 • 6:00 PM', location: 'Raphael\'s Apartment' },
  { id: '2', title: 'Late Night Tacos', votes: 4, time: 'Friday, May 15 • 8:30 PM', location: 'Taco Stand' },
];

export default function ResultsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { room, loading: roomLoading } = useRoom(id as string);
  
  const [isTie, setIsTie] = useState(true); // Forced for demo
  const [selectedWinner, setSelectedWinner] = useState<MockActivity | null>(null);
  const [confirmedWinner, setConfirmedWinner] = useState<MockActivity | null>(null);

  const isHost = room?.hostId === user?.id;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `SweetSync: ${confirmedWinner?.title || 'Our event'} is happening! 🍑`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleBreakTie = () => {
    if (selectedWinner) {
      setConfirmedWinner(selectedWinner);
      setIsTie(false);
    }
  };

  // Pulse animation for the winner card
  const pulse = useSharedValue(1);
  React.useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  if (isTie) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          title="It's a Tie!" 
          showBack 
          backLabel="Vote" 
        />
        <ScrollView contentContainerStyle={styles.content}>
          <Animated.View entering={FadeInDown.duration(600)}>
            <View style={styles.celebrationHeader}>
              <View style={[styles.successIcon, { backgroundColor: colors.peachBase }]}>
                <Warning size={40} color={colors.peachPunch} weight="fill" />
              </View>
              <Text style={styles.title}>Deadlock! 🔒</Text>
              <Text style={styles.subtitle}>
                {isHost 
                  ? "The squad is split exactly 50/50. As host, you get the final say." 
                  : "We're waiting for the host to break the tie between these top picks."}
              </Text>
            </View>
          </Animated.View>

          <View style={{ gap: spacing[4], marginBottom: spacing[10] }}>
            {tiedActivities.map((activity, index) => (
              <Animated.View 
                key={activity.id} 
                entering={FadeInUp.delay(200 + index * 100)}
              >
                <TouchableOpacity 
                  activeOpacity={isHost ? 0.7 : 1}
                  onPress={() => isHost && setSelectedWinner(activity)}
                  style={[
                    styles.winnerCard, 
                    { 
                      padding: spacing[4], 
                      borderColor: selectedWinner?.id === activity.id ? colors.indigoPunch : colors.peachSoft,
                      borderWidth: selectedWinner?.id === activity.id ? 2 : 1,
                    }
                  ]}
                >
                  <View style={globalStyles.rowBetween}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.winnerLabel, { textAlign: 'left', marginBottom: 4 }]}>
                        {activity.votes} Votes
                      </Text>
                      <Text style={[styles.activityName, { fontSize: 20, textAlign: 'left', marginBottom: 0 }]}>
                        {activity.title}
                      </Text>
                    </View>
                    {isHost && (
                      <View style={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: 12, 
                        borderWidth: 2, 
                        borderColor: selectedWinner?.id === activity.id ? colors.indigoPunch : colors.borderDefault,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {selectedWinner?.id === activity.id && (
                          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.indigoPunch }} />
                        )}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {isHost && (
            <Animated.View entering={FadeIn.delay(600)}>
              <Button 
                title={selectedWinner ? `Confirm "${selectedWinner.title}"` : "Pick a Winner"}
                disabled={!selectedWinner}
                onPress={handleBreakTie}
                variant="primary"
              />
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  const finalWinner = confirmedWinner || tiedActivities[0];

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="We have a plan!" 
        showBack 
        backLabel="Room" 
      />

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(800)}>
          <View style={styles.celebrationHeader}>
            <View style={styles.successIcon}>
              <CheckCircle size={48} color={colors.mintPunch} weight="fill" />
            </View>
            <Text style={styles.title}>It's a date! 🍑</Text>
            <Text style={styles.subtitle}>The squad has spoken. Here is the winner:</Text>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(400).duration(600)}
          style={[styles.winnerCard, animatedCardStyle]}
        >
          <View style={styles.winnerHeader}>
            <Trophy size={18} color={colors.indigoPunch} weight="fill" />
            <Text style={styles.winnerLabel}>Official Invitation</Text>
          </View>
          
          <Text style={styles.activityName}>{finalWinner.title}</Text>
          
          <View style={styles.detailsList}>
            <View style={styles.detailItem}>
              <Calendar size={22} color={colors.peachPunch} weight="duotone" />
              <Text style={styles.detailText}>{finalWinner.time}</Text>
            </View>
            <View style={styles.detailItem}>
              <MapPin size={22} color={colors.peachPunch} weight="duotone" />
              <Text style={styles.detailText}>{finalWinner.location}</Text>
            </View>
            <View style={styles.detailItem}>
              <Users size={22} color={colors.peachPunch} weight="duotone" />
              <Text style={styles.detailText}>5 members attending</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(1000)} style={styles.actions}>
          <TouchableOpacity 
            style={styles.shareContainer}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Text style={styles.shareText}>Invite the squad</Text>
            <ShareNetwork size={24} color={colors.peachPunch} weight="duotone" />
          </TouchableOpacity>

          <Button 
            title="Add to my calendar" 
            variant="primary"
            onPress={() => {}}
            icon={<Calendar size={20} color={colors.white} />}
            style={styles.actionButton}
          />
        </Animated.View>

        <TouchableOpacity 
          style={styles.backToRoom}
          onPress={() => router.push(`/(tabs)`)}
        >
          <Text style={styles.backToRoomText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

