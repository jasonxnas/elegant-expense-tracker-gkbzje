
import { SavingsGoal } from '../types';
import { useStorage, storageKeys } from './useStorage';

export const useSavings = () => {
  const [savingsGoals, setSavingsGoals, , isLoading, error] = useStorage<SavingsGoal[]>(
    storageKeys.SAVINGS_GOALS,
    []
  );

  const addSavingsGoal = async (goal: Omit<SavingsGoal, 'id'>) => {
    try {
      const newGoal: SavingsGoal = {
        ...goal,
        id: Date.now().toString(),
        targetDate: new Date(goal.targetDate),
      };

      await setSavingsGoals(prev => [newGoal, ...prev]);
      console.log('Savings goal added:', newGoal);
      return newGoal;
    } catch (error) {
      console.error('Error adding savings goal:', error);
      throw new Error(`Failed to add savings goal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const updateSavingsGoal = async (id: string, updates: Partial<SavingsGoal>) => {
    try {
      await setSavingsGoals(prev =>
        prev.map(goal =>
          goal.id === id ? { ...goal, ...updates } : goal
        )
      );
      console.log('Savings goal updated:', id);
    } catch (error) {
      console.error('Error updating savings goal:', error);
      throw new Error(`Failed to update savings goal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const deleteSavingsGoal = async (id: string) => {
    try {
      await setSavingsGoals(prev => prev.filter(goal => goal.id !== id));
      console.log('Savings goal deleted:', id);
    } catch (error) {
      console.error('Error deleting savings goal:', error);
      throw new Error(`Failed to delete savings goal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const addToSavingsGoal = async (id: string, amount: number) => {
    try {
      const currentGoal = savingsGoals.find(g => g.id === id);
      if (!currentGoal) {
        throw new Error('Savings goal not found');
      }
      
      await updateSavingsGoal(id, {
        currentAmount: currentGoal.currentAmount + amount,
      });
    } catch (error) {
      console.error('Error adding to savings goal:', error);
      throw new Error(`Failed to add to savings goal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getSavingsProgress = (goal: SavingsGoal) => {
    try {
      const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
      const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
      const isCompleted = goal.currentAmount >= goal.targetAmount;

      // Calculate days remaining
      const now = new Date();
      const targetDate = new Date(goal.targetDate);
      const daysRemaining = Math.max(0, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

      // Calculate required monthly savings
      const monthsRemaining = Math.max(1, daysRemaining / 30);
      const requiredMonthlySavings = remaining / monthsRemaining;

      return {
        progress: Math.min(progress, 100),
        remaining,
        isCompleted,
        daysRemaining,
        requiredMonthlySavings,
      };
    } catch (error) {
      console.error('Error calculating savings progress:', error);
      return {
        progress: 0,
        remaining: goal.targetAmount,
        isCompleted: false,
        daysRemaining: 0,
        requiredMonthlySavings: 0,
      };
    }
  };

  const getActiveSavingsGoals = () => {
    try {
      const now = new Date();
      return savingsGoals.filter(goal => {
        const targetDate = new Date(goal.targetDate);
        return targetDate > now && goal.currentAmount < goal.targetAmount;
      });
    } catch (error) {
      console.error('Error getting active savings goals:', error);
      return [];
    }
  };

  const getTotalSavings = () => {
    try {
      return savingsGoals.reduce((total, goal) => total + goal.currentAmount, 0);
    } catch (error) {
      console.error('Error calculating total savings:', error);
      return 0;
    }
  };

  return {
    savingsGoals,
    isLoading,
    error,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addToSavingsGoal,
    getSavingsProgress,
    getActiveSavingsGoals,
    getTotalSavings,
  };
};
