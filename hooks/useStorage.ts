
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export const useStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredValue();
  }, []);

  const loadStoredValue = async () => {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log('Error loading stored value:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log('Error storing value:', error);
    }
  };

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.log('Error removing stored value:', error);
    }
  };

  return [storedValue, setValue, removeValue, isLoading] as const;
};

export const storageKeys = {
  TRANSACTIONS: 'transactions',
  BUDGETS: 'budgets',
  SAVINGS_GOALS: 'savings_goals',
  DEBT_ALERTS: 'debt_alerts',
  USER_PREFERENCES: 'user_preferences',
  ONBOARDING_COMPLETED: 'onboarding_completed',
};
