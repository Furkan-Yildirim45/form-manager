import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import '../styles/form.css';
import axios from "axios";
import { auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

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
    if (!updatedFields[index].options) {
      updatedFields[index].options = [];
    }
    updatedFields[index].options.push('');
    setFields(updatedFields);
  };

  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formToSubmit = {
        title: formTitle,
        fields: fields.map(field => ({
          ...field,
          ...(field.options?.length === 0 && { options: undefined })
        })),
        createdAt: new Date()
      };

      // Global form state'i güncelle
      setFormData(formToSubmit);

      const token = await auth.currentUser.getIdToken();
      console.log('Token alındı:', token);

      const docRef = await addDoc(collection(db, 'formlar'), formToSubmit);

      console.log("Sunucu yanıtı:", docRef);

      // Form-view sayfasına yönlendir
      if (docRef.id) {
        navigate(`/form-view/${docRef.id}`);
      } else {
        console.error("Form ID alınamadı");
      }
    } catch (error) {
      console.error("Form gönderme hatası:", error);
      if (error.response) {
        console.error('Sunucu yanıtı:', error.response.data);
      }
    }
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

      {fields.map((field, index) => (
        <div key={index} className="field-container">
          {field.type === 'note' && (
            <div className="note-field">
              <input
                type="text"
                value={field.title}
                onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                placeholder="Not başlığı"
              />
              <textarea
                value={field.content}
                onChange={(e) => handleFieldChange(index, 'content', e.target.value)}
                placeholder="Not içeriği"
              />
            </div>
          )}

          {field.type === 'subheading' && (
            <div className="subheading-field">
              <input
                type="text"
                value={field.title}
                onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                placeholder="Yan başlık"
              />
              <select
                value={field.answerType}
                onChange={(e) => handleFieldChange(index, 'answerType', e.target.value)}
              >
                <option value="text">Metin</option>
                <option value="multiple-choice">Çoktan Seçmeli</option>
                <option value="checkbox">Onay Kutusu</option>
                <option value="file-upload">Dosya Yükleme</option>
              </select>

              {(field.answerType === 'multiple-choice' || field.answerType === 'checkbox') && (
                <div className="options-container">
                  {field.options.map((option, optIndex) => (
                    <input
                      key={optIndex}
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                      placeholder="Seçenek"
                    />
                  ))}
                  <button type="button" onClick={() => handleAddOption(index)}>
                    + Seçenek Ekle
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="button-container">
        <button type="button" onClick={() => handleAddField('note')}>
          Not Ekle
        </button>
        <button type="button" onClick={() => handleAddField('subheading')}>
          Yan Başlık Ekle
        </button>
      </div>

      <div className="submit-container">
        <button type="submit" onClick={handleSubmit}>
          Formu Oluştur
        </button>
      </div>
    </div>
  );
};

export default Form;
