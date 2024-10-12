import React from 'react'
import styled from 'styled-components';

function MessageBox() {
  return (
    <Container>
      <Input />
      <Button>Send</Button>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-self: flex-end;
`;
const Input = styled.input`
  width: 85%;
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
