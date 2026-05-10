import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, Bell, UsersThree } from "phosphor-react-native";
import { colors, fonts, spacing, radius } from "@/constants/theme";
import { Header } from "@/components/Header";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/Card";
import Animated, { 
  FadeInUp, 
  FadeInDown,
} from "react-native-reanimated";
import { RoomInteriorSkeleton } from "@/components/RoomInteriorSkeleton";
import { useRoom } from "@/hooks/useRoom";
import { styles } from "./[id].styles";

export default function RoomInterior() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { room, loading, nudgeMember } = useRoom(id as string);

  if (loading || !room) {
    return <RoomInteriorSkeleton />;
  }


  const uploadedCount = room.members.filter(m => m.status === "uploaded").length;
  const totalCount = room.members.length;
  const progress = (uploadedCount / totalCount) * 100;
  const isReady = uploadedCount === totalCount;

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={room.name} 
        subtitle={room.description || "Coordinate with the squad"}
        showBack 
        backLabel="Rooms" 
      />

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Section - Deeply Branded */}
        <Card 
          variant={isReady ? 'mint' : 'peach'} 
          style={styles.progressSection}
        >
          <View style={styles.progressHeader}>
            <View style={styles.progressValueContainer}>
              <Text style={[styles.progressMainValue, { color: isReady ? colors.mintPunch : colors.peachPunch }]}>
                {uploadedCount}
              </Text>
              <Text style={styles.progressTotalValue}>/{totalCount}</Text>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>Syncing Souls</Text>
              <Text style={styles.progressSubtitle}>
                {isReady ? "The squad is fully synced" : `${totalCount - uploadedCount} people to go`}
              </Text>
            </View>
          </View>
          <ProgressBar 
            progress={progress} 
            color={isReady ? colors.mintPunch : colors.peachPunch} 
            height={10} 
          />
        </Card>

        {/* Member List - Social and Responsive */}
        <View style={styles.sectionHeader}>
          <UsersThree size={16} color={colors.textTertiary} weight="bold" />
          <Text style={styles.sectionTitle}>The Squad</Text>
        </View>

        <View style={styles.memberList}>
          {room.members.map((member, index) => (
            <Animated.View 
              key={member.id}
              entering={FadeInUp.duration(600).delay(200 + index * 50).springify().damping(18)}
            >
              <View 
                style={[
                  styles.memberRow, 
                  index === room.members.length - 1 && styles.noBorder
                ]}
              >
                <View style={styles.memberLeft}>
                  <Avatar 
                    name={member.name} 
                    uri={member.avatarUri}
                    size={44} 
                    color={member.status === "uploaded" ? colors.peachPunch : colors.textTertiary} 
                  />
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View style={styles.statusRow}>
                      {member.isHost && <Text style={styles.hostTag}>Host</Text>}
                      <Text style={[
                        styles.memberStatus,
                        member.status === "pending" && styles.pendingText
                      ]}>
                        {member.status === "uploaded" ? "Synced" : "Waiting for upload"}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {member.status === "uploaded" ? (
                  <View style={styles.statusIndicator}>
                    <CheckCircle size={26} weight="fill" color={colors.mintPunch} />
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.nudgeButton}
                    activeOpacity={0.7}
                    onPress={() => nudgeMember(member.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Nudge ${member.name}`}
                  >
                    <Bell size={20} color={colors.peachPunch} weight="bold" />
                    <Text style={styles.nudgeLabel}>Nudge</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Action Area */}
        <Animated.View entering={FadeInUp.duration(600).delay(800)} style={styles.footer}>
          <Button 
            title="Reveal Gaps" 
            variant={isReady ? "indigo" : "ghost"}
            disabled={!isReady}
            onPress={() => router.push(`/room/${id}/calendar`)}
            style={styles.mainButton}
          />
          {!isReady && (
            <Text style={styles.footerNote}>
              Need all schedules to unlock AI slot finding
            </Text>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

