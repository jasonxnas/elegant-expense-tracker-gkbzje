
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors, commonStyles, spacing, borderRadius } from '../styles/commonStyles';
import { useTransactions } from '../hooks/useTransactions';
import { expenseCategories, incomeCategories } from '../data/categories';
import Icon from './Icon';
import Button from './Button';

interface AddTransactionSheetProps {
  onClose: () => void;
}

export default function AddTransactionSheet({ onClose }: AddTransactionSheetProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [date, setDate] = useState(new Date());

  const { addTransaction } = useTransactions();

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = async () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      await addTransaction({
        type,
        amount: numericAmount,
        description,
        category: selectedCategory,
        date,
      });

      Alert.alert('Success', 'Transaction added successfully');
      onClose();
    } catch (error) {
      console.log('Error adding transaction:', error);
      Alert.alert('Error', 'Failed to add transaction');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Add Transaction</Text>

      {/* Type Selection */}
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
          onPress={() => {
            setType('expense');
            setSelectedCategory('');
          }}
        >
          <Icon name="remove-circle" size={20} color={type === 'expense' ? colors.backgroundAlt : colors.danger} />
          <Text style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}>
            Expense
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
          onPress={() => {
            setType('income');
            setSelectedCategory('');
          }}
        >
          <Icon name="add-circle" size={20} color={type === 'income' ? colors.backgroundAlt : colors.success} />
          <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>
            Income
          </Text>
        </TouchableOpacity>
      </View>

      {/* Amount Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Description Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Category Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
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

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <Button
          text="Add Transaction"
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    ...commonStyles.title,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    marginLeft: spacing.sm,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  typeButtonTextActive: {
    color: colors.backgroundAlt,
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
  buttonContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
});
