import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from './components/form'; // Form oluşturma sayfası
import FormView from './components/formView'; // Form görüntüleme sayfası
import AdminPanel from './components/adminpanel'; // Admin Paneli
import Login from './components/login'; // Admin giriş sayfası
import Register from './components/register'; // Admin kayıt sayfası
import LoginPage from './components/loginpage'; // Giriş sayfası

const App = () => {
  const [formData, setFormData] = useState({
    formTitle: '',
    fields: [],
  });

  return (
    <Router>
      <Routes>
        {/* Giriş sayfası */}
        <Route path="/" element={<LoginPage />} />
        {/* Form oluşturma sayfası */}
        <Route path="/form" element={<Form setFormData={setFormData} />} />
        {/* Form görüntüleme sayfası */}
        <Route
          path="/form-view"
          element={<FormView formTitle={formData.formTitle} fields={formData.fields} />}
        />
        {/* Admin giriş sayfası */}
        <Route path="/login" element={<Login />} />
        {/* Admin kayıt sayfası */}
        <Route path="/register" element={<Register />} />
        {/* Admin paneli */}
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
