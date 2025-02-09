import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/formView.css';
import amblem from '../assets/amblem.png';

const FormView = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const formDoc = await getDoc(doc(db, 'formlar', formId));
        if (formDoc.exists()) {
          setForm({
            id: formDoc.id,
            ...formDoc.data()
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
  }, [formId]);

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
        <button onClick={() => navigate('/adminpanel')} className="back-button">
          Geri Dön
        </button>
      </nav>

      <div className="formview-content">
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
    </div>
  );
};

export default FormView;
