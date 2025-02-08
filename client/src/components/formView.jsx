import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/formView.css';
import amblem from '../assets/amblem.png';

const FormView = ({ formTitle, fields }) => {
  const formRef = useRef();
  const [uploadedImages, setUploadedImages] = useState({});
  const [formData, setFormData] = useState({});
  const [shareableLink, setShareableLink] = useState('');
  const [isSharedView, setIsSharedView] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false); // Checkbox için state

  useEffect(() => {
    // URL'deki formId parametresini kontrol et
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.has('formId')) {
      setIsSharedView(true);
    }
  }, []);

  const handleDownloadPDF = () => {
    const input = formRef.current;

    html2canvas(input, {
      scale: 2,
      ignoreElements: (el) =>
        el.classList.contains('form-footer') || el.classList.contains('shareable-link'),
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // PDF genişliği (mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('form-bilgileri.pdf');
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
    // Formu paylaşıldığında, benzersiz bir ID oluşturuyoruz
    const generatedLink = `${window.location.origin}${window.location.pathname}?formId=${Date.now()}`;
    setShareableLink(generatedLink);
  };

  return (
    <div ref={formRef} className="form-view-container">
      <div className="form-header">
        <img src={amblem} alt="Balıkesir Üniversitesi Amblemi" className="logo" />
        <h1>T.C. BALIKESİR ÜNİVERSİTESİ</h1>
      </div>

      <h2 className="form-title">{formTitle}</h2>

      <div className="form-content">
        {fields.map((field, index) => (
          <div key={index} className="form-row">
            {field.type === 'subheading' && (
              <div className="form-label">
                <strong>{field.title}</strong>
              </div>
            )}

            <div className="form-answer">

              {field.type === 'note' && (
                <div className="form-row">
                  <textarea
                    id={`note-${index}`}
                    name={`note-${index}`}
                    value={field.content}
                    onChange={(e) => handleInputChange(`note-${index}`, e.target.value)}
                    disabled={true}
                  />
                </div>
              )}

              {field.answerType === 'text' && (
                <input
                  type="text"
                  placeholder="Cevabınızı yazın..."
                  value={formData[index] || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  disabled={isSharedView}
                />
              )}

              {field.answerType === 'multiple-choice' && (
                <select
                  value={formData[index] || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  disabled={isSharedView}
                >
                  <option value="">Seçiniz</option>
                  {field.options.map((option, optIndex) => (
                    <option key={optIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {field.answerType === 'checkbox' && (
                <ul className="checkbox-list">
                  {field.options.map((option, optIndex) => (
                    <li key={optIndex}>
                      <input
                        type="checkbox"
                        id={`check-${optIndex}`}
                        checked={formData[index]?.includes(option)}
                        onChange={(e) => {
                          const updatedAnswers = e.target.checked
                            ? [...(formData[index] || []), option]
                            : formData[index].filter((opt) => opt !== option);
                          handleInputChange(index, updatedAnswers);
                        }}
                        disabled={isSharedView}
                      />
                      <label htmlFor={`check-${optIndex}`}>{option}</label>
                    </li>
                  ))}
                </ul>
              )}

              {field.answerType === 'file-upload' && (
                <div className="file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(index, e.target.files[0])}
                    disabled={isSharedView}
                  />
                  {uploadedImages[index] && (
                    <img
                      src={uploadedImages[index]}
                      alt="Yüklenen Görsel"
                      style={{ width: '100px', height: '100px', marginTop: '10px' }}
                    />
                  )}
                </div>
              )}

              {field.answerType === 'link' && (
                <input
                  type="url"
                  placeholder="Bağlantı linki giriniz..."
                  value={formData[index] || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  disabled={isSharedView}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {!isSharedView && (
        <>
          <div className="accept-checkbox-container">
            <div className="accept-checkbox">
              <input
                type="checkbox"
                id="accept-checkbox"
                checked={isAccepted}
                onChange={(e) => setIsAccepted(e.target.checked)}
              />
              <label htmlFor="accept-checkbox">Bilgilerimin doğruluğunu kabul ediyorum.</label>
            </div>
          </div>
          <div className="form-footer">
            <button onClick={handleDownloadPDF} className="download-button">
              Formu İndir
            </button>
            <button className="save-button">Kaydet</button>
            <button onClick={handleShareableLink} className="share-button">
              Paylaşım Linki Oluştur
            </button>
            {shareableLink && (
              <div className="shareable-link">
                <p>Paylaşım Linki:</p>
                <a href={shareableLink} target="_blank" rel="noopener noreferrer">
                  {shareableLink}
                </a>
              </div>
            )}
          </div>
        </>
      )}

      {isSharedView && <button className="save-button">Kaydet</button>}
    </div>
  );
};

export default FormView;
