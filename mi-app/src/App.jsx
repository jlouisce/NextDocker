import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import LandingPage from './pages/LandingPage';
import Marketplace from './pages/Marketplace';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UserProfile from './pages/UserProfile';
import Logistics from './pages/Logistics';
import Rates from './pages/Rates';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/perfil" element={<UserProfile />} />
        <Route path="/logistica" element={<Logistics />} />
        <Route path="/tarifas" element={<Rates />} />
      </Routes>
    </BrowserRouter>
  );
}