
import { Budget } from '../types';
import { useStorage, storageKeys } from './useStorage';
import { useTransactions } from './useTransactions';

export const useBudgets = () => {
  const [budgets, setBudgets, , isLoading, error] = useStorage<Budget[]>(storageKeys.BUDGETS, []);
  const { getCategoryTotals } = useTransactions();

  const addBudget = async (budget: Omit<Budget, 'id' | 'spent'>) => {
    try {
      const newBudget: Budget = {
        ...budget,
        id: Date.now().toString(),
        spent: 0,
        startDate: new Date(budget.startDate),
        endDate: new Date(budget.endDate),
      };

      await setBudgets(prev => [newBudget, ...prev]);
      console.log('Budget added:', newBudget);
      return newBudget;
    } catch (error) {
      console.error('Error adding budget:', error);
      throw new Error(`Failed to add budget: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      await setBudgets(prev =>
        prev.map(budget =>
          budget.id === id ? { ...budget, ...updates } : budget
        )
      );
      console.log('Budget updated:', id);
    } catch (error) {
      console.error('Error updating budget:', error);
      throw new Error(`Failed to update budget: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await setBudgets(prev => prev.filter(budget => budget.id !== id));
      console.log('Budget deleted:', id);
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw new Error(`Failed to delete budget: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getBudgetProgress = (budget: Budget) => {
    try {
      const categoryTotals = getCategoryTotals('expense', {
        start: new Date(budget.startDate),
        end: new Date(budget.endDate),
      });

      const spent = categoryTotals[budget.category] || 0;
      const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      const remaining = Math.max(0, budget.amount - spent);
      const isOverBudget = spent > budget.amount;

      return {
        spent,
        progress: Math.min(progress, 100),
        remaining,
        isOverBudget,
      };
    } catch (error) {
      console.error('Error calculating budget progress:', error);
      return {
        spent: 0,
        progress: 0,
        remaining: budget.amount,
        isOverBudget: false,
      };
    }
  };

  const getActiveBudgets = () => {
    try {
      const now = new Date();
      return budgets.filter(budget => {
        const startDate = new Date(budget.startDate);
        const endDate = new Date(budget.endDate);
        return now >= startDate && now <= endDate;
      });
    } catch (error) {
      console.error('Error getting active budgets:', error);
      return [];
    }
  };

  const getBudgetAlerts = () => {
    try {
      const activeBudgets = getActiveBudgets();
      return activeBudgets.filter(budget => {
        const progress = getBudgetProgress(budget);
        return progress.progress >= 80; // Alert when 80% or more of budget is used
      });
    } catch (error) {
      console.error('Error getting budget alerts:', error);
      return [];
    }
  };

  return {
    budgets,
    isLoading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetProgress,
    getActiveBudgets,
    getBudgetAlerts,
  };
};
