import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, fonts, spacing } from '@/constants/theme';
import { Header } from '@/components/Header';

export default function VotesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Votes" />
      <View style={styles.content}>
        <Text style={styles.placeholder}>Open voting sessions will appear here</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textTertiary,
  },
});
