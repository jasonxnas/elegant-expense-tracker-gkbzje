
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, spacing, buttonStyles } from '../../styles/commonStyles';
import { useTransactions } from '../../hooks/useTransactions';
import TransactionItem from '../../components/TransactionItem';
import SimpleBottomSheet from '../../components/BottomSheet';
import AddTransactionSheet from '../../components/AddTransactionSheet';
import Icon from '../../components/Icon';

export default function TransactionsScreen() {
  const [isAddTransactionVisible, setIsAddTransactionVisible] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const { transactions, deleteTransaction } = useTransactions();

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const handleDeleteTransaction = (id: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(id),
        },
      ]
    );
  };

  const getFilterButtonStyle = (filterType: typeof filter) => [
    styles.filterButton,
    filter === filterType && styles.filterButtonActive,
  ];

  const getFilterTextStyle = (filterType: typeof filter) => [
    styles.filterButtonText,
    filter === filterType && styles.filterButtonTextActive,
  ];

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={getFilterButtonStyle('all')}
            onPress={() => setFilter('all')}
          >
            <Text style={getFilterTextStyle('all')}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={getFilterButtonStyle('income')}
            onPress={() => setFilter('income')}
          >
            <Text style={getFilterTextStyle('income')}>Income</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={getFilterButtonStyle('expense')}
            onPress={() => setFilter('expense')}
          >
            <Text style={getFilterTextStyle('expense')}>Expenses</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <ScrollView
          style={styles.transactionsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.transactionsContent}
        >
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onDelete={() => handleDeleteTransaction(transaction.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="receipt-outline" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>No transactions found</Text>
              <Text style={styles.emptyStateText}>
                {filter === 'all'
                  ? 'Add your first transaction to get started'
                  : `No ${filter} transactions found`}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={buttonStyles.fab}
          onPress={() => setIsAddTransactionVisible(true)}
          activeOpacity={0.8}
        >
          <Icon name="add" size={24} color={colors.backgroundAlt} />
        </TouchableOpacity>

        {/* Add Transaction Bottom Sheet */}
        <SimpleBottomSheet
          isVisible={isAddTransactionVisible}
          onClose={() => setIsAddTransactionVisible(false)}
        >
          <AddTransactionSheet onClose={() => setIsAddTransactionVisible(false)} />
        </SimpleBottomSheet>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
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
  transactionsList: {
    flex: 1,
  },
  transactionsContent: {
    padding: spacing.lg,
    paddingBottom: 100, // Space for FAB
  },
  emptyState: {
    flex: 1,
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
    maxWidth: 250,
  },
});
