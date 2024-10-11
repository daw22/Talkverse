import React, { useEffect, useState } from "react";
import Select from "react-select";
import country from '../assets/countries.json';

const CountrySelect = ({ formData, setFormData }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});

  useEffect(()=>{
    setCountries(country.countries);
    setSelectedCountry(country.countries[0]);
  }, []);

  return (
    <Select
      options={countries}
      value={selectedCountry}
      onChange={(selectedOption) => {
        setSelectedCountry(selectedOption);
        setFormData({...formData, country: selectedOption.label});
      }}
    />
  );
};

export default function App({ formData, setFormData }) {
  return (
    <div style={{width: '40%'}} >
      <CountrySelect formData={formData} setFormData={setFormData}/>
    </div>
  );
}