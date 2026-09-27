import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import UserProfile from './pages/UserProfile'
import Container20ft from './pages/containers/Container20ft'
import Container40ft from './pages/containers/Container40ft'
import Container20ftRefrigerated from './pages/containers/Container20ftRefrigerated'
import Marketplace from './pages/Marketplace'
import Logistics from './pages/Logistics'
import Rates from './pages/Rates'
import Dashboard from './pages/dashboard/Dashboard'
import LoginDashboard from './pages/dashboard/LoginDashboard'
import SignUpDashboard from './pages/dashboard/SignUpDashboard'

function AppContent() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <>
      {!isLanding && (
        <nav>
          <Link to="/">Home</Link>
          {' | '}
          <Link to="/login">Login</Link>
          {' | '}
          <Link to="/signup">Sign Up</Link>
          {' | '}
          <Link to="/profile">Profile</Link>
          {' | '}
          <Link to="/containers/20ft">20ft</Link>
          {' | '}
          <Link to="/containers/40ft">40ft</Link>
          {' | '}
          <Link to="/containers/20ft-refrigerated">20ft Reefer</Link>
          {' | '}
          <Link to="/marketplace">Marketplace</Link>
          {' | '}
          <Link to="/logistics">Logistics</Link>
          {' | '}
          <Link to="/rates">Rates</Link>
          {' | '}
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      )}

      <div className={isLanding ? undefined : 'app-inner'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/containers/20ft" element={<Container20ft />} />
          <Route path="/containers/40ft" element={<Container40ft />} />
          <Route path="/containers/20ft-refrigerated" element={<Container20ftRefrigerated />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/login" element={<LoginDashboard />} />
          <Route path="/dashboard/signup" element={<SignUpDashboard />} />
        </Routes>
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
