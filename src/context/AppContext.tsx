import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Country } from '../types';
import { COUNTRIES } from '../utils/constants';

interface AppContextType {
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country | null) => void;
  searchHistory: SearchHistoryItem[];
  addSearchHistory: (query: string, country: string) => void;
}

interface SearchHistoryItem {
  id: string;
  query: string;
  country: string;
  timestamp: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(COUNTRIES[0]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  const addSearchHistory = (query: string, country: string) => {
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query,
      country,
      timestamp: new Date().toISOString(),
    };
    
    setSearchHistory((prev) => [newItem, ...prev].slice(0, 10)); // Keep last 10 searches
  };

  return (
    <AppContext.Provider
      value={{
        selectedCountry,
        setSelectedCountry,
        searchHistory,
        addSearchHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
