import React from 'react';
import { useNavigate } from 'react-router-dom';
import amblem from '../assets/amblem.png'; // Logo dosyanızın yolu
import '../styles/loginpage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <img src={amblem} alt="Balıkesir Üniversitesi Logo" className="login-logo" />
      <h1 className="university-title">T.C. BALIKESİR ÜNİVERSİTESİ</h1>
      <div className="auth-buttons">
        <button 
          className="auth-button"
          onClick={() => navigate('/register')} // Register sayfasına yönlendirme
        >
          Register
        </button>
        <button 
          className="auth-button"
          onClick={() => navigate('/login')} // Login sayfasına yönlendirme
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
