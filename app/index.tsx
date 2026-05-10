import React from 'react';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors } from '@/constants/theme';
import { Sparkle, Scan, CalendarBlank, ListChecks } from 'phosphor-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Button } from '@/components/Button';
import { styles } from './index.styles';

export default function Index() {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.loadingBrand}>
          <Sparkle size={64} weight="fill" color={colors.indigoPunch} />
          <Text style={styles.loadingText}>SweetSync</Text>
        </Animated.View>
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
