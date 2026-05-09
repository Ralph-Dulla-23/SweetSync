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
import { DashboardHero } from "@/components/DashboardHero";
import { Header } from "@/components/Header";

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
      {/* Upgraded Brand Header */}
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
        <DashboardHero 
          userName="Raphael" 
          roomCount={mockRooms.length}
          pendingVotes={2} 
          onCreateRoom={() => {}}
        />
        
        {mockRooms.length > 0 && (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Rooms</Text>
          </View>
        )}

        <View style={styles.cardGapContainer}>
          {mockRooms.map((room) => (
            <TouchableOpacity 
              key={room.id}
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
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  list: {
    paddingTop: spacing[4], // Increased for better flow from header
    paddingBottom: spacing[10],
  },
  sectionHeader: {
    paddingHorizontal: spacing[5],
    marginTop: spacing[8], // Increased from spacing[6]
    marginBottom: spacing[4], // Increased from spacing[3]
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 22, // Slightly increased from 20px
    color: colors.textPrimary,
  },
  cardGapContainer: {
    paddingHorizontal: spacing[5],
    gap: spacing[4], // Increased from spacing[3] for better breathing
  },
  roomCard: {
    minHeight: 120, // Slightly increased from 110
    justifyContent: "space-between",
    padding: spacing[5], // Consistent with new room row padding
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomName: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.peachDeep,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing[4],
  },
  detailText: {
    fontFamily: fonts.bodySemibold, // Changed to semibold for better legibility
    fontSize: 12, // Slightly increased from 11px
  },
});
