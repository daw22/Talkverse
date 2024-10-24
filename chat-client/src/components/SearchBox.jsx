import { useState, useEffect, useContext } from 'react'
import styled from 'styled-components';
import SelectCountry from './SelectCountry';
import instance from '../utils/axinstance';
import { userContext } from '../state/UserContext'

function SearchBox() {
  const ctx = useContext(userContext);
  const [formData, setFormData] = useState({
    searchText: "",
    country: ""
  });

  const searchUser = async () => {
    let country = formData.country.split(' ').slice(1).join(' ');
    const res = await instance.get(`/chat/search?q=${formData.searchText}&country=${country}`);
    if (res.status === 200) {
      setSearchResults(res.data);
    }
  }
  const AddToContact = async (result) => {
    const contactIds = ctx.user.contacts.map((c)=> c._id);
    if(contactIds.includes(result._id)){
      return;
    }
    const res = await instance.post('/chat/addcontact', 
      {id: ctx.user._id, contactId: result._id}
    );

    if (res.status == 200) {
      ctx.setUser(res.data.user);
      if (res.data.newContactOnline) ctx.setOnlineContacts([...ctx.onlineContacts, result._id]);
    }
  }
  useEffect(()=>{
    searchUser();
  }, [formData]);

  const [searchResults, setSearchResults] = useState([]);
  return (
    <Container onClick={(e)=> e.stopPropagation()}>
      <h4 style={{color: 'white', textAlign: 'center', marginBottom: '2rem'}}>Search user</h4>
      <SearchInputContainer>
        <SearchInput 
          onChange={(e)=> setFormData({...formData, searchText: e.target.value})}
          value={formData.searchText}
          placeholder="by @username or name"
        />
        <SelectCountry formData={formData} setFormData={setFormData} defaultCountry='Country'/>
        
      </SearchInputContainer>
      <ResultsListContainer>
        { searchResults.map((result)=> (
            <ResultItem>
              <h4 style={{width: 'fit-content', fontWeight: '400'}}>
                {result.flag} {result.firstName} {result.lastName}
              </h4>
              <AddToContactButton src='/add.svg' onClick={()=> AddToContact(result)}/>
            </ResultItem>
          ))
        }
      </ResultsListContainer>
    </Container>
  )
}

const Container = styled.div`
  background: rgba(1, 1, 1, .7);
  padding: 2rem 2rem;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50%;
  margin-top: 8rem;
`;

const SearchInputContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SearchInput = styled.input`
  width: 40%;
  outline: none;
  border: none;
  padding: .6rem;
  border-radius: 5px;
`;

const ResultsListContainer = styled.div`
  overflow: scroll;
  padding: 1rem 0;
  width: 100%;
`;

const ResultItem = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const AddToContactButton = styled.img`
  padding: .3rem;
  border: 1px solid green;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background: black;
  }
`;

export default SearchBox;
