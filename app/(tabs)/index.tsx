import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, fonts, spacing, radius } from "@/constants/theme";
import { Card } from "@/components/Card";
import { StatusPill, StatusVariant } from "@/components/StatusPill";
import { AvatarStack } from "@/components/AvatarStack";
import { Header } from "@/components/Header";
import { DashboardHero } from "@/components/DashboardHero";
import { Button } from "@/components/Button";
import { HomeSkeleton } from "@/components/HomeSkeleton";
import { Hash, WarningCircle } from "phosphor-react-native";
import Animated, { 
  FadeInUp, 
  FadeInDown,
  FadeOut,
  Easing,
} from "react-native-reanimated";
import { styles } from "./_index.styles";
import { useTimeVoting } from "@/hooks/useTimeVoting";
import { RoomStatus } from "@/types";

// Optional Haptics
let Haptics: any;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  Haptics = null;
}

interface Room {
  id: string;
  name: string;
  sessionStatus: RoomStatus;
  members: { name: string; initial: string }[];
  detail: string;
  detailColor: string;
}

const mockRooms: Room[] = [
  {
    id: "1",
    name: "Friday Gang",
    sessionStatus: "voting_slots",
    members: [
      { name: "Raphael", initial: "R" },
      { name: "Jamie", initial: "J" },
      { name: "Marco", initial: "M" },
      { name: "Trisha", initial: "T" },
      { name: "Ana", initial: "A" },
    ],
    detail: "5 slots found",
    detailColor: "#993C1D",
  },
  {
    id: "2",
    name: "Study Squad",
    sessionStatus: "collecting",
    members: [
      { name: "Jamie", initial: "J" },
      { name: "Marco", initial: "M" },
      { name: "Raphael", initial: "R" },
    ],
    detail: "2 of 3 uploaded",
    detailColor: "#888780",
  },
];

interface ConfirmedPlan {
  id: string;
  title: string;
  roomName: string;
  date: string;
  time: string;
  members: { initial: string }[];
}

const mockConfirmedPlans: ConfirmedPlan[] = [
  {
    id: "p1",
    title: "Movie Night",
    roomName: "Weekend Plans",
    date: "May 10",
    time: "8:00 PM",
    members: [{ initial: "R" }, { initial: "A" }, { initial: "J" }],
  },
];

const ConfirmedTicket = React.memo(({ plan, index }: { plan: ConfirmedPlan, index: number }) => {
  return (
    <Animated.View 
      entering={FadeInDown.duration(600).delay(300 + index * 100)}
      style={styles.ticketWrapper}
    >
      <Card variant="mint" style={styles.ticketCard}>
        <View style={styles.ticketLeft}>
          <Text style={styles.ticketTitle} numberOfLines={1}>{plan.title}</Text>
          <Text style={styles.ticketRoom}>{plan.roomName}</Text>
          <View style={styles.ticketTimeRow}>
            <Text style={styles.ticketDate}>{plan.date} · {plan.time}</Text>
          </View>
        </View>
        <AvatarStack avatars={plan.members.map(m => ({ name: m.initial }))} size={20} />
      </Card>
    </Animated.View>
  );
});

