
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, spacing, borderRadius } from '../../styles/commonStyles';
import { financialTips } from '../../data/categories';
import Icon from '../../components/Icon';
import SimpleBottomSheet from '../../components/BottomSheet';

export default function LearnScreen() {
  const [selectedTip, setSelectedTip] = useState<typeof financialTips[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'budgeting' | 'saving' | 'investing' | 'debt' | 'general'>('all');

  const filteredTips = financialTips.filter(tip => {
    if (filter === 'all') return true;
    return tip.category === filter;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return colors.success;
      case 'intermediate': return colors.warning;
      case 'advanced': return colors.danger;
      default: return colors.textSecondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'budgeting': return 'pie-chart';
      case 'saving': return 'wallet';
      case 'investing': return 'trending-up';
      case 'debt': return 'card';
      case 'general': return 'bulb';
      default: return 'book';
    }
  };

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'budgeting', label: 'Budgeting' },
    { key: 'saving', label: 'Saving' },
    { key: 'investing', label: 'Investing' },
    { key: 'debt', label: 'Debt' },
    { key: 'general', label: 'General' },
  ] as const;

  const TipDetailSheet = () => {
    if (!selectedTip) return null;

    return (
      <ScrollView style={styles.tipDetailContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.tipDetailHeader}>
          <Text style={styles.tipDetailTitle}>{selectedTip.title}</Text>
          <View style={styles.tipDetailMeta}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(selectedTip.difficulty) }]}>
              <Text style={styles.difficultyText}>{selectedTip.difficulty}</Text>
            </View>
            <Text style={styles.readTime}>{selectedTip.readTime} min read</Text>
          </View>
        </View>
        
        <Text style={styles.tipDetailContent}>{selectedTip.content}</Text>
        
        <View style={styles.tipDetailFooter}>
          <Icon
            name={getCategoryIcon(selectedTip.category) as any}
            size={20}
            color={colors.primary}
          />
          <Text style={styles.categoryLabel}>
            {selectedTip.category.charAt(0).toUpperCase() + selectedTip.category.slice(1)}
          </Text>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Financial Education</Text>
          <Text style={commonStyles.textSecondary}>
            Learn to build better financial habits
          </Text>
        </View>

        {/* Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterButton,
                filter === option.key && styles.filterButtonActive,
              ]}
              onPress={() => setFilter(option.key)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === option.key && styles.filterButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tips List */}
        <ScrollView
          style={styles.tipsList}
          contentContainerStyle={styles.tipsContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredTips.map((tip) => (
            <TouchableOpacity
              key={tip.id}
              style={styles.tipCard}
              onPress={() => setSelectedTip(tip)}
              activeOpacity={0.7}
            >
              <View style={styles.tipHeader}>
                <View style={styles.tipIconContainer}>
                  <Icon
                    name={getCategoryIcon(tip.category) as any}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.tipInfo}>
                  <Text style={styles.tipTitle} numberOfLines={2}>
                    {tip.title}
                  </Text>
                  <View style={styles.tipMeta}>
                    <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(tip.difficulty) }]}>
                      <Text style={styles.difficultyText}>{tip.difficulty}</Text>
                    </View>
                    <Text style={styles.readTime}>{tip.readTime} min</Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.tipPreview} numberOfLines={3}>
                {tip.content}
              </Text>
            </TouchableOpacity>
          ))}

          {filteredTips.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="book-outline" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>No tips found</Text>
              <Text style={styles.emptyStateText}>
                Try selecting a different category
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Tip Detail Bottom Sheet */}
        <SimpleBottomSheet
          isVisible={selectedTip !== null}
          onClose={() => setSelectedTip(null)}
        >
          <TipDetailSheet />
        </SimpleBottomSheet>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  filterContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterButtonTextActive: {
    color: colors.backgroundAlt,
  },
  tipsList: {
    flex: 1,
  },
  tipsContent: {
    padding: spacing.lg,
  },
  tipCard: {
    ...commonStyles.card,
    marginBottom: spacing.md,
  },
  tipHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  tipInfo: {
    flex: 1,
  },
  tipTitle: {
    ...commonStyles.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  tipMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  difficultyText: {
    color: colors.backgroundAlt,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  readTime: {
    ...commonStyles.textSecondary,
    fontSize: 12,
  },
  tipPreview: {
    ...commonStyles.textSecondary,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    ...commonStyles.textSecondary,
    textAlign: 'center',
  },
  tipDetailContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  tipDetailHeader: {
    marginBottom: spacing.xl,
  },
  tipDetailTitle: {
    ...commonStyles.title,
    marginBottom: spacing.md,
  },
  tipDetailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  tipDetailContent: {
    ...commonStyles.text,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  tipDetailFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  categoryLabel: {
    ...commonStyles.text,
    fontWeight: '600',
    color: colors.primary,
  },
});
