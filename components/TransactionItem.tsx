
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Transaction } from '../types';
import { colors, commonStyles, spacing, borderRadius } from '../styles/commonStyles';
import Icon from './Icon';
import { expenseCategories, incomeCategories } from '../data/categories';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
  onDelete?: () => void;
}

export default function TransactionItem({ transaction, onPress, onDelete }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  const categories = isIncome ? incomeCategories : expenseCategories;
  const category = categories.find(cat => cat.name === transaction.category);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return `${isIncome ? '+' : '-'}$${amount.toFixed(2)}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Icon
          name={category?.icon as any || 'wallet'}
          size={24}
          color={category?.color || colors.textSecondary}
        />
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text style={[styles.amount, { color: isIncome ? colors.success : colors.danger }]}>
            {formatAmount(transaction.amount)}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.category}>{transaction.category}</Text>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        </View>
      </View>

      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Icon name="trash" size={20} color={colors.danger} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    ...commonStyles.text,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    ...commonStyles.textSecondary,
    fontSize: 12,
  },
  date: {
    ...commonStyles.textSecondary,
    fontSize: 12,
  },
  deleteButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
});
