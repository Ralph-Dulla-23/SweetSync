import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable,
  TextInput,
  Platform,
  FlatList
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
import { useRooms } from "@/hooks/useRoom";
import { RoomStatus, Room } from "@/types";

// Optional Haptics
let Haptics: any;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  Haptics = null;
}

interface LocalRoom {
  id: string;
  name: string;
  sessionStatus: RoomStatus;
  members: { name: string; initial: string }[];
  detail: string;
  detailColor: string;
}

const mockRooms: LocalRoom[] = [
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

const getRoomDetail = (room: Room) => {
  if (room.sessionStatus === 'collecting') {
    const uploadedCount = room.members.filter(m => m.status === 'uploaded').length;
    return `${uploadedCount} of ${room.members.length} uploaded`;
  }
  if (room.sessionStatus === 'voting_slots') {
    return "Voting in progress";
  }
  if (room.sessionStatus === 'confirmed') {
    return "Plan confirmed!";
  }
  return "";
};

interface RoomListItemProps {
  room: LocalRoom;
  index: number;
  onPress: (id: string) => void;
}

const RoomListItem = React.memo(({ room, index, onPress }: RoomListItemProps) => {
  const { hasStaleVotes } = useTimeVoting(room.id);

  const status = getStatusDisplay(room.sessionStatus);

  return (
    <Animated.View 
      entering={FadeInDown.duration(600).delay(200 + index * 50).easing(Easing.out(Easing.exp))}
    >
      <Pressable 
        onPress={() => onPress(room.id)}
        style={({ pressed }) => [pressed && { opacity: 0.8 }]}
        accessibilityRole="button"
        accessibilityLabel={`Enter ${room.name} room. Status: ${status.label}. ${room.detail}${hasStaleVotes ? '. Warning: stale votes detected.' : ''}`}
      >
        <Card variant="peach" style={[styles.roomCard, hasStaleVotes && styles.roomCardStale]}>
          <View style={styles.cardTop}>
            <View style={styles.roomNameRow}>
              <Text style={styles.roomName}>{room.name}</Text>
              {hasStaleVotes && (
                <View style={styles.updateBadge}>
                  <WarningCircle size={12} color={colors.white} weight="fill" />
                  <Text style={styles.updateBadgeText}>UPDATE NEEDED</Text>
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
      </Pressable>
    </Animated.View>
  );
});

export default function Home() {
  const router = useRouter();
  const { rooms, loading: roomsLoading } = useRooms();
  const [loading, setLoading] = React.useState(true);
  const [joinCode, setJoinCode] = React.useState("");
  const [joining, setJoining] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
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

  const renderTicket = React.useCallback(({ item, index }: { item: ConfirmedPlan, index: number }) => (
    <ConfirmedTicket plan={item} index={index} />
  ), []);

  const renderRoomItem = React.useCallback(({ item: room, index }: { item: Room, index: number }) => {
    const displayRoom: LocalRoom = {
      id: room.id,
      name: room.name,
      sessionStatus: room.sessionStatus,
      detail: getRoomDetail(room),
      detailColor: room.sessionStatus === 'collecting' ? colors.textTertiary : colors.peachPunch,
      members: room.members.map(m => ({ name: m.name, initial: m.name[0] }))
    };
    
    return (
      <View style={[styles.listItem, { marginBottom: index === rooms.length - 1 ? 0 : spacing[4] }]}>
        <RoomListItem 
          room={displayRoom} 
          index={index} 
          onPress={handleRoomPress} 
        />
      </View>
    );
  }, [rooms.length, handleRoomPress]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="SweetSync" 
        subtitle="Socially Synced"
        subtitlePosition="above"
        userAvatar 
      />

      {(loading || roomsLoading) ? (
        <Animated.View key="skeleton" exiting={FadeOut.duration(300)}>
          <HomeSkeleton />
        </Animated.View>
      ) : (
        <FlatList 
          style={styles.flex1}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          data={rooms}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              <Animated.View entering={FadeInDown.duration(600).easing(Easing.out(Easing.exp))}>
                <DashboardHero 
                  userName="You" 
                  roomCount={rooms.length}
                  pendingVotes={2} 
                  onCreateRoom={() => router.push('/(tabs)/create')}
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
                  <FlatList 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalScroll}
                    data={mockConfirmedPlans}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTicket}
                  />
                </>
              )}

              {rooms.length > 0 && (
                <Animated.View 
                  entering={FadeInDown.duration(600).delay(100).easing(Easing.out(Easing.exp))} 
                  style={styles.sectionHeader}
                >
                  <Text style={styles.sectionTitle}>Active Squads</Text>
                </Animated.View>
              )}
            </>
          }
          renderItem={renderRoomItem}
        />
      )}
    </SafeAreaView>
  );
}
