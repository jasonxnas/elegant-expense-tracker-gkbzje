
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export const useStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStoredValue();
  }, [key]);

  const loadStoredValue = async () => {
    try {
      setError(null);
      const item = await AsyncStorage.getItem(key);
      if (item) {
        const parsedValue = JSON.parse(item);
        // Handle Date objects that were serialized
        const processedValue = processDateObjects(parsedValue);
        setStoredValue(processedValue);
      }
    } catch (error) {
      console.error('Error loading stored value for key:', key, error);
      setError(`Failed to load ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Keep the initial value on error
      setStoredValue(initialValue);
    } finally {
      setIsLoading(false);
    }
  };

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      setError(null);
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Validate the value before storing
      if (valueToStore === undefined || valueToStore === null) {
        console.warn('Attempting to store null/undefined value for key:', key);
        return;
      }

      setStoredValue(valueToStore);
      
      // Serialize the value, handling Date objects
      const serializedValue = JSON.stringify(valueToStore, (key, value) => {
        if (value instanceof Date) {
          return { __type: 'Date', value: value.toISOString() };
        }
        return value;
      });
      
      await AsyncStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error storing value for key:', key, error);
      setError(`Failed to store ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Revert to previous value on error
      await loadStoredValue();
    }
  };

  const removeValue = async () => {
    try {
      setError(null);
      await AsyncStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error removing stored value for key:', key, error);
      setError(`Failed to remove ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Helper function to process Date objects during deserialization
  const processDateObjects = (obj: any): any => {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'object' && obj.__type === 'Date') {
      return new Date(obj.value);
    }

    if (Array.isArray(obj)) {
      return obj.map(processDateObjects);
    }

    if (typeof obj === 'object') {
      const processed: any = {};
      for (const [key, value] of Object.entries(obj)) {
        processed[key] = processDateObjects(value);
      }
      return processed;
    }

    return obj;
  };

  return [storedValue, setValue, removeValue, isLoading, error] as const;
};

export const storageKeys = {
  TRANSACTIONS: 'transactions',
  BUDGETS: 'budgets',
  SAVINGS_GOALS: 'savings_goals',
  DEBT_ALERTS: 'debt_alerts',
  USER_PREFERENCES: 'user_preferences',
  ONBOARDING_COMPLETED: 'onboarding_completed',
};
