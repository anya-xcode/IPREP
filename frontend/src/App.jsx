import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import AdminPanel from './pages/AdminPanel';
import HRInterviews from './pages/HRInterviews';
import Navbar from './components/Navbar';
import Resources from './pages/Resources';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/hr-interviews" element={<HRInterviews />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/admin" element={<AdminPanel />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

