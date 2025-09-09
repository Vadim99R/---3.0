import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Navigation from './components/Navigation';
import SupplyPlanning from './pages/SupplyPlanning';
import PackagingPlanning from './pages/PackagingPlanning';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Header />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f9fafb' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/supply-planning" replace />} />
          <Route path="/supply-planning" element={<SupplyPlanning />} />
          <Route path="/packaging-planning" element={<PackagingPlanning />} />
          <Route path="*" element={<Navigate to="/supply-planning" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;