import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import country from '../assets/countries.json';
import { userContext } from "../state/UserContext";

const CountrySelect = ({ formData, setFormData, defaultCountry }) => {
  const ctx = useContext(userContext);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});

  useEffect(()=>{
    setCountries(country.countries);
    if (ctx.user){
      setSelectedCountry({value: "xx", label: defaultCountry || ctx.user.flag + " " +ctx.user.country});
    } else {
      setSelectedCountry(country.countries[0]);
    }
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

export default function App({ formData, setFormData, defaultCountry }) {
  return (
    <div style={{width: '45%'}} >
      <CountrySelect formData={formData} setFormData={setFormData} defaultCountry={defaultCountry}/>
    </div>
  );
}
