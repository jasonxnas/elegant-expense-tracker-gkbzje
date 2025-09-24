
import { colors } from '../styles/commonStyles';

export const expenseCategories = [
  { name: 'Food & Dining', icon: 'restaurant', color: colors.chart.food },
  { name: 'Transportation', icon: 'car', color: colors.chart.transport },
  { name: 'Shopping', icon: 'bag', color: colors.chart.shopping },
  { name: 'Entertainment', icon: 'game-controller', color: colors.chart.entertainment },
  { name: 'Bills & Utilities', icon: 'receipt', color: colors.chart.bills },
  { name: 'Healthcare', icon: 'medical', color: colors.danger },
  { name: 'Education', icon: 'school', color: colors.primary },
  { name: 'Travel', icon: 'airplane', color: colors.accent },
  { name: 'Other', icon: 'ellipsis-horizontal', color: colors.chart.other },
];

export const incomeCategories = [
  { name: 'Salary', icon: 'briefcase', color: colors.success },
  { name: 'Freelance', icon: 'laptop', color: colors.primary },
  { name: 'Investment', icon: 'trending-up', color: colors.chart.savings },
  { name: 'Business', icon: 'storefront', color: colors.warning },
  { name: 'Other', icon: 'cash', color: colors.chart.other },
];

export const savingsCategories = [
  { name: 'Emergency Fund', icon: 'shield-checkmark', color: colors.success },
  { name: 'Vacation', icon: 'airplane', color: colors.accent },
  { name: 'Car', icon: 'car', color: colors.chart.transport },
  { name: 'House', icon: 'home', color: colors.primary },
  { name: 'Education', icon: 'school', color: colors.warning },
  { name: 'Retirement', icon: 'time', color: colors.chart.savings },
  { name: 'Other', icon: 'wallet', color: colors.chart.other },
];

export const financialTips = [
  {
    id: '1',
    title: 'The 50/30/20 Rule',
    content: 'Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment. This simple rule helps maintain a balanced financial life.',
    category: 'budgeting' as const,
    difficulty: 'beginner' as const,
    readTime: 3,
  },
  {
    id: '2',
    title: 'Build an Emergency Fund',
    content: 'Start with $1,000 as your initial emergency fund, then work towards 3-6 months of expenses. This fund protects you from unexpected financial setbacks.',
    category: 'saving' as const,
    difficulty: 'beginner' as const,
    readTime: 4,
  },
  {
    id: '3',
    title: 'Track Every Expense',
    content: 'Recording all your expenses, no matter how small, helps identify spending patterns and areas where you can cut back. Use this app to make it easier!',
    category: 'budgeting' as const,
    difficulty: 'beginner' as const,
    readTime: 2,
  },
  {
    id: '4',
    title: 'Pay Off High-Interest Debt First',
    content: 'Focus on paying off debts with the highest interest rates first (avalanche method) to minimize the total interest paid over time.',
    category: 'debt' as const,
    difficulty: 'intermediate' as const,
    readTime: 5,
  },
  {
    id: '5',
    title: 'Automate Your Savings',
    content: 'Set up automatic transfers to your savings account right after payday. This "pay yourself first" approach ensures consistent saving habits.',
    category: 'saving' as const,
    difficulty: 'beginner' as const,
    readTime: 3,
  },
];
