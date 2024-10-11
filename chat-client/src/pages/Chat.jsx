import { useState, useContext, useEffect } from 'react'
import { userContext } from '../state/UserContext';
import styled from 'styled-components';
import instance from '../utils/axinstance';
import { useNavigate } from 'react-router-dom';

function Chat() {
  const ctx = useContext(userContext);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const logoutHandler = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  }
  const fetchUser = async () => {
    if(!ctx.user){
      try{
        const response = await instance.get('/account/getprofile');
        if(response.status == 200){
          ctx.setUser(response.data.user[0]);
          console.log(response.data.user[0]);
        }
      } catch(err) {
        console.log(err.response)
      }
    }
  }
  useEffect(()=>{
    fetchUser();
  },[]);

  if (ctx.user){
    return (
      <Container>
        <LeftPanel>
          <Avatar src={ctx.user.profilePic} alt='profile pic'/>
          <Name>{ctx.user.firstName} {ctx.user.lastName} {ctx.user.flag}</Name>
          <ContactsListContainer>
            {
              ctx.user.contacts.map(contact => (
                <ContactItem onClick={()=> setSelectedUser(contact)}>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                  <ContactAvatar src={contact.profilePic} alt={contact.firstName} />
                  <ContactName>{contact.firstName} {contact.lastName}</ContactName>
                  </div>
                </ContactItem>
              ))
            }
          </ContactsListContainer>
        </LeftPanel>
        <RightPanel>
          <Header>
            <h5>user</h5>
            <h5>settings</h5>
            <button onClick={logoutHandler}>logout</button>
          </Header>
          {
            selectedUser ? (
              <h3>
                {selectedUser.firstName}
              </h3>
            ) : (
              <h3 style={{width: '100%', height: '100%', background:'red'}}>Select contact to chat </h3>
            )
          }
        </RightPanel>
      </Container>
    )
  } else {
    return (
      <Container>
        loading
      </Container>
    )
  }
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

const LeftPanel = styled.div`
  width: 30%;
  border-right: 1px solid #cfcfcf;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  box-shadow: 0 0 8px 0 #cfcfcf;
`;

const RightPanel = styled.div`
  width: 70%;
  padding: 0rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`
const Header = styled.div`
  width: 100%;
  padding: 1rem;
  border-bottom: 1px solid #cfcfcf;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 20px 0 #cfcfcf;
  margin-bottom: 1rem;
`;

const Avatar = styled.img`
  height: 48px;
  width: 48px;
  border-radius: 50%;
  margin-top: 3rem;
`
const Name = styled.h3`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 200;
  margin-bottom: 2rem;
`;

const ContactsListContainer = styled.div`
  width: 100%;
  height: 100%;
  border-top: 1px solid #cfcfcf;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem;
  margin: .5rem 0;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin: .5rem 0;
  box-shadow: 0 0 20px 0 #cfcfcf;
`;

const ContactAvatar = styled.img`
  height: 42px;
  width: 42px;
  border-radius: 50%;
  margin-right: .5rem;
`;

const ContactName = styled.h3`
  text-align: center;
  font-size: 1rem;
  font-weight: 200;
`;

export default Chat;