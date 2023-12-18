import React, { createContext, useContext, useState, ReactNode } from 'react';

type GlobalContextType = {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

type GlobalProviderProps = {
  children: ReactNode;
};

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <GlobalContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
