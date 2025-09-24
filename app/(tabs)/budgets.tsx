
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, spacing, buttonStyles, borderRadius } from '../../styles/commonStyles';
import { useBudgets } from '../../hooks/useBudgets';
import BudgetCard from '../../components/BudgetCard';
import SimpleBottomSheet from '../../components/BottomSheet';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import { expenseCategories } from '../../data/categories';

export default function BudgetsScreen() {
  const [isAddBudgetVisible, setIsAddBudgetVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const { budgets, addBudget, deleteBudget, getActiveBudgets } = useBudgets();

  const activeBudgets = getActiveBudgets();

  const handleAddBudget = async () => {
    if (!selectedCategory || !amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // Check if budget already exists for this category
    const existingBudget = activeBudgets.find(b => b.category === selectedCategory);
    if (existingBudget) {
      Alert.alert('Error', 'A budget already exists for this category');
      return;
    }

    const now = new Date();
    let startDate = new Date(now);
    let endDate = new Date(now);

    switch (period) {
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
    }

    try {
      await addBudget({
        category: selectedCategory,
        amount: numericAmount,
        period,
        startDate,
        endDate,
      });

      Alert.alert('Success', 'Budget created successfully');
      setIsAddBudgetVisible(false);
      setSelectedCategory('');
      setAmount('');
      setPeriod('monthly');
    } catch (error) {
      console.log('Error adding budget:', error);
      Alert.alert('Error', 'Failed to create budget');
    }
  };

  const handleDeleteBudget = (id: string) => {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to delete this budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteBudget(id),
        },
      ]
    );
  };

  const AddBudgetSheet = () => (
    <ScrollView style={styles.sheetContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.sheetTitle}>Create Budget</Text>

      {/* Category Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoriesGrid}>
          {expenseCategories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={[
                styles.categoryButton,
                selectedCategory === category.name && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Icon
                name={category.icon as any}
                size={20}
                color={selectedCategory === category.name ? colors.backgroundAlt : category.color}
              />
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.name && styles.categoryButtonTextActive,
                ]}
                numberOfLines={2}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Amount Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Budget Amount</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Period Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Period</Text>
        <View style={styles.periodContainer}>
          {(['weekly', 'monthly', 'yearly'] as const).map((periodOption) => (
            <TouchableOpacity
              key={periodOption}
              style={[
                styles.periodButton,
                period === periodOption && styles.periodButtonActive,
              ]}
              onPress={() => setPeriod(periodOption)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  period === periodOption && styles.periodButtonTextActive,
                ]}
              >
                {periodOption.charAt(0).toUpperCase() + periodOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <Button
          text="Create Budget"
          onPress={handleAddBudget}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        <ScrollView
          style={commonStyles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {activeBudgets.length > 0 ? (
            activeBudgets.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="pie-chart-outline" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>No budgets set</Text>
              <Text style={styles.emptyStateText}>
                Create your first budget to track your spending
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={buttonStyles.fab}
          onPress={() => setIsAddBudgetVisible(true)}
          activeOpacity={0.8}
        >
          <Icon name="add" size={24} color={colors.backgroundAlt} />
        </TouchableOpacity>

        {/* Add Budget Bottom Sheet */}
        <SimpleBottomSheet
          isVisible={isAddBudgetVisible}
          onClose={() => setIsAddBudgetVisible(false)}
        >
          <AddBudgetSheet />
        </SimpleBottomSheet>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
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
  sheetContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  sheetTitle: {
    ...commonStyles.title,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.xl,
  },
  label: {
    ...commonStyles.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  amountInput: {
    ...commonStyles.input,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
    width: '30%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
    padding: spacing.sm,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  categoryButtonTextActive: {
    color: colors.backgroundAlt,
  },
  periodContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  periodButtonTextActive: {
    color: colors.backgroundAlt,
  },
  buttonContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
});
