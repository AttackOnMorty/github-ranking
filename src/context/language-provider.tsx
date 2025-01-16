'use client';

import { createContext, useEffect, useState } from 'react';

import { getLanguagesAsync } from '@/api';

export const LanguageContext = createContext<string[]>([]);

export default function LanguageProvider({ children }: React.PropsWithChildren) {
  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    const getLanguages = async (): Promise<void> => {
      setLanguages(await getLanguagesAsync());
    };
    getLanguages();
  }, []);

  return (
    <LanguageContext.Provider value={languages}>
      {children}
    </LanguageContext.Provider>
  );
}
