import { useState } from "react";
import { styled } from "styled-components";
import Login from "../components/forms/Login";
import Register from "../components/forms/Register";

function Account() {
  const [form, setForm] = useState("login");
  const swapForm = () => setForm(form === "login" ? "register" : "login");
  return (
    <Container>
      <CoverImage />
      {form === "login" && <Login changeForm={swapForm} />}
      {form == "register" && <Register changeForm={swapForm} />}
    </Container>
  );
}

const Container = styled.div`
  background-image: url("/background.avif");
  background-size: cover;
  backrgound-repeate: no-repeate;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
`;

const CoverImage = styled.div`
  background-image: url("/cover.png");
  background-size: cover;
  background-position: center;
  height: 80%;
  width: 40%;
`;
export default Account;
