
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, spacing, buttonStyles } from '../../styles/commonStyles';
import { useTransactions } from '../../hooks/useTransactions';
import { useBudgets } from '../../hooks/useBudgets';
import { useSavings } from '../../hooks/useSavings';
import Chart from '../../components/Chart';
import TransactionItem from '../../components/TransactionItem';
import BudgetCard from '../../components/BudgetCard';
import SimpleBottomSheet from '../../components/BottomSheet';
import AddTransactionSheet from '../../components/AddTransactionSheet';
import Icon from '../../components/Icon';
import { expenseCategories } from '../../data/categories';

export default function OverviewScreen() {
  const [isAddTransactionVisible, setIsAddTransactionVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { 
    transactions, 
    getTotalIncome, 
    getTotalExpenses, 
    getBalance, 
    getCategoryTotals 
  } = useTransactions();
  
  const { getActiveBudgets, getBudgetAlerts } = useBudgets();
  const { getTotalSavings } = useSavings();

  // Get current month data
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const currentMonthRange = { start: startOfMonth, end: endOfMonth };

  const monthlyIncome = getTotalIncome(currentMonthRange);
  const monthlyExpenses = getTotalExpenses(currentMonthRange);
  const monthlyBalance = getBalance(currentMonthRange);
  const totalSavings = getTotalSavings();

  const recentTransactions = transactions.slice(0, 5);
  const activeBudgets = getActiveBudgets().slice(0, 3);
  const budgetAlerts = getBudgetAlerts();

  // Prepare chart data
  const categoryTotals = getCategoryTotals('expense', currentMonthRange);
  const chartData = Object.entries(categoryTotals).map(([category, amount]) => {
    const categoryInfo = expenseCategories.find(cat => cat.name === category);
    return {
      name: category,
      amount,
      color: categoryInfo?.color || colors.textSecondary,
      legendFontColor: colors.text,
      legendFontSize: 12,
    };
  }).slice(0, 6); // Show top 6 categories

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView
        style={commonStyles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={commonStyles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={commonStyles.title}>Financial Overview</Text>
            <Text style={commonStyles.textSecondary}>
              {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
          </View>

          {/* Balance Cards */}
          <View style={styles.balanceContainer}>
            <View style={[styles.balanceCard, { backgroundColor: colors.success }]}>
              <Text style={styles.balanceLabel}>Income</Text>
              <Text style={styles.balanceAmount}>+${monthlyIncome.toFixed(2)}</Text>
            </View>
            
            <View style={[styles.balanceCard, { backgroundColor: colors.danger }]}>
              <Text style={styles.balanceLabel}>Expenses</Text>
              <Text style={styles.balanceAmount}>-${monthlyExpenses.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.balanceContainer}>
            <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
              <Text style={styles.balanceLabel}>Balance</Text>
              <Text style={styles.balanceAmount}>${monthlyBalance.toFixed(2)}</Text>
            </View>
            
            <View style={[styles.balanceCard, { backgroundColor: colors.accent }]}>
              <Text style={styles.balanceLabel}>Savings</Text>
              <Text style={styles.balanceAmount}>${totalSavings.toFixed(2)}</Text>
            </View>
          </View>

          {/* Budget Alerts */}
          {budgetAlerts.length > 0 && (
            <View style={styles.alertContainer}>
              <Icon name="warning" size={20} color={colors.warning} />
              <Text style={styles.alertText}>
                {budgetAlerts.length} budget{budgetAlerts.length > 1 ? 's' : ''} need attention
              </Text>
            </View>
          )}

          {/* Spending Chart */}
          {chartData.length > 0 && (
            <Chart
              type="pie"
              data={chartData}
              title="Monthly Spending by Category"
              height={200}
            />
          )}

          {/* Recent Transactions */}
          <View style={styles.section}>
            <View style={commonStyles.spaceBetween}>
              <Text style={commonStyles.subtitle}>Recent Transactions</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="receipt-outline" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyStateText}>No transactions yet</Text>
                <Text style={commonStyles.textSecondary}>
                  Add your first transaction to get started
                </Text>
              </View>
            )}
          </View>

          {/* Active Budgets */}
          {activeBudgets.length > 0 && (
            <View style={styles.section}>
              <View style={commonStyles.spaceBetween}>
                <Text style={commonStyles.subtitle}>Active Budgets</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              {activeBudgets.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </View>
          )}
        </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  balanceContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  balanceCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
  },
  balanceLabel: {
    color: colors.backgroundAlt,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    color: colors.backgroundAlt,
    fontSize: 20,
    fontWeight: '700',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  alertText: {
    marginLeft: spacing.sm,
    color: colors.warning,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.xl,
  },
  seeAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateText: {
    ...commonStyles.text,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});
