import React from 'react'
import styled from 'styled-components'

function ChatBubble({ children, ismine}) {
  return (
    <Bubble ismine={ismine}> {children} </Bubble>
  )
}

const Bubble = styled.div`
  display: flex;
  margin: .5rem 0;
  flex-direction: column;
  align-items: center;
  background: ${({ismine})=> ismine ? 'orange' : 'skyblue'};
  mai-width: 200px;
  max-width: 400px;
  flex-wrap: wrap;
  align-self: ${({ismine})=> ismine ? 'end' : 'start'};
  padding: 1rem;
  border-radius: ${({ismine})=> ismine ? '10px 10px 0 10px' : '10px 10px 10px 0'};
  box-shadow: 2px 10px 5px rgba(0, 0, 0, 0.2);
  height: auto;
  `;

export default ChatBubble;