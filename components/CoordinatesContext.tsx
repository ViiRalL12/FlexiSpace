import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface CoordinatesContextType {
  coordinates: Coordinates | null;
  setCoordinates: (coordinates: Coordinates | null) => void;
}

const CoordinatesContext = createContext<CoordinatesContextType | undefined>(undefined);

export const useCoordinates = () => {
  const context = useContext(CoordinatesContext);
  if (!context) {
    throw new Error('useCoordinates must be used within a CoordinatesProvider');
  }
  return context;
};

export const CoordinatesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  return (
    <CoordinatesContext.Provider value={{ coordinates, setCoordinates }}>
      {children}
    </CoordinatesContext.Provider>
  );
};
