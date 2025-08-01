// ScrollContext.tsx
import React, { createContext, useContext, useRef } from 'react';
import { ScrollView } from 'react-native';

type ScrollContextType = {
  scrollToFooter: () => void;
  scrollViewRef: React.RefObject<ScrollView | null>;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToFooter = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <ScrollContext.Provider value={{ scrollToFooter, scrollViewRef }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) throw new Error("useScroll must be used within ScrollProvider");
  return context;
};
