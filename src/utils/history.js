import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);

  const addToHistory = useCallback(async (entry) => {
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 200);
      // Save to AsyncStorage (fire and forget)
      AsyncStorage.setItem('calcHistory', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    AsyncStorage.removeItem('calcHistory').catch(() => {});
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('calcHistory');
      if (data) setHistory(JSON.parse(data));
    } catch (error) {
      // Silently fail - history will be empty
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory, loadHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}