import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/login';
import Register from './components/register';
import AdminPanel from './components/adminpanel';
import Form from './components/form';
import FormView from './components/formView';
import LoginPage from './components/loginpage';

const App = () => {
  const [formData, setFormData] = useState({
    formTitle: '',
    fields: [],
  });

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/adminpanel" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/form" element={
            <ProtectedRoute>
              <Form setFormData={setFormData} />
            </ProtectedRoute>
          } />
          <Route path="/form-view/:formId" element={
            <ProtectedRoute>
              <FormView />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
