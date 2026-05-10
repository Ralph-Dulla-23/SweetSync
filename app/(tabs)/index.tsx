import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { useRouter } from "expo-router";
import { colors, fonts, spacing, radius } from "@/constants/theme";
import { Card } from "@/components/Card";
import { StatusPill, StatusVariant } from "@/components/StatusPill";
import { AvatarStack } from "@/components/AvatarStack";
import { Header } from "@/components/Header";
import { DashboardHero } from "@/components/DashboardHero";
import Animated, { 
  FadeInUp, 
  FadeInDown,
} from "react-native-reanimated";
import { styles } from "./index.styles";

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

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="SweetSync" 
        subtitle="Socially Synced"
        subtitlePosition="above"
        userAvatar 
      />

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
            <Animated.View 
              key={room.id}
              entering={FadeInUp.duration(500).delay(400 + index * 100)}
            >
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => router.push(`/room/${room.id}`)}
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
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

