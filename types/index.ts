
export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  type: 'income' | 'expense';
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

export interface DebtAlert {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  minimumPayment: number;
  interestRate: number;
  isActive: boolean;
}

export interface FinancialTip {
  id: string;
  title: string;
  content: string;
  category: 'budgeting' | 'saving' | 'investing' | 'debt' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
}

export interface UserPreferences {
  currency: string;
  budgetAlerts: boolean;
  savingsReminders: boolean;
  debtAlerts: boolean;
  notificationTime: string;
  theme: 'light' | 'dark';
}

export interface CategoryData {
  name: string;
  amount: number;
  color: string;
  icon: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    colors?: string[];
  }[];
}
