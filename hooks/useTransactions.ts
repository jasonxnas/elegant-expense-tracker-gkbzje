
import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { useStorage, storageKeys } from './useStorage';

export const useTransactions = () => {
  const [transactions, setTransactions, , isLoading, error] = useStorage<Transaction[]>(
    storageKeys.TRANSACTIONS,
    []
  );

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
        date: new Date(transaction.date),
      };

      await setTransactions(prev => [newTransaction, ...prev]);
      console.log('Transaction added:', newTransaction);
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw new Error(`Failed to add transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      await setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id ? { ...transaction, ...updates } : transaction
        )
      );
      console.log('Transaction updated:', id);
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw new Error(`Failed to update transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      console.log('Transaction deleted:', id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw new Error(`Failed to delete transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getTransactionsByDateRange = (startDate: Date, endDate: Date) => {
    try {
      return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    } catch (error) {
      console.error('Error filtering transactions by date range:', error);
      return [];
    }
  };

  const getTransactionsByCategory = (category: string) => {
    try {
      return transactions.filter(transaction => transaction.category === category);
    } catch (error) {
      console.error('Error filtering transactions by category:', error);
      return [];
    }
  };

  const getTotalIncome = (dateRange?: { start: Date; end: Date }) => {
    try {
      let filteredTransactions = transactions.filter(t => t.type === 'income');
      
      if (dateRange) {
        filteredTransactions = filteredTransactions.filter(t => {
          const date = new Date(t.date);
          return date >= dateRange.start && date <= dateRange.end;
        });
      }

      return filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0);
    } catch (error) {
      console.error('Error calculating total income:', error);
      return 0;
    }
  };

  const getTotalExpenses = (dateRange?: { start: Date; end: Date }) => {
    try {
      let filteredTransactions = transactions.filter(t => t.type === 'expense');
      
      if (dateRange) {
        filteredTransactions = filteredTransactions.filter(t => {
          const date = new Date(t.date);
          return date >= dateRange.start && date <= dateRange.end;
        });
      }

      return filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0);
    } catch (error) {
      console.error('Error calculating total expenses:', error);
      return 0;
    }
  };

  const getBalance = (dateRange?: { start: Date; end: Date }) => {
    try {
      return getTotalIncome(dateRange) - getTotalExpenses(dateRange);
    } catch (error) {
      console.error('Error calculating balance:', error);
      return 0;
    }
  };

  const getCategoryTotals = (type: 'income' | 'expense', dateRange?: { start: Date; end: Date }) => {
    try {
      let filteredTransactions = transactions.filter(t => t.type === type);
      
      if (dateRange) {
        filteredTransactions = filteredTransactions.filter(t => {
          const date = new Date(t.date);
          return date >= dateRange.start && date <= dateRange.end;
        });
      }

      const categoryTotals: { [key: string]: number } = {};
      
      filteredTransactions.forEach(transaction => {
        if (categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] += transaction.amount;
        } else {
          categoryTotals[transaction.category] = transaction.amount;
        }
      });

      return categoryTotals;
    } catch (error) {
      console.error('Error calculating category totals:', error);
      return {};
    }
  };

  return {
    transactions,
    isLoading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByDateRange,
    getTransactionsByCategory,
    getTotalIncome,
    getTotalExpenses,
    getBalance,
    getCategoryTotals,
  };
};
