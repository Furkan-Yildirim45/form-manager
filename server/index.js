const express = require('express');
const cors = require('cors');
const { admin, db } = require('./firebase-config');
require('dotenv').config();

const app = express();

// CORS ayarları
const corsOptions = {
  origin: 'http://localhost:3000', // React uygulamanızın URL'i
  credentials: true, // Kimlik bilgilerini kabul et
  optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend bağlantısı başarılı!' });
});

// Form oluşturma route'u
app.post('/api/forms', async (req, res) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken) {
      return res.status(403).json({ error: 'Geçersiz token' });
    }

    const formData = req.body;
    console.log('Gelen form verileri:', formData); // Form verilerini kontrol et

    // Firestore'a kaydet
    const formRef = await db.collection('formlar').add({
      ...formData,
      userId: decodedToken.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('Form kaydedildi, ID:', formRef.id); // Kaydedilen form ID'sini kontrol et

    res.status(201).json({ 
      id: formRef.id, 
      message: 'Form başarıyla kaydedildi' 
    });
  } catch (error) {
    console.error('Form kaydetme hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// Formları getirme route'u
app.get('/api/forms', async (req, res) => {
  try {
    // Token doğrulama
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken) {
      return res.status(403).json({ error: 'Geçersiz token' });
    }

    const formsSnapshot = await db.collection('formlar').get();
    const forms = [];
    formsSnapshot.forEach(doc => {
      forms.push({ id: doc.id, ...doc.data() });
    });
    res.json(forms);
  } catch (error) {
    console.error('Form getirme hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// Tek bir formu getirme route'u
app.get('/api/forms/:formId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken) {
      return res.status(403).json({ error: 'Geçersiz token' });
    }

    const formDoc = await db.collection('formlar').doc(req.params.formId).get();
    
    if (!formDoc.exists) {
      return res.status(404).json({ error: 'Form bulunamadı' });
    }

    res.json({ id: formDoc.id, ...formDoc.data() });
  } catch (error) {
    console.error('Form getirme hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 