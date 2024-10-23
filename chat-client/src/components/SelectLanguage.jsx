import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import languagesList from '../assets/languages.json';
import { userContext } from "../state/UserContext";

const LanguageSelect = ({ formData, setFormData }) => {
  const ctx = useContext(userContext);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(()=>{
    setLanguages(languagesList.languages);
    if (ctx.user){
      setSelectedLanguage({value: "xx", label: ctx.user.preferedLang});
    } else {
      setSelectedLanguage(languagesList.languages[32]);
    }
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
