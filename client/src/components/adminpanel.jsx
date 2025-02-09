import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { getFirestore, collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import '../styles/adminpanel.css';
import amblem from '../assets/amblem.png';
import { db } from '../firebase';  // getFirestore yerine direkt db'yi import et

const AdminPanel = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        console.log("Fetch forms başladı");
        console.log("Current user:", auth.currentUser);
        
        const formsRef = collection(db, 'formlar');
        const q = query(formsRef, orderBy('createdAt', 'desc'));
        
        console.log("Query oluşturuldu, koleksiyon:", formsRef.path);
        const querySnapshot = await getDocs(q);
        console.log("Query sonucu:", querySnapshot.size, "döküman bulundu");
        
        const formsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log("Döküman verisi:", data);
          
          // Timestamp kontrolü ve dönüşümü
          let formattedDate = 'Tarih belirtilmemiş';
          if (data.createdAt) {
            if (data.createdAt.toDate) { // Firestore Timestamp
              formattedDate = data.createdAt.toDate().toLocaleString('tr-TR');
            } else if (data.createdAt.seconds) { // Unix timestamp
              formattedDate = new Date(data.createdAt.seconds * 1000).toLocaleString('tr-TR');
            } else if (typeof data.createdAt === 'string') { // ISO string
              formattedDate = new Date(data.createdAt).toLocaleString('tr-TR');
            }
          }

          return {
            id: doc.id,
            ...data,
            createdAt: formattedDate
          };
        });
        
        console.log("İşlenmiş form verileri:", formsData);
        setForms(formsData);
      } catch (error) {
        console.error("Formlar yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    if (auth.currentUser) {
      console.log("Kullanıcı var:", auth.currentUser.email);
      fetchForms();
    } else {
      console.log("Kullanıcı yok!");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
    }
  };

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <div className="nav-brand">
          <img src={amblem} alt="Logo" className="nav-logo" />
          <h1>Balıkesir Üniversitesi Rektörlüğü</h1>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Çıkış Yap
        </button>
      </nav>

      <div className="admin-content">
        <div className="admin-header">
          <h2>Admin Panel</h2>
          <button 
            onClick={() => navigate('/form')} 
            className="create-form-button"
          >
            Form Oluştur
          </button>
        </div>

        <div className="forms-container">
          <h3>Oluşturulan Formlar</h3>
          {loading ? (
            <div className="loading">Yükleniyor...</div>
          ) : forms.length === 0 ? (
            <div className="no-forms">Henüz form oluşturulmamış.</div>
          ) : (
            <div className="forms-grid">
              {forms.map((form) => (
                <div key={form.id} className="form-card">
                  <div className="form-card-header">
                    <h4>{form.title || 'İsimsiz Form'}</h4>
                    <span className="form-date">{form.createdAt}</span>
                  </div>
                  <div className="form-card-actions">
                    <button 
                      onClick={() => navigate(`/form-view/${form.id}`)}
                      className="view-button"
                    >
                      Görüntüle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
