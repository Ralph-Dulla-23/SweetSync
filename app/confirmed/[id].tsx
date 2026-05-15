import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Share
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { AvatarStack } from '@/components/AvatarStack';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DotsThreeVertical,
  CheckCircle,
  QrCode,
  Sparkle
} from 'phosphor-react-native';
import Animated, { 
  FadeInDown, 
  FadeIn, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  withDelay,
  Easing,
  withSpring
} from 'react-native-reanimated';
import { useRoom } from '@/hooks/useRoom';
import { styles } from './_[id].styles';

// Optional Haptics
let Haptics: any;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  Haptics = null;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CelebrationSparkle = ({ delay = 0, style }: { delay?: number, style?: any }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.out(Easing.back(2)) }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      false
    ));
    opacity.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      false
    ));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style, { position: 'absolute' }]}>
      <Sparkle size={24} color={colors.peachPunch} weight="fill" />
    </Animated.View>
  );
};

export default function ConfirmedEventScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { room } = useRoom('1'); // Mock room for demo, in real app use ID

  const rotation = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    if (Haptics) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    rotation.value = withRepeat(
      withSequence(
        withTiming(-1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const ticketAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateZ: `${rotation.value}deg` }
    ],
  }));

  const mockEvent = {
    title: room?.upcomingEvents?.[0]?.title || "Friday Night Drinks",
    roomName: room?.name || "Friday Gang",
    date: "Friday, May 15",
    time: "6:00 PM",
    location: "The Peach Pit, 123 Sweet St",
    attendees: room?.members || [
      { name: "R" }, { name: "J" }, { name: "M" }, { name: "T" }, { name: "A" }
    ],
    isHost: true
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `It's on! 🍑\n\n${mockEvent.title}\n📅 ${mockEvent.date} at ${mockEvent.time}\n📍 ${mockEvent.location}\n\nSynced via SweetSync`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Event Details" 
        showBack 
        rightElement={
          <TouchableOpacity onPress={() => {}}>
            <DotsThreeVertical size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      <View style={{ position: 'absolute', top: 100, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
        <CelebrationSparkle style={{ top: '10%', left: '15%' }} delay={0} />
        <CelebrationSparkle style={{ top: '5%', right: '20%' }} delay={400} />
        <CelebrationSparkle style={{ top: '40%', left: '10%' }} delay={800} />
        <CelebrationSparkle style={{ top: '35%', right: '15%' }} delay={1200} />
        <CelebrationSparkle style={{ bottom: '20%', left: '20%' }} delay={1600} />
        <CelebrationSparkle style={{ bottom: '25%', right: '25%' }} delay={2000} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInDown.duration(800).springify().damping(12)}
          style={ticketAnimatedStyle}
        >
          <View style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
              <View style={styles.roomBadge}>
                <Text style={styles.roomBadgeText}>{mockEvent.roomName}</Text>
              </View>
              <View style={styles.statusBadge}>
                <CheckCircle size={14} color={colors.mintPunch} weight="fill" />
                <Text style={styles.statusText}>CONFIRMED</Text>
              </View>
            </View>

            <Text style={styles.eventTitle}>{mockEvent.title}</Text>

            <View style={styles.details}>
              <View style={styles.detailRow}>
                <View style={styles.iconBox}>
                  <Calendar size={20} color={colors.peachPunch} weight="duotone" />
                </View>
                <View>
                  <Text style={styles.detailValue}>{mockEvent.date}</Text>
                  <Text style={styles.detailLabel}>{mockEvent.time}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.iconBox}>
                  <MapPin size={20} color={colors.peachPunch} weight="duotone" />
                </View>
                <View>
                  <Text style={styles.detailValue}>{mockEvent.location}</Text>
                  <Text style={styles.detailLabel}>Tap for directions</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.iconBox}>
                  <Users size={20} color={colors.peachPunch} weight="duotone" />
                </View>
                <View>
                  <Text style={styles.detailValue}>{mockEvent.attendees.length} attending</Text>
                  <View style={styles.avatarRow}>
                    <AvatarStack avatars={mockEvent.attendees.map(m => ({ name: m.name }))} size={24} overlap={8} />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.ticketDivider}>
              <View style={styles.dot} />
              <View style={styles.dashLine} />
              <View style={styles.dot} />
            </View>

            <View style={styles.qrSection}>
              <TouchableOpacity activeOpacity={0.9}>
                <QrCode size={140} color={colors.textPrimary} weight="thin" />
              </TouchableOpacity>
              <Text style={styles.qrNote}>Event ID: {id}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(800)} style={styles.actions}>
          <Button 
            title="Add to Calendar" 
            variant="primary"
            onPress={() => {
              if (Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            style={styles.actionButton}
          />
          <Button 
            title="Share with Group" 
            variant="secondary"
            onPress={handleShare}
            style={styles.actionButton}
          />
          <TouchableOpacity style={styles.cancelLink}>
            <Text style={styles.cancelLinkText}>Cancel Event</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}



