import { useState, useContext } from 'react'
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { userContext } from '../state/UserContext';
import instance from '../utils/axinstance';
import { CountrySelect, LanguageSelect } from 'react-country-state-city';
import "react-country-state-city/dist/react-country-state-city.css";
import { toast, ToastContainer } from 'react-toastify';

function AccountSetup() {
  const location = useLocation();
  const id = location.state;
  const ctx = useContext(userContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    language: "en",
    bio: "",
  });
  const handleChage = (name, value) => {
    setFormData({...formData, [name]: value});
  };
  const submitForm = async () => {
    setLoading(true);
    console.log(formData);
    try {
      const response = await instance.post('/account/createprofile', {...formData, id});
      if(response.status == 201) {
        console.log(response.data);
        ctx.setUser(response.data.user);
        localStorage.setItem('accessToken', response.data.token);
        setLoading(false);
        navigate('/chat');
      }
    } catch(err){
      console.log(err.response.data.error);
      setLoading(false);
      toast.error(err.response.data.error, {
        position: 'bottom-right',
          draggable: true,
          autoClose: 6000,
          pauseOnHover: true,
      })
    }
  };
  return (
    <Container>
      <FormContainer>
      <Title>Account Setup</Title>
      <Input placeholder='FirstName' name='firstName' onChange={(e) => handleChage(e.target.name, e.target.value)}/>
      <Input placeholder='LastName' name='lastName' onChange={(e) => handleChage(e.target.name, e.target.value)}/>
      <div style={{display: 'flex', justifyContent: 'space-between', width: '80%'}}>
        <CountrySelect placeHolder='Select your country' onChange={(e) => handleChage('country', e.name)}/>
        <LanguageSelect placeHolder='Prefered Language' onChange={(e) => handleChage('language', e.name)}/>
      </div>
      <Bio placeholder='About your self' name='bio' onChange={(e) => handleChage(e.target.name, e.target.value)}/>
      <SubmitButton onClick={submitForm} disabled={loading}>
        {loading ? "Loading..." : "Submit" }
      </SubmitButton>
      </FormContainer>
      <ToastContainer />
    </Container>
  )
}

const Container = styled.div`
  background-image: url("/background.avif");
  background-size: cover;
  backrgound-repeate: no-repeate;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const FormContainer = styled.div`
  width: 50%;
  border: 1px solid #cfcfcf;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Title = styled.h3`
  color: green;
  text-align: center;
  font-size: 1.5rem;
`;

const Input = styled.input`
  padding: 0.5rem 1rem;
  margin: 1rem;
  placeholder-text: ${({ placeholder }) => placeholder};
  border: none;
  border-radius: 3px;
  width: 80%;
  outline: none;
`;

const Bio = styled.textarea`
  padding: 0.5rem 1rem;
  placeholde-text: ${({placeholder}) => placeholder};
  width: 80%;
  border-radius: 5px;
  outline: none;
  border: none;
  margin-top: 1rem;
`

const SubmitButton = styled.button`
  background: green;
  color: white;
  margin: 1rem;
  padding: 0.5rem 1rem;
  width: 40%;
  border-radius: 5px;
  cursor: pointer;
  border: none;
`;

export default AccountSetup;
