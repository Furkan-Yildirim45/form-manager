import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import '../styles/adminpanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-panel">
      <Header />
      <div className="button-container">
        <button onClick={() => navigate('/form')} className="panel-button">
          Form Oluştur
        </button>
        <button onClick={() => navigate('/pdf-view')} className="panel-button">
          PDFleri Görüntüle
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
