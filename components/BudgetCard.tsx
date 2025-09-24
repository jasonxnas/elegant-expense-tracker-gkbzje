
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Budget } from '../types';
import { colors, commonStyles, spacing, borderRadius } from '../styles/commonStyles';
import { useBudgets } from '../hooks/useBudgets';

interface BudgetCardProps {
  budget: Budget;
}

export default function BudgetCard({ budget }: BudgetCardProps) {
  const { getBudgetProgress } = useBudgets();
  const progress = getBudgetProgress(budget);

  const getProgressColor = () => {
    if (progress.isOverBudget) return colors.danger;
    if (progress.progress >= 80) return colors.warning;
    return colors.success;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.category}>{budget.category}</Text>
        <Text style={[styles.amount, { color: progress.isOverBudget ? colors.danger : colors.text }]}>
          ${progress.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progress.progress, 100)}%`,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{progress.progress.toFixed(0)}%</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.remaining}>
          {progress.isOverBudget
            ? `Over by $${(progress.spent - budget.amount).toFixed(2)}`
            : `$${progress.remaining.toFixed(2)} remaining`}
        </Text>
        <Text style={styles.period}>{budget.period}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.card,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  category: {
    ...commonStyles.text,
    fontWeight: '600',
    flex: 1,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  progressText: {
    ...commonStyles.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remaining: {
    ...commonStyles.textSecondary,
    fontSize: 12,
  },
  period: {
    ...commonStyles.textSecondary,
    fontSize: 12,
    textTransform: 'capitalize',
  },
});
