import { useState, useContext, useEffect, useRef } from 'react'
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
  const autoScrollDiv = useRef(null);

  const sendMessage = (message, setMessage) => {
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
    setMessage('');
  }
  const onMessageRecived = async (data) => {
    setMessages(prev=> [...prev, data.message]);
    const inContact = ctx.user.contacts.find(contact=> contact._id === data.message.sender);
    console.log(inContact);
    if(!inContact) {
      const res = await instance.post('/chat/addcontact', 
        {id: ctx.user._id, contactId: data.message.sender}
      );
    }
  }
  const onContactLeaves = (data) => {
    const offlineId = data.userId;
    console.log(offlineId, "leaves");
    let onlineContacts = ctx.onlineContacts;
    if (onlineContacts) {
      onlineContacts = onlineContacts.filter((contact) => contact !== offlineId);
      ctx.setOnlineContacts(onlineContacts);
    }
  }
  const onContactJoins = (data) => {
    const joinedId = data.userId;
    console.log(joinedId, "joins");
    if(ctx.onlineContacts){
      ctx.setOnlineContacts((prev) => [...prev, joinedId]);
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
          ctx.setOnlineContacts(response.data.onlineContacts);
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
    socket.on('contact_leaves', onContactLeaves);
    socket.on('contact_joins', onContactJoins);
    return()=> {
      socket.off('recive', onMessageRecived);
      socket.off('contact_leaves', onContactLeaves);
      socket.off('contact_joins', onContactJoins);
    }
  },[]);

  useEffect(()=>{
    if(autoScrollDiv.current){
      autoScrollDiv.current.scrollIntoView();
    }
  },[messages]);

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
                  <StatusDot isonline={ctx.onlineContacts.includes(contact._id)}/>
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
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '30%'}}>
              <Icon src='/search.svg' />
              <Icon src='/settings.svg' />
              <Icon src='/logout.svg' className='icons' onClick={logoutHandler}/>
            </div>
          </Header>
          <ChatArea>
            {
              selectedUser ? (
                <>
                { messages.length == 0 ? (
                  <h5>No messages yet</h5>
                 ) : (
                  messages.map(message => (
                    <ChatBubble key={message._id} ismine={message.sender === ctx.user._id}>
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
            <div ref={autoScrollDiv}></div>
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
  cursor: pointer;
  &:hover {
  box-shadow: none;
  }
`;

const StatusDot = styled.div`
  width: .5rem;
  height: .5rem;
  border-radius: 50%;
  background: ${({isonline}) => isonline ? 'green' : 'red'}
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

const Icon = styled.img`
  cursor: pointer;
`

export default Chat;