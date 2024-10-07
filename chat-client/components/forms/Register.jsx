import { styled } from 'styled-components';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

function Register({ changeForm }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChage = (name, value) => {
    setFormData({...formData, [name]: value});
  }
  const validateForm = () =>{
    
  };
  const submitForm = () =>{
    console.log(formData);
    validateForm();
  }
  return (
    <Container>
      <Title>
        <Logo />
        <FormTitle>Register</FormTitle>
      </Title>
      <Input 
        placeholder='username' 
        name='username' 
        onChange={(e)=> handleChage(e.target.name, e.target.value) }/>
      <Input 
        placeholder='email' 
        name='email' 
        onChange={(e)=> handleChage(e.target.name, e.target.value) }/>
      <Input 
        type='password' 
        placeholder='password' 
        name='password' 
        onChange={(e)=> handleChage(e.target.name, e.target.value) }/>
      <Input 
      type='password' 
      placeholder='confirm password' 
      name='confirmPassword' 
      onChange={(e)=> handleChage(e.target.name, e.target.value) }/>
      <SubmitButton onClick={submitForm}>Sign Up</SubmitButton>
      <Span>
        Already registerd?
        <Span style={{color: 'green', cursor: 'pointer', paddingLeft: '.5rem'}} onClick={()=>changeForm()}>
          Sign In
        </Span>
      </Span>
    </Container>
  )
}

const Container = styled.div`
  border: 1px solid #cfcfcf;
  border-radius: 5px;
  padding: 1rem 2rem;
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
  gap: 10px;
`
const Logo = styled.div`
  background-image: url('/tvlogo.png');
  background-size: cover;
  background-position: center center;
  width: 50px;
  height: 50px;
`
const FormTitle = styled.h3`
  color: green;
`
const Input = styled.input`
  padding: 0.5rem 1rem;
  margin: 1rem;
  placeholder-text: ${({ placeholder }) => placeholder};
  border: none;
  border-radius: 3px;
  width: 80%;
  outline: none;
`;

const SubmitButton = styled.button`
  background: green;
  color: white;
  margin: 1rem;
  padding: .5rem 1rem;
  width: 40%;
  border-radius: 5px;
  cursor: pointer;
  border: none;
`
const Span = styled.span`
  font-size: .7rem;
  color: brown;
`
export default Register;