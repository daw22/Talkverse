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
    const {username, email, password, confirmPassword} = formData;
    if (username.length < 3) {
      toast.error('username should at least have 3 characters!', {
          position: 'bottom-right',
          draggable: true,
          autoClose: 6000,
          pauseOnHover: true,
        });
        return false;
    }
    const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailRegx.test(email);
    if(!validEmail) {
      toast.error('invalid email format', {
        position: 'bottom-right',
        draggable: true,
        autoClose: 6000,
        pauseOnHover: true,
      });
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]{6,}$/;
    const validPwd = passwordRegex.test(password);
    if (!validPwd){
      toast.error(`password should be at least 6 characters long and must
        contain capital letter and symbol`, {
        position: 'bottom-right',
        draggable: true,
        autoClose: 6000,
        pauseOnHover: true,
      });
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('password dosn\'t match ', {
        position: 'bottom-right',
        draggable: true,
        autoClose: 6000,
        pauseOnHover: true,
      });
      return false;
    }
    return true;
};
  const submitForm = () =>{
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
      <ToastContainer />
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