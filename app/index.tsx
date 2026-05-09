import React from 'react';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Sparkle, Scan, CalendarBlank, ListChecks } from 'phosphor-react-native';
import { Button } from '@/components/Button';

export default function Index() {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.peachPunch} />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  const features = [
    {
      icon: Scan,
      color: colors.peachPunch,
      title: 'Upload & Sync',
      desc: 'AI extracts busy blocks from your schedule screenshots.',
    },
    {
      icon: CalendarBlank,
      color: colors.indigoPunch,
      title: 'Find the Gaps',
      desc: 'See a collective heat map of when everyone is free.',
    },
    {
      icon: ListChecks,
      color: colors.mintPunch,
      title: 'Decide Together',
      desc: 'Vote on slots and activities to confirm plans in seconds.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Brand Moment */}
        <View style={styles.header}>
          <Sparkle size={48} weight="fill" color={colors.indigoPunch} />
          <Text style={styles.logoText}>SweetSync</Text>
          <Text style={styles.tagline}>Plan things together.</Text>
        </View>

        {/* Feature List - The "How it Works" */}
        <View style={styles.featureList}>
          {features.map((item, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={[styles.iconContainer, { backgroundColor: item.color + '10' }]}>
                <item.icon size={24} weight="duotone" color={item.color} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Actions - Direct Path to Auth */}
        <View style={styles.footer}>
          <Button
            title="Create Account"
            onPress={() => router.push({ pathname: '/(auth)/sign-in', params: { mode: 'signup' } })}
            style={styles.button}
          />
          
          <TouchableOpacity 
            onPress={() => router.push({ pathname: '/(auth)/sign-in', params: { mode: 'signin' } })}
            activeOpacity={0.7}
            style={styles.signInLink}
          >
            <Text style={styles.signInText}>
              Already have an account? <Text style={styles.signInTextBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: colors.peachBase,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoText: {
    marginTop: 16,
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.textPrimary,
  },
  tagline: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSecondary,
  },
  featureList: {
    gap: 32,
    marginBottom: 64,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontFamily: fonts.bodySemibold,
    fontSize: 17,
    color: colors.textPrimary,
  },
  featureDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    gap: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  button: {
    width: '100%',
    height: 54,
    backgroundColor: colors.peachPunch,
    borderRadius: 12,
  },
  signInLink: {
    paddingVertical: 8,
  },
  signInText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  signInTextBold: {
    fontFamily: fonts.bodySemibold,
    color: colors.indigoPunch,
  },
});
