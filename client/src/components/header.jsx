import React from 'react';
import '../styles/header.css'; // CSS dosyası için
import amblem from '../assets/amblem.png'; // Amblem dosyasını içe aktar

const Header = () => {
  return (
    <header className="header-container">
      <img
        src={amblem} // Assets klasöründeki amblemi burada kullanıyoruz
        alt="Balıkesir Üniversitesi Amblemi"
        className="logo"
      />
      <h1 className="title">Form Oluştur</h1>
    </header>
  );
};

export default Header;
