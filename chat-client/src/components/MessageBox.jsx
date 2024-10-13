import { useState } from 'react'
import styled from 'styled-components';

function MessageBox({ sendMessage }) {
  const [message, setMessage] = useState('');
  return (
    <Container>
      <Input onChange={(e)=> setMessage(e.target.value)} value={message}/>
      <Button onClick={()=> sendMessage(message, setMessage)}>Send</Button>
    </Container>
  )
}

const Container = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  left: 0;
  right: 0;
  bottom: 0;
`;
const Input = styled.textarea`
  width: 85%;
  height: 3rem;
  resize: none;
  border-radius: 5px;
  outline: none;
  border: none;
  padding: 1rem;
  background: #dfdfdf;
  opacity: .6;
  &:focus {
    background: #fff;
    opacity: 1;
  }
`
const Button = styled.button`
  color: white;
  background: #8333d4;
  border-radius: 10px;
  width: 13%;
  padding: 1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  &:hover {
    background: #cfcfcf;
  }
`
export default MessageBox;
