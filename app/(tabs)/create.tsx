import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { colors, fonts, spacing, radius } from "@/constants/theme";
import { Plus, Users, CalendarPlus } from "phosphor-react-native";
import { useRouter } from "expo-router";
import { Header } from "@/components/Header";

export default function CreateScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Create" 
        subtitle="Start something fresh" 
        subtitlePosition="above" 
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Primary Action: New Session */}
        <TouchableOpacity 
          style={[styles.heroCard, styles.mintCard]}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="New Session: Find a time for a specific activity. This is the primary action."
        >
          <View style={[styles.heroIconContainer, { backgroundColor: colors.mintSoft }]}>
            <CalendarPlus size={36} color={colors.mintPunch} weight="bold" />
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.heroTitle}>New Session</Text>
            <Text style={styles.heroDescription}>Coordinate a specific event or hangout</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Groups & Spaces</Text>

        <View style={styles.secondaryActions}>
          <TouchableOpacity 
            style={[styles.optionCard, styles.indigoCard]}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="New Room: Create a persistent space for your squad"
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.indigoSoft }]}>
              <Plus size={24} color={colors.indigoPunch} weight="bold" />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>New Room</Text>
              <Text style={styles.optionDescription}>Persistent space for squads</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionCard, styles.peachCard]}
            onPress={() => router.push("/join")}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Join a Room: Enter a code to join an existing group"
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.peachSoft }]}>
              <Users size={24} color={colors.peachPunch} weight="bold" />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Join a Room</Text>
              <Text style={styles.optionDescription}>Enter a group code</Text>
            </View>
          </TouchableOpacity>
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
  content: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[2],
    paddingBottom: spacing[8],
  },
  heroCard: {
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[6],
    borderRadius: radius.lg,
    borderWidth: 0.5,
    marginBottom: spacing[8],
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[5],
    // Subtle elevation for the hero
    shadowColor: colors.mintPunch,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  heroIconContainer: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  heroInfo: {
    alignItems: "center",
    gap: spacing[1],
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.textPrimary,
  },
  heroDescription: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
  },
  sectionLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing[3],
    marginLeft: 2,
  },
  secondaryActions: {
    gap: spacing[3],
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[4],
    borderRadius: radius.lg,
    borderWidth: 0.5,
    gap: spacing[4],
  },
  peachCard: {
    backgroundColor: colors.peachBase,
    borderColor: colors.peachSoft,
  },
  indigoCard: {
    backgroundColor: colors.indigoBase,
    borderColor: colors.indigoSoft,
  },
  mintCard: {
    backgroundColor: colors.mintBase,
    borderColor: colors.mintSoft,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  optionInfo: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontFamily: fonts.bodySemibold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  optionDescription: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
