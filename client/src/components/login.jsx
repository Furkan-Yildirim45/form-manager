import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user'); // 'user' veya 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore'dan kullanıcı rolünü kontrol et
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      if (!userData) {
        setError('Kullanıcı bilgileri bulunamadı');
        await auth.signOut();
        return;
      }

      const userRole = userData.role;

      // Admin/User kontrolü
      if (activeTab === 'admin' && userRole !== 'admin') {
        setError('Bu hesap admin yetkisine sahip değil. Lütfen kullanıcı girişini kullanın.');
        await auth.signOut();
        return;
      }

      if (activeTab === 'user' && userRole !== 'user') {
        setError('Bu bir admin hesabıdır. Lütfen admin girişini kullanın.');
        await auth.signOut();
        return;
      }

      // Başarılı giriş sonrası yönlendirme
      if (activeTab === 'admin' && userRole === 'admin') {
        navigate('/adminpanel');
      } else {
        navigate('/form');
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      let errorMessage = 'Giriş başarısız: ';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage += 'Kullanıcı bulunamadı';
          break;
        case 'auth/wrong-password':
          errorMessage += 'Hatalı şifre';
          break;
        case 'auth/invalid-email':
          errorMessage += 'Geçersiz email formatı';
          break;
        default:
          errorMessage += error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-tabs">
          <button
            className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => setActiveTab('user')}
          >
            Kullanıcı Girişi
          </button>
          <button
            className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            Admin Girişi
          </button>
          <div 
            className="tab-indicator" 
            style={{ 
              transform: `translateX(${activeTab === 'user' ? '0' : '100%'})` 
            }} 
          />
        </div>

        <h2 className="login-title">
          {activeTab === 'user' ? 'Kullanıcı Girişi' : 'Admin Girişi'}
        </h2>
        
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`${activeTab === 'admin' ? 'Admin email' : 'Email'} adresinizi girin`}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
