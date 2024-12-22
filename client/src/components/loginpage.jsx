import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import amblem from '../assets/amblem.png'; // Logo dosyanızın yolu

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null); // Hangi bileşenin gösterileceğini kontrol eder

  return (
    <div className="login-page-container">
      <div className="header">
        <img src={amblem} alt="Balıkesir Üniversitesi Amblemi" className="logo" />
        <h1 className="university-title">T.C. BALIKESİR ÜNİVERSİTESİ</h1>
      </div>

      <div className="button-container">
        <button
          className="tab-button"
          onClick={() => navigate('/register')} // Register sayfasına yönlendirme
        >
          Register
        </button>
        <button
          className="tab-button"
          onClick={() => navigate('/login')} // Login sayfasına yönlendirme
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
