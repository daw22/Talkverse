import { useState, useContext, useEffect } from 'react'
import { userContext } from '../state/UserContext';
import styled from 'styled-components';
import instance from '../utils/axinstance';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import ChatBubble from '../components/ChatBubble';
import { socket } from '../utils/socket';

function Chat() {
  const ctx = useContext(userContext);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const sendMessage = (message) => {
    if (!message || message === '') return;
    if(!ctx.user) return;
    const data = {
      sender: ctx.user._id,
      reciver: selectedUser._id,
      senderLang: ctx.user.preferedLang,
      reciverLang: selectedUser.preferedLang,
      message: message,
    };
    socket.emit('send_message', data);
    setMessages(prev=> [...prev, data]);
  }
  const onMessageRecived = async (data) => {
    setMessages(prev=> [...prev, data.message]);
    console.log('recived message:', data.message);
    console.log(ctx.user._id);
    const inContact = ctx.user.contacts.find(contact=> contact._id === data.message.sender);
    if(!inContact) {
      const res = await instance.post('/chat/addcontact', 
        {id: ctx.user._id, contactId: data.message.sender}
      );
    }
  }
  const contactSelectHandler = async (contact) => {
    setSelectedUser(contact);
    const res = await instance.get(`/chat/getmessages?fromId=${contact._id}`);
    if (res.status === 200){
      setMessages(res.data);
    }
  }
  const logoutHandler = () => {
    localStorage.removeItem('accessToken');
    socket.emit('unregister', {id: ctx.user._id});
    socket.close();
    navigate('/');
  }
  const fetchUser = async () => {
    if(!ctx.user){
      try{
        const response = await instance.get('/account/getprofile');
        if(response.status == 200){
          ctx.setUser(response.data.user[0]);
          socket.connect();
          socket.emit('register',{id: response.data.user[0]._id});
        }
      } catch(err) {
        console.log(err.response)
      }
    }
  }

  useEffect(()=>{
    fetchUser();
    socket.on('recive', onMessageRecived);

    return()=> {
      socket.off('recive', onMessageRecived);
    }
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
                <ContactItem key={contact._id} onClick={()=> contactSelectHandler(contact)}>
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
            {
              selectedUser ? (
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <ContactAvatar src={selectedUser.profilePic}/>
                  <ContactName>{selectedUser.firstName} {selectedUser.lastName}</ContactName>
                </div>
              ): (
                <h5 style={{padding: '.5rem'}}>Talkverse</h5>
              )
            }
            <button onClick={logoutHandler}>LogOut</button>
          </Header>
          <ChatArea>
            {
              selectedUser ? (
                <>
                { messages.length == 0 ? (
                  <h5>No messages yet</h5>
                 ) : (
                  messages.map(message => (
                    <ChatBubble key={message._id} isMine={message.sender === ctx.user._id}>
                      {message.message}
                      {message.translatedMsg && (
                        <div style={{border: '1px solid #cfcfcf', padding: '1rem', borderRadius: '5px'}}>
                          {message.translatedMsg}
                        </div>
                      ) }
                    </ChatBubble>
                  ))
                 )
                }
                <MessageBox sendMessage={sendMessage}/>
                </>
              ) : (
                <h3 style={{margin: 'auto 0', textAlign: 'center'}}>Select contact to chat </h3>
              )
            }
          </ChatArea>
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
`;

const ChatArea = styled.div`
  width: 100%;
  height: 100%;
  padding: .5rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
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