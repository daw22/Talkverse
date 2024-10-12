import React from 'react'
import styled from 'styled-components'

function ChatBubble({ children, isMine}) {
  return (
    <Bubble isMine={isMine}> {children} </Bubble>
  )
}

const Bubble = styled.div`
  display: flex;
  margin: .5rem 0;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  background: ${({isMine})=> isMine ? 'orange' : 'skyblue'};
  max-width: 300px;
  align-self: ${({isMine})=> isMine ? 'end' : 'start'};
  padding: 1rem;
  border-radius: ${({isMine})=> isMine ? '10px 10px 0 10px' : '10px 10px 10px 0'};
  box-shadow: 2px 10px 5px rgba(0, 0, 0, 0.2);
`;

export default ChatBubble;