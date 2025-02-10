import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { usePDF } from 'react-to-pdf';
import '../styles/formView.css';
import amblem from '../assets/amblem.png';

const FormView = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const pdfRef = useRef(null);
  const { toPDF, targetRef } = usePDF({
    filename: form?.title ? `${form.title}_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}.pdf` : 'form.pdf',
    page: { margin: 20 }
  });

  useEffect(() => {
    const fetchForm = async () => {
      try {
        // Kullanıcının oturum durumunu kontrol et
        if (!auth.currentUser) {
          console.error("Kullanıcı oturum açmamış");
          navigate('/login');
          return;
        }

        // Kullanıcının rolünü kontrol et
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const userIsAdmin = userDoc.exists() && userDoc.data().role === 'admin';
        setIsAdmin(userIsAdmin);

        const formDoc = await getDoc(doc(db, 'formlar', formId));
        if (formDoc.exists()) {
          const formData = formDoc.data();
          
          // Eğer kullanıcı admin değilse ve formun sahibi değilse, erişimi reddet
          if (!userIsAdmin && formData.userId !== auth.currentUser.uid) {
            console.error("Bu formu görüntüleme yetkiniz yok");
            navigate('/form');
            return;
          }

          setForm({
            id: formDoc.id,
            ...formData
          });
        } else {
          console.error("Form bulunamadı");
        }
      } catch (error) {
        console.error("Form yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId, navigate]);

  const handleBack = () => {
    if (isAdmin) {
      navigate('/adminpanel');
    } else {
      navigate('/form');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await toPDF();
    } catch (error) {
      console.error('PDF oluşturulurken hata:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      const shareableLink = `${window.location.origin}/form-view/${formId}`;
      await navigator.clipboard.writeText(shareableLink);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (error) {
      console.error('Link kopyalanırken hata:', error);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (!form) {
    return <div className="error">Form bulunamadı</div>;
  }

  return (
    <div className="formview-container">
      <nav className="formview-nav">
        <div className="nav-brand">
          <img src={amblem} alt="Logo" className="nav-logo" />
          <h1>Balıkesir Üniversitesi Rektörlüğü</h1>
        </div>
        <button onClick={handleBack} className="back-button">
          Geri Dön
        </button>
      </nav>

      <div className="formview-content" ref={targetRef}>
        <div className="form-header">
          <h2>{form.title || 'İsimsiz Form'}</h2>
          <span className="form-date">
            Oluşturulma: {
              form.createdAt?.toDate ? 
                form.createdAt.toDate().toLocaleString('tr-TR') :
              form.createdAt?.seconds ? 
                new Date(form.createdAt.seconds * 1000).toLocaleString('tr-TR') :
              typeof form.createdAt === 'string' ?
                new Date(form.createdAt).toLocaleString('tr-TR') :
                'Tarih belirtilmemiş'
            }
          </span>
        </div>

        <div className="form-fields">
          {form.fields.map((field, index) => (
            <div key={index} className="field-item">
              {field.type === 'note' && (
                <div className="note-field">
                  <h3>{field.title}</h3>
                  <p>{field.content}</p>
                </div>
              )}

              {field.type === 'subheading' && (
                <div className="subheading-field">
                  <h3>{field.title}</h3>
                  {field.answerType === 'text' && (
                    <input type="text" placeholder="Metin cevabı" disabled />
                  )}
                  {field.answerType === 'multiple-choice' && (
                    <div className="options">
                      {field.options.map((option, optIndex) => (
                        <div key={optIndex} className="option">
                          <input type="radio" name={`field-${index}`} disabled />
                          <label>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  {field.answerType === 'checkbox' && (
                    <div className="options">
                      {field.options.map((option, optIndex) => (
                        <div key={optIndex} className="option">
                          <input type="checkbox" disabled />
                          <label>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  {field.answerType === 'file-upload' && (
                    <input type="file" disabled />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <div className="pdf-download-container">
          <button onClick={handleDownloadPDF} className="download-pdf-button">
            PDF Olarak İndir
          </button>
        </div>

        <div className="share-link-container">
          <button onClick={handleCopyLink} className="share-link-button">
            {showCopiedMessage ? 'Link Kopyalandı!' : 'Paylaşım Linki Kopyala'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormView;