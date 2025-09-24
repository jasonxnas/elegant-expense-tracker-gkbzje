
import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { useStorage, storageKeys } from './useStorage';

export const useTransactions = () => {
  const [transactions, setTransactions, , isLoading] = useStorage<Transaction[]>(
    storageKeys.TRANSACTIONS,
    []
  );

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date(transaction.date),
    };

    await setTransactions(prev => [newTransaction, ...prev]);
    console.log('Transaction added:', newTransaction);
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    await setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id ? { ...transaction, ...updates } : transaction
      )
    );
    console.log('Transaction updated:', id);
  };

  const deleteTransaction = async (id: string) => {
    await setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    console.log('Transaction deleted:', id);
  };

  const getTransactionsByDateRange = (startDate: Date, endDate: Date) => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  const getTransactionsByCategory = (category: string) => {
    return transactions.filter(transaction => transaction.category === category);
  };

  const getTotalIncome = (dateRange?: { start: Date; end: Date }) => {
    let filteredTransactions = transactions.filter(t => t.type === 'income');
    
    if (dateRange) {
      filteredTransactions = filteredTransactions.filter(t => {
        const date = new Date(t.date);
        return date >= dateRange.start && date <= dateRange.end;
      });
    }

    return filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getTotalExpenses = (dateRange?: { start: Date; end: Date }) => {
    let filteredTransactions = transactions.filter(t => t.type === 'expense');
    
    if (dateRange) {
      filteredTransactions = filteredTransactions.filter(t => {
        const date = new Date(t.date);
        return date >= dateRange.start && date <= dateRange.end;
      });
    }

    return filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getBalance = (dateRange?: { start: Date; end: Date }) => {
    return getTotalIncome(dateRange) - getTotalExpenses(dateRange);
  };

  const getCategoryTotals = (type: 'income' | 'expense', dateRange?: { start: Date; end: Date }) => {
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
  };

  return {
    transactions,
    isLoading,
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
