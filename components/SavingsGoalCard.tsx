
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SavingsGoal } from '../types';
import { colors, commonStyles, spacing, borderRadius } from '../styles/commonStyles';
import { useSavings } from '../hooks/useSavings';
import Icon from './Icon';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onPress?: () => void;
}

export default function SavingsGoalCard({ goal, onPress }: SavingsGoalCardProps) {
  const { getSavingsProgress } = useSavings();
  const progress = getSavingsProgress(goal);

  const getPriorityColor = () => {
    switch (goal.priority) {
      case 'high': return colors.danger;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{goal.name}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
            <Text style={styles.priorityText}>{goal.priority}</Text>
          </View>
        </View>
        {progress.isCompleted && (
          <Icon name="checkmark-circle" size={24} color={colors.success} />
        )}
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.currentAmount}>${goal.currentAmount.toFixed(2)}</Text>
        <Text style={styles.targetAmount}>of ${goal.targetAmount.toFixed(2)}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress.progress}%`,
                backgroundColor: progress.isCompleted ? colors.success : colors.primary,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{progress.progress.toFixed(0)}%</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.daysRemaining}>
          {progress.daysRemaining > 0 ? `${progress.daysRemaining} days left` : 'Overdue'}
        </Text>
        <Text style={styles.targetDate}>{formatDate(goal.targetDate)}</Text>
      </View>

      {!progress.isCompleted && progress.remaining > 0 && (
        <Text style={styles.monthlySavings}>
          Save ${progress.requiredMonthlySavings.toFixed(2)}/month to reach goal
        </Text>
      )}
    </TouchableOpacity>
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
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: {
    ...commonStyles.text,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  priorityText: {
    color: colors.backgroundAlt,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  currentAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginRight: spacing.sm,
  },
  targetAmount: {
    ...commonStyles.textSecondary,
    fontSize: 16,
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
    marginBottom: spacing.sm,
  },
  daysRemaining: {
    ...commonStyles.textSecondary,
    fontSize: 12,
  },
  targetDate: {
    ...commonStyles.textSecondary,
    fontSize: 12,
  },
  monthlySavings: {
    ...commonStyles.textSecondary,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
