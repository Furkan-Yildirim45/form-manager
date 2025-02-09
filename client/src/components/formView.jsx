import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/formView.css';
import amblem from '../assets/amblem.png';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../firebase';
import Header from './header';

const FormView = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const formRef = useRef();
  const [uploadedImages, setUploadedImages] = useState({});
  const [formData, setFormData] = useState({});
  const [shareableLink, setShareableLink] = useState('');
  const [isSharedView, setIsSharedView] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  // Firebase'den form verilerini çek
  useEffect(() => {
    const getFormData = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get(`http://localhost:5000/api/forms/${formId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setForm(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Form getirme hatası:", error);
        setLoading(false);
      }
    };

    if (formId) {
      getFormData();
    }
  }, [formId]);

  const handleDownloadPDF = () => {
    const input = formRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('form.pdf');
    });
  };

  const handleFileUpload = (index, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImages((prev) => ({ ...prev, [index]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (index, value) => {
    setFormData((prev) => ({ ...prev, [index]: value }));
  };

  const handleShareableLink = () => {
    const generatedLink = `${window.location.origin}/form-view/${formId}?shared=true`;
    setShareableLink(generatedLink);
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!form) {
    return <div>Form bulunamadı</div>;
  }

  return (
    <div className="form-container">
      <Header />
      <div className="form-view" ref={formRef}>
        <div className="form-header">
          <img src={amblem} alt="Amblem" className="amblem" />
          <h2>T.C.</h2>
          <h2>BANDIRMA ONYEDİ EYLÜL ÜNİVERSİTESİ</h2>
          <h2>{form.title}</h2>
        </div>

        <div className="form-content">
          {form.fields.map((field, index) => (
            <div key={index} className="form-field">
              {field.type === 'note' && (
                <div className="note-section">
                  <h3>{field.title}</h3>
                  <p>{field.content}</p>
                </div>
              )}

              {field.type === 'subheading' && (
                <div className="input-section">
                  <label>{field.title}</label>
                  {field.answerType === 'text' && (
                    <input
                      type="text"
                      value={formData[index] || ''}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                  )}
                  {field.answerType === 'multiple-choice' && (
                    <div className="radio-group">
                      {field.options.map((option, optIndex) => (
                        <div key={optIndex} className="radio-option">
                          <input
                            type="radio"
                            name={`field-${index}`}
                            value={option}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            checked={formData[index] === option}
                          />
                          <label>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  {field.answerType === 'file-upload' && (
                    <div className="file-upload">
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(index, e.target.files[0])}
                      />
                      {uploadedImages[index] && (
                        <img src={uploadedImages[index]} alt="Yüklenen Dosya" />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="form-footer">
          <div className="acceptance-section">
            <input
              type="checkbox"
              checked={isAccepted}
              onChange={(e) => setIsAccepted(e.target.checked)}
            />
            <label>Yukarıdaki bilgilerin doğruluğunu onaylıyorum.</label>
          </div>

          <div className="signature-section">
            <div className="signature-box">
              <p>Ad Soyad:</p>
              <p>İmza:</p>
              <p>Tarih:</p>
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button onClick={handleDownloadPDF} disabled={!isAccepted}>
          PDF İndir
        </button>
        <button onClick={handleShareableLink}>Paylaşım Linki Oluştur</button>
        {shareableLink && (
          <div className="shareable-link">
            <p>Paylaşım Linki:</p>
            <input type="text" value={shareableLink} readOnly />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormView;
