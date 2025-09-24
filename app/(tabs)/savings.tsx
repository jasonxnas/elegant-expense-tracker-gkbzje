
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, spacing, buttonStyles, borderRadius } from '../../styles/commonStyles';
import { useSavings } from '../../hooks/useSavings';
import SavingsGoalCard from '../../components/SavingsGoalCard';
import SimpleBottomSheet from '../../components/BottomSheet';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import { savingsCategories } from '../../data/categories';

export default function SavingsScreen() {
  const [isAddGoalVisible, setIsAddGoalVisible] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [targetDate, setTargetDate] = useState(new Date());

  const { savingsGoals, addSavingsGoal, deleteSavingsGoal, getActiveSavingsGoals, getTotalSavings } = useSavings();

  const activeSavingsGoals = getActiveSavingsGoals();
  const totalSavings = getTotalSavings();

  const handleAddGoal = async () => {
    if (!goalName || !targetAmount || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numericAmount = parseFloat(targetAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }

    try {
      await addSavingsGoal({
        name: goalName,
        targetAmount: numericAmount,
        currentAmount: 0,
        category: selectedCategory,
        priority,
        targetDate,
      });

      Alert.alert('Success', 'Savings goal created successfully');
      setIsAddGoalVisible(false);
      setGoalName('');
      setTargetAmount('');
      setSelectedCategory('');
      setPriority('medium');
      setTargetDate(new Date());
    } catch (error) {
      console.log('Error adding savings goal:', error);
      Alert.alert('Error', 'Failed to create savings goal');
    }
  };

  const handleDeleteGoal = (id: string) => {
    Alert.alert(
      'Delete Savings Goal',
      'Are you sure you want to delete this savings goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSavingsGoal(id),
        },
      ]
    );
  };

  const AddGoalSheet = () => (
    <ScrollView style={styles.sheetContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.sheetTitle}>Create Savings Goal</Text>

      {/* Goal Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Goal Name</Text>
        <TextInput
          style={styles.input}
          value={goalName}
          onChangeText={setGoalName}
          placeholder="e.g., Emergency Fund, Vacation"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Target Amount Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Target Amount</Text>
        <TextInput
          style={styles.amountInput}
          value={targetAmount}
          onChangeText={setTargetAmount}
          placeholder="0.00"
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Category Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoriesGrid}>
          {savingsCategories.map((category) => (
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

      {/* Priority Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityContainer}>
          {(['low', 'medium', 'high'] as const).map((priorityOption) => (
            <TouchableOpacity
              key={priorityOption}
              style={[
                styles.priorityButton,
                priority === priorityOption && styles.priorityButtonActive,
              ]}
              onPress={() => setPriority(priorityOption)}
            >
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === priorityOption && styles.priorityButtonTextActive,
                ]}
              >
                {priorityOption.charAt(0).toUpperCase() + priorityOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <Button
          text="Create Goal"
          onPress={handleAddGoal}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        {/* Total Savings Header */}
        <View style={styles.header}>
          <Text style={styles.totalSavingsLabel}>Total Savings</Text>
          <Text style={styles.totalSavingsAmount}>${totalSavings.toFixed(2)}</Text>
        </View>

        <ScrollView
          style={commonStyles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {activeSavingsGoals.length > 0 ? (
            activeSavingsGoals.map((goal) => (
              <SavingsGoalCard key={goal.id} goal={goal} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="wallet-outline" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>No savings goals</Text>
              <Text style={styles.emptyStateText}>
                Create your first savings goal to start building your future
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={buttonStyles.fab}
          onPress={() => setIsAddGoalVisible(true)}
          activeOpacity={0.8}
        >
          <Icon name="add" size={24} color={colors.backgroundAlt} />
        </TouchableOpacity>

        {/* Add Goal Bottom Sheet */}
        <SimpleBottomSheet
          isVisible={isAddGoalVisible}
          onClose={() => setIsAddGoalVisible(false)}
        >
          <AddGoalSheet />
        </SimpleBottomSheet>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    alignItems: 'center',
  },
  totalSavingsLabel: {
    color: colors.backgroundAlt,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  totalSavingsAmount: {
    color: colors.backgroundAlt,
    fontSize: 32,
    fontWeight: '700',
  },
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
  input: {
    ...commonStyles.input,
    fontSize: 16,
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
  priorityContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  priorityButtonTextActive: {
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
