import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import '../styles/adminpanel.css';
import axios from "axios";
import { auth } from '../firebase';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getForms = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get('http://localhost:5000/api/forms', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setForms(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Formları getirme hatası:", error);
        setLoading(false);
      }
    };

    getForms();
  }, []);

  return (
    <div className="admin-panel">
      <Header />
      <div className="panel-container">
        <h2 className="panel-title">Admin Panel</h2>
        <div className="button-container">
          <button onClick={() => navigate('/form')} className="panel-button">
            Form Oluştur
          </button>
        </div>

        <div className="forms-list">
          <h3>Oluşturulan Formlar</h3>
          {loading ? (
            <p>Yükleniyor...</p>
          ) : forms.length === 0 ? (
            <p>Henüz form oluşturulmamış.</p>
          ) : (
            forms.map((form) => (
              <div key={form.id} className="form-item">
                <h4>{form.title}</h4>
                <p>Oluşturulma: {new Date(form.createdAt?.seconds * 1000).toLocaleString()}</p>
                <div className="form-actions">
                  <button onClick={() => navigate(`/form-view/${form.id}`)}>
                    Görüntüle
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
