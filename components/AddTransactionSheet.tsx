
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors, commonStyles, spacing, borderRadius } from '../styles/commonStyles';
import { expenseCategories, incomeCategories } from '../data/categories';
import { useTransactions } from '../hooks/useTransactions';
import Icon from './Icon';
import Button from './Button';

interface AddTransactionSheetProps {
  onClose: () => void;
}

export default function AddTransactionSheet({ onClose }: AddTransactionSheetProps) {
  const { addTransaction } = useTransactions();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleSubmit = async () => {
    if (!amount || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      await addTransaction({
        amount: numericAmount,
        category,
        description: description || `${type === 'income' ? 'Income' : 'Expense'} - ${category}`,
        date: date,
        type,
      });

      Alert.alert('Success', 'Transaction added successfully');
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert(
        'Error', 
        `Failed to add transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={commonStyles.subtitle}>Add Transaction</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Type Selection */}
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'expense' && styles.typeButtonActive,
              { backgroundColor: type === 'expense' ? colors.danger : colors.backgroundAlt }
            ]}
            onPress={() => {
              setType('expense');
              setCategory(''); // Reset category when type changes
            }}
          >
            <Icon 
              name="remove-circle-outline" 
              size={20} 
              color={type === 'expense' ? colors.backgroundAlt : colors.text} 
            />
            <Text style={[
              styles.typeButtonText,
              { color: type === 'expense' ? colors.backgroundAlt : colors.text }
            ]}>
              Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'income' && styles.typeButtonActive,
              { backgroundColor: type === 'income' ? colors.success : colors.backgroundAlt }
            ]}
            onPress={() => {
              setType('income');
              setCategory(''); // Reset category when type changes
            }}
          >
            <Icon 
              name="add-circle-outline" 
              size={20} 
              color={type === 'income' ? colors.backgroundAlt : colors.text} 
            />
            <Text style={[
              styles.typeButtonText,
              { color: type === 'income' ? colors.backgroundAlt : colors.text }
            ]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount *</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Category Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={[
                  styles.categoryButton,
                  category === cat.name && styles.categoryButtonActive,
                  { backgroundColor: category === cat.name ? cat.color : colors.backgroundAlt }
                ]}
                onPress={() => setCategory(cat.name)}
              >
                <Icon 
                  name={cat.icon} 
                  size={20} 
                  color={category === cat.name ? colors.backgroundAlt : colors.text} 
                />
                <Text style={[
                  styles.categoryButtonText,
                  { color: category === cat.name ? colors.backgroundAlt : colors.text }
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Optional description"
            placeholderTextColor={colors.textSecondary}
            multiline
          />
        </View>

        {/* Date Display */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.dateContainer}>
            <Icon name="calendar-outline" size={20} color={colors.text} />
            <Text style={styles.dateText}>
              {date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <Button
          title={isSubmitting ? "Adding..." : "Add Transaction"}
          onPress={handleSubmit}
          disabled={isSubmitting || !amount || !category}
          style={styles.submitButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  typeButtonActive: {
    // Active styles are handled inline
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: spacing.lg,
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
  categoryScroll: {
    marginTop: spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    gap: spacing.xs,
    minWidth: 100,
  },
  categoryButtonActive: {
    // Active styles are handled inline
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  dateText: {
    ...commonStyles.text,
    fontSize: 16,
  },
  submitButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
