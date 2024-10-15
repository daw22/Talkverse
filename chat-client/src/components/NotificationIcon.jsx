import styled from 'styled-components';

function NotificationIcon({ number, toggleModal }) {
  return (
    <Container onClick={()=>toggleModal('messages')}>
      <Number number={number}>
        {number}
      </Number>
    </Container>
  )
}


const Container = styled.div`
  height: 24px;
  width: 24px;
  position: relative;
  cursor: pointer;
  padding: '.2rem';
  background-image: url(/mail.svg);
`;

const Number = styled.div`
  width: 12px;
  height: 12px;
  position: absolute;
  top: -5px;
  right: -5px;
  background: rgba(212, 17, 17);
  border-radius: 50%;
  color: white;
  display: ${({number})=> number > 0 ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  font-size: .8rem;
  padding: 7px;
`;
export default NotificationIcon;
