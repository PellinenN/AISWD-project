import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext.js';
import { LoginScreen } from './setupAuth.js';
import DiaryPageUI from './DiaryPage.js'; // Page to create a diary entry
import EntryPageUI from './EntryPage.js'; // Page to view previous entries

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DiaryPageUI />} />
        <Route path="/entries" element={<EntryPageUI />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;