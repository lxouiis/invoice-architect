import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import LogPage from './pages/LogPage';
import InvoiceGenerator from './pages/InvoiceGenerator';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App = () => (
  <GoogleOAuthProvider clientId={googleClientId}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/documents" element={<Dashboard />} />
        <Route path="/documents/:category" element={<LogPage />} />
        <Route path="/invoices" element={<InvoiceGenerator />} />
      </Routes>
    </BrowserRouter>
  </GoogleOAuthProvider>
);

export default App;
