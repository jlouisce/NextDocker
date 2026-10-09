import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Logistics from './pages/Logistics';
import Rates from './pages/Rates';
import Tracking from './pages/Tracking';
import Profile from './pages/Profile';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/marketplace" element={<LandingPage />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}