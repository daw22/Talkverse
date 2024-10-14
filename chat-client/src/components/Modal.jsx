import styled from "styled-components";

function Modal({ children, isopen, setIsModalOpen }) {
  return (
    <Container isopen={isopen} onClick={()=>setIsModalOpen(false)}>
      {children}
    </Container>
  )
}

const Container = styled.div`
  display: ${({isopen}) => isopen ? 'flex' : 'none'};
  align-items: start;
  justify-content: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(1,1,1); 
  background-color: rgba(1,1,1,0.4);
`;

export default Modal;