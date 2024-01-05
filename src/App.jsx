import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from './components/AppBar';
import Sidebar from './components/Sidebar';
import Account from './pages/profile/Account';
import Profile from './pages/profile/Profile';
import Dashboard from './pages/sidebar/Dashboard';
import Incidents from './pages/sidebar/Incidents';
import Reports from './pages/sidebar/Reports';
import Profiles from './pages/sidebar/Profiles';
import Properties from './pages/sidebar/Properties';
import Employement from './pages/sidebar/Employement';
import Charges from './pages/sidebar/Charges';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar />
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '160px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/account" element={<Account />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/employment" element={<Employement />} />
            <Route path="/charges" element={<Charges />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
