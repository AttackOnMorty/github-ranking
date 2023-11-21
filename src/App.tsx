import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Repositories from './components/Repositories';
import Users from './components/Users';
import { USER_TYPE } from './constants';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Repositories />} />
        <Route path="/repositories" element={<Repositories />} />
        <Route
          path="/developers"
          element={
            <Users userType={USER_TYPE.DEVELOPER} key={USER_TYPE.DEVELOPER} />
          }
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
  );
};

export default App;
