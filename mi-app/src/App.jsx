import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Tracking from './pages/Tracking';
import Logistics from './pages/Logistics';
import Rates from './pages/Rates';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-100 text-slate-900">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/marketplace" element={<LandingPage />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/rates" element={<Rates />} />
        </Routes>
      </div>
    </div>
  );
}