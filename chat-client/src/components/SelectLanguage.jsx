import React, { useEffect, useState } from "react";
import Select from "react-select";
import languagesList from '../assets/languages.json';

const LanguageSelect = ({ formData, setFormData }) => {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(()=>{
    setLanguages(languagesList.languages);
    setSelectedLanguage(languagesList.languages[32]);
  }, []);

  return (
    <Select
      options={languages}
      value={selectedLanguage}
      onChange={(selectedOption) => {
        setSelectedLanguage(selectedOption);
        setFormData({...formData, language: selectedOption.label});
      }}
    />
  );
};

export default function App({ formData, setFormData }) {
  return (
    <div style={{width: '45%'}}>
      <LanguageSelect formData={formData} setFormData={setFormData}/>
    </div>
  );
}