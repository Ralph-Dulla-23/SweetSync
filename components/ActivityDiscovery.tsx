import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { ActivitySuggestion } from '@/types';
import { Sparkle, ChatCircleText, BookOpen, Pizza, Balloon } from 'phosphor-react-native';

interface ActivityDiscoveryProps {
  suggestions: ActivitySuggestion[];
}

const CategoryIcon = ({ category, size, color }: { category: ActivitySuggestion['category'], size: number, color: string }) => {
  switch (category) {
    case 'study': return <BookOpen size={size} color={color} weight="fill" />;
    case 'food': return <Pizza size={size} color={color} weight="fill" />;
    case 'active': return <Balloon size={size} color={color} weight="fill" />;
    default: return <ChatCircleText size={size} color={color} weight="fill" />;
  }
};

export const ActivityDiscovery: React.FC<ActivityDiscoveryProps> = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Sparkle size={18} color={colors.indigoPunch} weight="fill" />
        <Text style={styles.sectionTitle}>Magic Ideas</Text>
      </View>
      <Text style={styles.subtitle}>AI-picked based on your squad's free time</Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {suggestions.map((item) => (
          <View key={item.id} style={styles.suggestionCard}>
            <View style={[styles.iconContainer, { backgroundColor: getCategoryBg(item.category) }]}>
              <CategoryIcon category={item.category} size={20} color={getCategoryColor(item.category)} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
              <View style={styles.tagRow}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{Math.round(item.duration / 2)}h session</Text>
                </View>
                {item.votes !== undefined && (
                  <View style={[styles.tag, { backgroundColor: colors.peachBase }]}>
                    <Text style={[styles.tagText, { color: colors.peachPunch }]}>{item.votes} interested</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const getCategoryColor = (cat: ActivitySuggestion['category']) => {
  switch (cat) {
    case 'study': return colors.indigoPunch;
    case 'food': return colors.peachPunch;
    case 'social': return colors.mintPunch;
    default: return colors.indigoPunch;
  }
};

const getCategoryBg = (cat: ActivitySuggestion['category']) => {
  switch (cat) {
    case 'study': return colors.indigoBase;
    case 'food': return colors.peachBase;
    case 'social': return colors.mintBase;
    default: return colors.indigoBase;
  }
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[8],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.indigoPunch,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing[3],
    paddingHorizontal: 0,
    marginTop: -spacing[2],
  },
  scrollContent: {
    paddingRight: spacing[5],
    gap: spacing[3],
  },
  suggestionCard: {
    width: 210,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: spacing[4],
    flexDirection: 'row',
    gap: spacing[3],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  itemDesc: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 14,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  tag: {
    backgroundColor: colors.pageBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 9,
    color: colors.textSecondary,
  },
});
