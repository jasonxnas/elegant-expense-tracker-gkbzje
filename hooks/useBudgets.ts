
import { Budget } from '../types';
import { useStorage, storageKeys } from './useStorage';
import { useTransactions } from './useTransactions';

export const useBudgets = () => {
  const [budgets, setBudgets, , isLoading] = useStorage<Budget[]>(storageKeys.BUDGETS, []);
  const { getCategoryTotals } = useTransactions();

  const addBudget = async (budget: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
      startDate: new Date(budget.startDate),
      endDate: new Date(budget.endDate),
    };

    await setBudgets(prev => [newBudget, ...prev]);
    console.log('Budget added:', newBudget);
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    await setBudgets(prev =>
      prev.map(budget =>
        budget.id === id ? { ...budget, ...updates } : budget
      )
    );
    console.log('Budget updated:', id);
  };

  const deleteBudget = async (id: string) => {
    await setBudgets(prev => prev.filter(budget => budget.id !== id));
    console.log('Budget deleted:', id);
  };

  const getBudgetProgress = (budget: Budget) => {
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
  };

  const getActiveBudgets = () => {
    const now = new Date();
    return budgets.filter(budget => {
      const startDate = new Date(budget.startDate);
      const endDate = new Date(budget.endDate);
      return now >= startDate && now <= endDate;
    });
  };

  const getBudgetAlerts = () => {
    const activeBudgets = getActiveBudgets();
    return activeBudgets.filter(budget => {
      const progress = getBudgetProgress(budget);
      return progress.progress >= 80; // Alert when 80% or more of budget is used
    });
  };

  return {
    budgets,
    isLoading,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetProgress,
    getActiveBudgets,
    getBudgetAlerts,
  };
};
