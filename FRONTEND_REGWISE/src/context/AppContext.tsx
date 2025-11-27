import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Country } from "../types";
import { COUNTRIES } from "../utils/constants";
import { countriesAPI } from "../services/api";

interface AppContextType {
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country | null) => void;
  countries: Country[];
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

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [countries, setCountries] = useState<Country[]>(COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    COUNTRIES[0] || null
  );
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await countriesAPI.getCountries();
        if (mounted && data && data.length) {
          setCountries(data);
          setSelectedCountry((prev) => prev ?? data[0]);
        }
      } catch (err) {
        console.error("Failed to load countries from API:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        selectedCountry,
        setSelectedCountry,
        countries,
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
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
