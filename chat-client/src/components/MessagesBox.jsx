import { useEffect, useState, useContext } from 'react';
import styled from 'styled-components'
import instance from '../utils/axinstance';
import { userContext } from '../state/UserContext';

function MessagesBox({ modalOpen, setModalOpen, setSelectedUser }) {
  const ctx = useContext(userContext);
  const [messages, setMessages] = useState(null);

  const fetchUnreadMessages = async () => {
    if (modalOpen === 'false') return;
    const res = await instance.get('/chat/getunreadmessages');
    if (res.status === 200){
      setMessages(res.data);
    }
  }

  const onMessageClicked = async (message) => {
    setModalOpen('false');
    setSelectedUser(message.sender);
    const remainingMsgs = messages.filter(msg => msg.sender._id === message.sender_id);
    setMessages(remainingMsgs);
    const remainingMsgsIds = remainingMsgs.map(msg => msg._id);
    let unreadMsgsList = ctx.user.unreadMessages;
    unreadMsgsList = unreadMsgsList.filter(unMsg => remainingMsgsIds.includes(unMsg));
    ctx.setUser({...ctx.user, unreadMessages: unreadMsgsList});
    instance.post('/chat/markreadmessages', {msgIds: unreadMsgsList});
  }

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
  
    if (minutes < 1) {
      return "Just now";
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours < 24) {
        return `${hours} hours ago`;
      } else {
        // Handle days, weeks, months, etc. if needed
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days < 7) {
          return `${days} days ago`;
        } else {
          // Handle weeks, months, etc. if needed
          return "More than a week ago";
        }
      }
    }
  }

  useEffect(()=>{
    fetchUnreadMessages();
  },[modalOpen]);

  return (
    <Container onClick={(e)=> e.stopPropagation()}>
      <h3 style={{color: 'white', marginBottom: '1rem'}}>Messages</h3>
      {
        !messages ? (
          <h3>loading...</h3>
        ): (
          messages.length === 0 ? <h3>No Messages</h3> :
          messages.map((msg)=> (
            <MessageItem key={msg._id} onClick={()=> onMessageClicked(msg)}>
              <div style={{display: 'flex'}}>
                <Avatar src={msg.sender.profilePic} />
                <h4 style={{color: 'white', fontWeight: 200}}>
                  {msg.sender.firstName} {msg.sender.lastName}
                </h4>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                <MessageContent>{msg.message}</MessageContent>
                <Time>
                  {formatTimeAgo(new Date(msg.createdAt))}  
                </Time>
              </div>
            </MessageItem>
          ))
        )
      }
    </Container>
  )
}

const Container = styled.div`
  background: rgba(1, 1, 1, .7);
  padding: 2rem;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50%;
  margin-top: 8rem;
  overflow: scroll;
`;

const MessageItem = styled.div`
  width: 100%;
  padding: .5rem 2rem;
  display: flex;
  flex-direction: column;
  jsutify-content: center;
  cursor: pointer;
  margin-bottom: 1rem;
  border: 1px solid #dfdfdf;
  border-radius: .5rem;
  &:hover {
    scale: 1.03;
  }
`;

const Avatar = styled.img`
  height: 32px;
  width: 32px;
  margin-right: 1rem;
`;

const MessageContent = styled.p`
  color: white;
  width: 50%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 48px;
  color: orange;
  font-size: .9rem;
`;

const Time = styled.p`
  font-size: .8rem;
  margin-top: .5rem;
  margin-left: 48px;
  color: white;
`;
export default MessagesBox;