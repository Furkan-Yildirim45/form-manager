import React from 'react';
import '../styles/header.css'; // CSS dosyası
import amblem from '../assets/amblem.png'; // Amblem dosyası

const Header = () => {
  return (
    <header className="header-container">
      <div className="logo-container">
        <img
          src={amblem}
          alt="Balıkesir Üniversitesi Amblemi"
          className="logo"
        />
      </div>
      <h1 className="title">Form Oluştur</h1>
    </header>
  );
};

export default Header;
