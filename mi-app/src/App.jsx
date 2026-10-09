import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Logistics from './pages/Logistics';
import Rates from './pages/Rates';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/dashboard/Dashboard';
import LoginDashboard from './pages/dashboard/LoginDashboard';
import SignUpDashboard from './pages/dashboard/SignUpDashboard';

export default function App() {
  // El dashboard y su acceso tienen su propio encabezado, así que no llevan el Navbar general.
  const { pathname } = useLocation();
  const showNavbar = !pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-100 text-slate-900">
      {showNavbar && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/marketplace" element={<LandingPage />} />
          <Route path="/containers/:id" element={<ProductDetail />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/login" element={<LoginDashboard />} />
          <Route path="/dashboard/signup" element={<SignUpDashboard />} />
        </Routes>
      </div>
    </div>
  );
}