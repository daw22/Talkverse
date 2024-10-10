import { useContext, useEffect } from 'react'
import { userContext } from '../state/UserContext';
import styled from 'styled-components';

function Chat() {
  const ctx = useContext(userContext);
  const saveState = ()=> {
    localStorage.setItem('userData', JSON.stringify({...ctx.user}));
  }
  useEffect(()=>{
    window.addEventListener('beforeunload', saveState);
    return ()=> {
      window.removeEventListener('beforeunload', saveState);
    }
  },[]);

  return (
    <Container>
      {ctx.user &&
        <>
        <div>hello {ctx.user.firstName}</div>
        <div>you are from {ctx.user.country}</div>
        </>
      }
      {!ctx.user && 
        <div> Loading </div>
      }
      
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

export default Chat;