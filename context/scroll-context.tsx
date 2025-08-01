// ScrollContext.tsx
import React, { createContext, useContext, useRef } from 'react';

type ScrollContextType = {
  scrollToFooter: () => void;
  viewRef: React.RefObject<any | null>;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const viewRef = useRef<any>(null);

  const scrollToFooter = () => {
    viewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <ScrollContext.Provider value={{ scrollToFooter, viewRef }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) throw new Error("useScroll must be used within ScrollProvider");
  return context;
};
