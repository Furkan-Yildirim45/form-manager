import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Yeni admin kaydı burada yapılabilir
    alert('Admin başarıyla kaydedildi!');
  };

  return (
    <div className="register-container">
      <h2>Admin Kayıt</h2>
      <form onSubmit={handleRegister}>
        <label>
          Kullanıcı Adı:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Yeni kullanıcı adınızı girin"
          />
        </label>
        <label>
          Şifre:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Şifrenizi girin"
          />
        </label>
        <button type="submit">Kayıt Ol</button>
      </form>
    </div>
  );
};

export default Register;
