import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import LogPage from './pages/LogPage';
import InvoiceGenerator from './pages/InvoiceGenerator';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/documents" element={<Dashboard />} />
      <Route path="/documents/:category" element={<LogPage />} />
      <Route path="/invoices" element={<InvoiceGenerator />} />
    </Routes>
  </BrowserRouter>
);

export default App;
