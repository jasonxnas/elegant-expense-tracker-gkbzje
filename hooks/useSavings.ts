
import { SavingsGoal } from '../types';
import { useStorage, storageKeys } from './useStorage';

export const useSavings = () => {
  const [savingsGoals, setSavingsGoals, , isLoading] = useStorage<SavingsGoal[]>(
    storageKeys.SAVINGS_GOALS,
    []
  );

  const addSavingsGoal = async (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: Date.now().toString(),
      targetDate: new Date(goal.targetDate),
    };

    await setSavingsGoals(prev => [newGoal, ...prev]);
    console.log('Savings goal added:', newGoal);
  };

  const updateSavingsGoal = async (id: string, updates: Partial<SavingsGoal>) => {
    await setSavingsGoals(prev =>
      prev.map(goal =>
        goal.id === id ? { ...goal, ...updates } : goal
      )
    );
    console.log('Savings goal updated:', id);
  };

  const deleteSavingsGoal = async (id: string) => {
    await setSavingsGoals(prev => prev.filter(goal => goal.id !== id));
    console.log('Savings goal deleted:', id);
  };

  const addToSavingsGoal = async (id: string, amount: number) => {
    await updateSavingsGoal(id, {
      currentAmount: savingsGoals.find(g => g.id === id)?.currentAmount + amount || amount,
    });
  };

  const getSavingsProgress = (goal: SavingsGoal) => {
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
  };

  const getActiveSavingsGoals = () => {
    const now = new Date();
    return savingsGoals.filter(goal => {
      const targetDate = new Date(goal.targetDate);
      return targetDate > now && goal.currentAmount < goal.targetAmount;
    });
  };

  const getTotalSavings = () => {
    return savingsGoals.reduce((total, goal) => total + goal.currentAmount, 0);
  };

  return {
    savingsGoals,
    isLoading,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addToSavingsGoal,
    getSavingsProgress,
    getActiveSavingsGoals,
    getTotalSavings,
  };
};
