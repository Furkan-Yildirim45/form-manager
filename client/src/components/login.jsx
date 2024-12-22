import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin-panel'); // Direkt olarak admin paneline yönlendirme yap
  };

  return (
    <div className="login-container">
      <h2>Admin Giriş</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Kullanıcı Adı:
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleInputChange}
            placeholder="Kullanıcı adınızı girin"
          />
        </label>
        <label>
          Şifre:
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            placeholder="Şifrenizi girin"
          />
        </label>
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
};

export default Login;