const RoomListItem = React.memo(({ room, index, onPress }: { room: Room; index: number; onPress: (id: string) => void }) => {
  const { hasStaleVotes } = useTimeVoting(room.id);

  const getStatusDisplay = (status: RoomStatus): { label: string; variant: StatusVariant } => {
    switch (status) {
      case 'collecting': return { label: 'Waiting', variant: 'neutral' };
      case 'processing': return { label: 'Syncing...', variant: 'indigo' };
      case 'voting_slots': return { label: 'Voting open', variant: 'peach' };
      case 'voting_activity': return { label: 'Pick activity', variant: 'peach' };
      case 'confirmed': return { label: 'Confirmed', variant: 'mint' };
      case 'expired': return { label: 'Expired', variant: 'neutral' };
      default: return { label: 'Unknown', variant: 'neutral' };
    }
  };

  const status = getStatusDisplay(room.sessionStatus);

  return (
    <Animated.View 
      entering={FadeInDown.duration(600).delay(200 + index * 50).easing(Easing.out(Easing.exp))}
    >
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => onPress(room.id)}
        accessibilityRole="button"
        accessibilityLabel={`Enter ${room.name} room. Status: ${status.label}. ${room.detail}${hasStaleVotes ? '. Warning: stale votes detected.' : ''}`}
      >
        <Card variant="peach" style={[styles.roomCard, hasStaleVotes && { borderColor: colors.peachPunch, borderWidth: 1.5 } as any]}>
          <View style={styles.cardTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.roomName}>{room.name}</Text>
              {hasStaleVotes && (
                <View style={{ backgroundColor: colors.peachPunch, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.sm, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <WarningCircle size={12} color={colors.white} weight="fill" />
                  <Text style={{ color: colors.white, fontSize: 10, fontFamily: fonts.bodySemibold }}>UPDATE NEEDED</Text>
                </View>
              )}
            </View>
            <StatusPill label={status.label} variant={status.variant} />
          </View>
          
          <View style={styles.cardBottom}>
            <AvatarStack 
              avatars={room.members.map(m => ({ name: m.initial }))} 
              size={22}
              overlap={6}
            />
            <Text style={[styles.detailText, { color: room.detailColor }]}>
              {room.detail}
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [joinCode, setJoinCode] = React.useState("");
  const [joining, setJoining] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRoomPress = React.useCallback((id: string) => {
    router.push(`/room/${id}`);
  }, [router]);

  const handleJoinRoom = () => {
    if (joinCode.length < 4) return;
    
    setJoining(true);
    if (Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Simulate join logic
    setTimeout(() => {
      setJoining(false);
      setJoinCode("");
      router.push(`/room/1`); // For demo, join the Friday Gang
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="SweetSync" 
        subtitle="Socially Synced"
        subtitlePosition="above"
        userAvatar 
      />

      {loading ? (
        <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
          <HomeSkeleton />
        </Animated.View>
      ) : (
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(600).easing(Easing.out(Easing.exp))}>
            <DashboardHero 
              userName="Raphael" 
              roomCount={mockRooms.length}
              pendingVotes={2} 
              onCreateRoom={() => {}}
            />
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.duration(600).delay(100)}
            style={styles.joinBarContainer}
          >
            <View style={styles.joinBar}>
              <Hash size={20} color={colors.indigoPunch} weight="bold" />
              <TextInput 
                style={styles.joinInput}
                placeholder="Enter Room Code"
                placeholderTextColor={colors.textTertiary}
                value={joinCode}
                onChangeText={setJoinCode}
                maxLength={10}
                autoCapitalize="characters"
                returnKeyType="join"
                onSubmitEditing={handleJoinRoom}
              />
              <Button 
                title="Join"
                variant="indigo"
                style={styles.joinButton}
                disabled={joinCode.length < 4 || joining}
                loading={joining}
                onPress={handleJoinRoom}
              />
            </View>
          </Animated.View>

          {mockConfirmedPlans.length > 0 && (
            <>
              <Animated.View 
                entering={FadeInDown.duration(600).delay(200)} 
                style={styles.sectionHeader}
              >
                <Text style={styles.sectionTitle}>Upcoming Plans</Text>
              </Animated.View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {mockConfirmedPlans.map((plan, index) => (
                  <ConfirmedTicket key={plan.id} plan={plan} index={index} />
                ))}
              </ScrollView>
            </>
          )}

          {mockRooms.length > 0 && (
            <Animated.View 
              entering={FadeInDown.duration(600).delay(100).easing(Easing.out(Easing.exp))} 
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>Active Squads</Text>
            </Animated.View>
          )}

          <View style={styles.cardGapContainer}>
            {mockRooms.map((room, index) => (
              <RoomListItem 
                key={room.id} 
                room={room} 
                index={index} 
                onPress={handleRoomPress} 
              />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
