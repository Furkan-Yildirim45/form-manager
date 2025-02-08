import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import '../styles/form.css';

const Form = ({ setFormData }) => {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [formTitle, setFormTitle] = useState('');

  const handleAddField = (type) => {
    if (type === 'note') {
      setFields([...fields, { type: 'note', title: 'Not:', content: '' }]);
    } else if (type === 'subheading') {
      setFields([ 
        ...fields, 
        {
          type: 'subheading',
          title: '',
          answerType: 'text',
          options: [],
        } 
      ]);
    }
  };

  const handleFieldChange = (index, fieldName, value) => {
    const updatedFields = [...fields];
    updatedFields[index][fieldName] = value;
    setFields(updatedFields);
  };

  const handleAddOption = (index) => {
    const updatedFields = [...fields];
    updatedFields[index].options.push('');
    setFields(updatedFields);
  };

  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setFields(updatedFields);
  };

  const handleSubmit = () => {
    setFormData({
      formTitle: formTitle,
      fields: fields,
    });
    // Pass data to form-view page via URL params
    navigate('/form-view', { state: { formTitle, fields } });
  };

  return (
    <div className="form-container">
      <Header />
      <div className="form-header">
        <label>Form Başlığı</label>
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          placeholder="Form başlığını girin"
        />
      </div>

      {fields.length === 0 ? (
        <div className="empty-form-state">
          <p>Formunuzu oluşturmak için başlık ekleyin veya bir öğe ekleyin.</p>
        </div>
      ) : (
        fields.map((field, index) => (
          <div key={index} className="field-container">
            {field.type === 'note' && (
              <div className="note-field">
                <label>{field.title}</label>
                <textarea
                  value={field.content}
                  onChange={(e) => handleFieldChange(index, 'content', e.target.value)}
                  placeholder="Notunuzu yazın..."
                />
              </div>
            )}
            {field.type === 'subheading' && (
              <div className="subheading-field">
                <div className="field-row">
                  <div className="field-item">
                    <label>Yan Başlık:</label>
                    <input
                      type="text"
                      value={field.title}
                      onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                      placeholder="Başlığı girin"
                    />
                  </div>

                  <div className="field-item">
                    <label>Cevap Türü:</label>
                    <select
                      value={field.answerType}
                      onChange={(e) => handleFieldChange(index, 'answerType', e.target.value)}
                    >
                      <option value="text">Yazılı Cevap</option>
                      <option value="multiple-choice">Seçmeli Cevap</option>
                      <option value="checkbox">İşaretlemeli Cevap</option>
                      <option value="file-upload">Dosya Yükleme</option>
                    </select>
                  </div>
                </div>

                {(field.answerType === 'multiple-choice' || field.answerType === 'checkbox') && (
                  <div className="dropdown-container">
                    <label>Seçenekler:</label>
                    {field.options.map((option, optIndex) => (
                      <div key={optIndex} className="option-input">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                          placeholder="Seçenek girin"
                        />
                      </div>
                    ))}
                    <button onClick={() => handleAddOption(index)}>+ Seçenek Ekle</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}

      <div className="button-container">
        <button onClick={() => handleAddField('note')}>Not Ekle</button>
        <button onClick={() => handleAddField('subheading')}>Yan Başlık Ekle</button>
      </div>

      <div className="submit-container">
        <button className="submit-button" onClick={handleSubmit}>Formu Oluştur</button>
      </div>
    </div>
  );
};

export default Form;
