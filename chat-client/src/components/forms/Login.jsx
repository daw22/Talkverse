import { styled } from "styled-components";
import { useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import { userContext } from "../../state/UserContext";
import instance from '../../utils/axinstance';
import { useNavigate } from 'react-router-dom';
import { socket } from "../../utils/socket";

function Login({ changeForm }) {
  const user = useContext(userContext);
  const navigate = useNavigate();
  const [usrEmail, setUsrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const validateForm = (data) => {
    if (data.email) {
      const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const valid = emailRegx.test(data.email);
      if (!valid) {
        toast.error("invalid email format", {
          position: "bottom-right",
          draggable: true,
          autoClose: 6000,
          pauseOnHover: true,
        });
        return false;
      }
    }
    if (data.username) {
      if (data.username.length < 3) {
        toast.error("username should at least have 3 characters!", {
          position: "bottom-right",
          draggable: true,
          autoClose: 6000,
          pauseOnHover: true,
        });
        return false;
      }
    }
    if (!user.email && !user.username) {
      if (data.username.length < 3) {
        toast.error("username or email needed", {
          position: "bottom-right",
          draggable: true,
          autoClose: 6000,
          pauseOnHover: true,
        });
        return false;
      }
    }
    if (data.password || password === "") {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]{6,}$/;
      const validPwd = passwordRegex.test(data.password);
      if (!validPwd) {
        toast.error(
          "password should be at least 6 characters long and must contain capital letter and symbol",
          {
            position: "bottom-right",
            draggable: true,
            autoClose: 6000,
            pauseOnHover: true,
          },
        );
        return false;
      }
    }
    return true;
  };
  const submitForm = async () => {
    const type = usrEmail.includes("@") ? "email" : "username";
    const data = { [type]: usrEmail, password };
    const validated = validateForm(data);
    if (validated) {
      setLoading(true);
      try {
        const response = await instance.post('/account/login', data);
        if (response.status == 200){
          setLoading(false);
          if(!response.data.user) {
            navigate('/setup', {state: response.data.accId});
            return;
          }
          user.setUser(response.data.user[0]);
          console.log(response.data.onlineContacts);
          user.setOnlineContacts(response.data.onlineContacts);
          localStorage.setItem('accessToken', response.data.token);
          socket.connect();
          socket.emit('register', {id: response.data.user[0]._id});
          navigate('/chat');
        }
      } catch(err) {
        console.log('errrrrr', err)
        setLoading(false);
        toast.error('Login failed. Wrong username/email or password', {
          position: "bottom-right",
          draggable: true,
          autoClose: 6000,
          pauseOnHover: true,
        });
      }
    }
  };
  return (
    <Container>
      <Title>
        <Logo />
        <FormTitle>Log In</FormTitle>
      </Title>
      <Input
        placeholder="username or email"
        onChange={(e) => setUsrEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <SubmitButton onClick={submitForm} disabled={loading}>
        { loading ? "Signing In ..." : "Sign In" }
      </SubmitButton>
      <Span>
        Not registerd yet?
        <Span
          style={{ color: "green", cursor: "pointer", paddingLeft: ".3rem" }}
          onClick={() => changeForm()}
        >
          Register
        </Span>
      </Span>
      <ToastContainer />
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid #cfcfcf;
  border-radius: 5px;
  padding: 1rem 2rem;
  width: 30%;
  @media(max-width: 768px){width: 60%};
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
  gap: 10px;
`;
const Logo = styled.div`
  background-image: url("/tvlogo.png");
  background-size: cover;
  background-position: center center;
  width: 50px;
  height: 50px;
`;
const FormTitle = styled.h3`
  color: green;
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
const Span = styled.span`
  font-size: 0.7rem;
  color: brown;
`;
export default Login;
