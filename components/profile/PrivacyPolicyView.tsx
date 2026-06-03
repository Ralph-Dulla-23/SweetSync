import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { styles } from '@/app/(tabs)/_profile.styles';

export const PrivacyPolicyView = () => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.sectionContainer}>
      <View style={styles.contentHeader}>
        <Text style={styles.contentTitle}>Privacy Policy</Text>
        <Text style={styles.contentSubtitle}>Last updated: May 23, 2026</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
        <View style={styles.articleSection}>
          <Text style={styles.articleTitle}>1. Data Collection</Text>
          <Text style={styles.articleBody}>
            We collect your schedule data solely for the purpose of coordination. When you upload a file, the AI extracts time blocks and stores them as metadata linked to your profile.
          </Text>
        </View>

        <View style={styles.articleSection}>
          <Text style={styles.articleTitle}>2. How we use AI</Text>
          <Text style={styles.articleBody}>
            We use Google Gemini to process unstructured schedule data. Your files are processed securely and are not used to train global AI models.
          </Text>
        </View>

        <View style={styles.articleSection}>
          <Text style={styles.articleTitle}>3. Your Controls</Text>
          <Text style={styles.articleBody}>
            You have full control over who sees your data. You can delete your schedules or your entire account at any time from the Settings tab.
          </Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
};