import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Repositories from './components/Repositories';
import Users from './components/Users';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Repositories />} />
        <Route path="/repositories" element={<Repositories />} />
        <Route path="/users" element={<Users />} />
      </Route>
    </Routes>
  );
};

export default App;
