import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Image
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
  CaretLeft, 
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
  Easing
} from 'react-native-reanimated';
import { styles } from './_[id].styles';

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
        withTiming(1, { duration: 1000 }),
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
      <Sparkle size={24} color={colors.peachSoft} weight="fill" />
    </Animated.View>
  );
};

export default function ConfirmedEventScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const mockEvent = {
    title: "Friday Night Drinks",
    roomName: "Friday Gang",
    date: "Friday, May 15",
    time: "6:00 PM",
    location: "The Peach Pit, 123 Sweet St",
    attendees: [
      { name: "R" }, { name: "J" }, { name: "M" }, { name: "T" }, { name: "A" }
    ],
    isHost: true
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Event Details" 
        showBack 
        rightElement={
          <TouchableOpacity>
            <DotsThreeVertical size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      <View style={{ position: 'absolute', top: 100, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
        <CelebrationSparkle style={{ top: '10%', left: '10%' }} delay={0} />
        <CelebrationSparkle style={{ top: '5%', right: '15%' }} delay={400} />
        <CelebrationSparkle style={{ top: '40%', left: '5%' }} delay={800} />
        <CelebrationSparkle style={{ top: '35%', right: '10%' }} delay={1200} />
        <CelebrationSparkle style={{ bottom: '20%', left: '15%' }} delay={1600} />
        <CelebrationSparkle style={{ bottom: '25%', right: '20%' }} delay={2000} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(600).springify().damping(15)}>
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
                    <AvatarStack avatars={mockEvent.attendees} size={24} overlap={8} />
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
              <QrCode size={120} color={colors.textPrimary} weight="thin" />
              <Text style={styles.qrNote}>Event ID: {id}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(800)} style={styles.actions}>
          <Button 
            title="Add to Calendar" 
            variant="primary"
            onPress={() => {}}
            style={styles.actionButton}
          />
          <Button 
            title="Share with Group" 
            variant="secondary"
            onPress={() => {}}
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


