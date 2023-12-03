import { createContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { getLanguagesAsync } from './api';
import Layout from './components/Layout';
import Repositories from './components/Repositories';
import Users from './components/Users';
import { USER_TYPE } from './constants';

export const LanguagesContext = createContext<string[]>([]);

const App: React.FC = () => {
  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    const getLanguages = async (): Promise<void> => {
      setLanguages(await getLanguagesAsync());
    };
    const id = setTimeout(() => {
      void getLanguages();
    }, 300);
    return () => {
      clearTimeout(id);
    };
  }, []);

  return (
    <LanguagesContext.Provider value={languages}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Repositories />} />
          <Route path="/repositories" element={<Repositories />} />
          <Route
            path="/users"
            element={<Users userType={USER_TYPE.USER} key={USER_TYPE.USER} />}
          />
          <Route
            path="/organizations"
            element={
              <Users
                userType={USER_TYPE.ORGANIZATION}
                key={USER_TYPE.ORGANIZATION}
              />
            }
          />
        </Route>
      </Routes>
    </LanguagesContext.Provider>
  );
};

export default App;
