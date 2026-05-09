import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Avatar } from '@/components/Avatar';
import { CaretRight } from 'phosphor-react-native';
import { Header } from '@/components/Header';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.userCard}>
          <Avatar name="Raphael" size={52} color={colors.peachPunch} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Raphael</Text>
            <Text style={styles.userEmail}>raphael@email.com</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>MY SCHEDULE</Text>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowText}>Uploaded schedules</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>3 files</Text>
              <CaretRight size={16} color={colors.textTertiary} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowText}>Edit my schedule</Text>
            <CaretRight size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowText}>New invites</Text>
            <View style={[styles.toggle, styles.toggleOn]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowText}>Schedule reminders</Text>
            <View style={[styles.toggle, styles.toggleOn]} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <TouchableOpacity style={styles.row}>
            <Text style={[styles.rowText, { color: colors.peachPunch }]}>Sign out</Text>
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
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
    gap: spacing[6],
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F4F1',
    padding: spacing[4],
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.07)',
    gap: spacing[3],
  },
  userInfo: {
    gap: 2,
  },
  userName: {
    fontFamily: fonts.bodySemibold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  userEmail: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  section: {
    gap: spacing[1],
  },
  sectionLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: spacing[1],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  rowText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  rowValue: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  toggle: {
    width: 36,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.textTertiary,
  },
  toggleOn: {
    backgroundColor: colors.peachPunch,
  },
});
