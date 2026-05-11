import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, fonts, spacing, radius } from "@/constants/theme";
import { Card } from "@/components/Card";
import { StatusPill, StatusVariant } from "@/components/StatusPill";
import { AvatarStack } from "@/components/AvatarStack";
import { Header } from "@/components/Header";
import { DashboardHero } from "@/components/DashboardHero";
import { HomeSkeleton } from "@/components/HomeSkeleton";
import Animated, { 
  FadeInUp, 
  FadeInDown,
} from "react-native-reanimated";
import { styles } from "./_index.styles";

interface Room {
  id: string;
  name: string;
  status: string;
  statusVariant: StatusVariant;
  members: { name: string; initial: string }[];
  detail: string;
  detailColor: string;
}

const mockRooms: Room[] = [
  {
    id: "1",
    name: "Friday Gang",
    status: "Voting open",
    statusVariant: "peach",
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
    status: "Waiting",
    statusVariant: "neutral",
    members: [
      { name: "Jamie", initial: "J" },
      { name: "Marco", initial: "M" },
      { name: "Raphael", initial: "R" },
    ],
    detail: "2 of 3 uploaded",
    detailColor: "#888780",
  },
  {
    id: "3",
    name: "Weekend Plans",
    status: "Confirmed",
    statusVariant: "mint",
    members: [
      { name: "Raphael", initial: "R" },
      { name: "Ana", initial: "A" },
      { name: "Jamie", initial: "J" },
    ],
    detail: "Movie Night · May 10",
    detailColor: colors.mintPunch,
  },
];

const RoomListItem = React.memo(({ room, index, onPress }: { room: Room; index: number; onPress: (id: string) => void }) => {
  return (
    <Animated.View 
      entering={FadeInUp.duration(500).delay(400 + index * 100)}
    >
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => onPress(room.id)}
        accessibilityRole="button"
        accessibilityLabel={`Enter ${room.name} room. Status: ${room.status}. ${room.detail}`}
      >
        <Card variant="peach" style={styles.roomCard}>
          <View style={styles.cardTop}>
            <Text style={styles.roomName}>{room.name}</Text>
            <StatusPill label={room.status} variant={room.statusVariant} />
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

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRoomPress = React.useCallback((id: string) => {
    router.push(`/room/${id}`);
  }, [router]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="SweetSync" 
        subtitle="Socially Synced"
        subtitlePosition="above"
        userAvatar 
      />

      {loading ? (
        <HomeSkeleton />
      ) : (
        <ScrollView 
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(600).delay(100)}>
            <DashboardHero 
              userName="Raphael" 
              roomCount={mockRooms.length}
              pendingVotes={2} 
              onCreateRoom={() => {}}
            />
          </Animated.View>

          {mockRooms.length > 0 && (
            <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Rooms</Text>
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
