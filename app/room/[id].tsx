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
import { useRoom } from "@/hooks/useRoom";

export default function RoomInterior() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { room, loading, nudgeMember } = useRoom(id as string);
  
  if (loading || !room) {
    return (
      <SafeAreaView style={styles.container}>
        <Header showBack backLabel="Rooms" title="Loading..." />
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.peachPunch} size="large" />
        </View>
      </SafeAreaView>
    );
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
        <View style={[styles.progressSection, isReady ? styles.mintCard : styles.peachCard]}>
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
        </View>

        {/* Member List - Social and Responsive */}
        <View style={styles.sectionHeader}>
          <UsersThree size={16} color={colors.textTertiary} weight="bold" />
          <Text style={styles.sectionTitle}>The Squad</Text>
        </View>

        <View style={styles.memberList}>
          {room.members.map((member, index) => (
            <View 
              key={member.id} 
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
          ))}
        </View>

        {/* Action Area */}
        <View style={styles.footer}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
    paddingBottom: spacing[10],
  },
  progressSection: {
    marginBottom: spacing[10],
    padding: spacing[6],
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  peachCard: {
    backgroundColor: colors.peachBase,
    borderColor: colors.peachSoft,
  },
  mintCard: {
    backgroundColor: colors.mintBase,
    borderColor: colors.mintSoft,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[5],
    marginBottom: spacing[6],
  },
  progressValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  progressMainValue: {
    fontFamily: fonts.display,
    fontSize: 42,
  },
  progressTotalValue: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.textTertiary,
    marginLeft: 1,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontFamily: fonts.bodySemibold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  progressSubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginBottom: spacing[4],
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  memberList: {
    marginBottom: spacing[10],
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
    overflow: "hidden",
  },
  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[5],
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderDefault,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  memberLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
  },
  memberInfo: {
    gap: 3,
  },
  memberName: {
    fontFamily: fonts.bodySemibold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  hostTag: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    color: colors.indigoPunch,
    backgroundColor: colors.indigoBase,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.sm,
    textTransform: "uppercase",
  },
  memberStatus: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  pendingText: {
    color: colors.peachPunch,
    fontFamily: fonts.bodySemibold,
  },
  statusIndicator: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  nudgeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
    paddingLeft: spacing[2],
    paddingRight: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    backgroundColor: colors.peachBase,
    borderWidth: 0.5,
    borderColor: colors.peachSoft,
  },
  nudgeLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.peachPunch,
  },
  footer: {
    marginTop: "auto",
    gap: spacing[3],
    alignItems: "center",
  },
  mainButton: {
    width: "100%",
    height: 60,
  },
  footerNote: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
