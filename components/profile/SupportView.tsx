import React from 'react';
import { View, Text, Alert } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { Button } from '@/components/Button';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { styles } from '@/app/(tabs)/_profile.styles';

export const SupportView = () => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.sectionContainer}>
      <View style={styles.contentHeader}>
        <Text style={styles.contentTitle}>Help & FAQ</Text>
        <Text style={styles.contentSubtitle}>Everything you need to know about syncing with your squad.</Text>
      </View>

      <View style={{ gap: spacing[4] }}>
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>How does AI extraction work?</Text>
          <Text style={styles.faqAnswer}>
            Our Availability Engine uses Google Gemini to read your screenshots or PDFs. It identifies time blocks and automatically marks you as "busy" in your rooms.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Is my schedule private?</Text>
          <Text style={styles.faqAnswer}>
            By default, others only see an aggregated "Heat Map". They won't see your specific classes or work shifts unless you enable "Detailed" visibility in Privacy settings.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Can I sync my school portal?</Text>
          <Text style={styles.faqAnswer}>
            We currently support manual uploads of screenshots and PDFs. Direct calendar and portal syncing is coming in a future update!
          </Text>
        </View>
      </View>

      <Button 
        title="Contact Support" 
        variant="ghost"
        onPress={() => Alert.alert("Coming Soon", "Support chat is currently in development.")}
        style={{ marginTop: spacing[4] }}
      />
    </Animated.View>
  );
};