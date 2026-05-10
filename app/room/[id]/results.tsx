import React from 'react';
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
  Sparkle 
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
  Easing
} from 'react-native-reanimated';
import { styles } from './_results.styles';

export default function ResultsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'SweetSync: Movie Night at Raphael\'s is happening this Friday at 6:00 PM! 🍑',
      });
    } catch (error) {
      console.log(error);
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
            <Text style={styles.title}>Decision Locked</Text>
            <Text style={styles.subtitle}>The squad has spoken. Here is the winner:</Text>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(400).duration(600)}
          style={[styles.winnerCard, animatedCardStyle]}
        >
          <View style={styles.winnerHeader}>
            <Sparkle size={20} color={colors.peachPunch} weight="fill" />
            <Text style={styles.winnerLabel}>THE WINNER</Text>
            <Sparkle size={20} color={colors.peachPunch} weight="fill" />
          </View>
          
          <Text style={styles.activityName}>Movie Night at Raphael's</Text>
          
          <View style={styles.detailsList}>
            <View style={styles.detailItem}>
              <Calendar size={22} color={colors.peachPunch} weight="duotone" />
              <Text style={styles.detailText}>Friday, May 15 • 6:00 PM</Text>
            </View>
            <View style={styles.detailItem}>
              <MapPin size={22} color={colors.peachPunch} weight="duotone" />
              <Text style={styles.detailText}>Raphael's Apartment</Text>
            </View>
            <View style={styles.detailItem}>
              <Users size={22} color={colors.peachPunch} weight="duotone" />
              <Text style={styles.detailText}>5 members attending</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(1000)} style={styles.actions}>
          <Button 
            title="Add to My Calendar" 
            variant="primary"
            onPress={() => {}}
            icon={<Calendar size={20} color={colors.white} />}
            style={styles.actionButton}
          />
          <Button 
            title="Share with Squad" 
            variant="secondary"
            onPress={handleShare}
            icon={<ShareNetwork size={20} color={colors.peachPunch} />}
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

