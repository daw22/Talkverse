import { useState,useContext } from 'react'
import styled from 'styled-components';
import SelectCountry from './SelectCountry';
import SelectLanguage from './SelectLanguage';
import instance from '../utils/axinstance';
import { userContext } from '../state/UserContext';
import { v4 } from 'uuid';
import { storage } from '../utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function UpdateProfile({ profile, closeModal }) {
  const ctx = useContext(userContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    language: "",
    country: "",
    bio: "",
    profilePic: "",
  });

  const [imageUpload, setImageUpload] = useState(null);
  const [buttonText, setButtonText] = useState('save');

  const uploadImage = async () => {
    try{
      const imageRef = ref(storage, `profilePics/${v4()}`);
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch(err){
      console.log(err);
      return "";
    }
  }

  const updateProfile = async () => {
    setButtonText('saving...');
    let data = formData;
    if (imageUpload) {
      const downloadUrl = await uploadImage();
      if (downloadUrl) data = { data, profilePic: downloadUrl}
    }
    const res = await instance.post('/profile/updateprofile', data);
    if (res.status == 201){
      ctx.setUser(res.data);
      console.log('new profile:', ctx.user);
      setButtonText('save');
    }
    closeModal('false');
  }

  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <TitleText>Edit Profile</TitleText>
      <FlexContainer>
      <TextInput 
          onChange={(e)=> setFormData({...formData, firstName: e.target.value})}
          placeholder={profile.firstName}
        />
        <TextInput 
          onChange={(e)=> setFormData({...formData, lastName: e.target.value})}
          placeholder={profile.lastName}
        />
      </FlexContainer>
      <FlexContainer>
        <SelectCountry formData={formData} setFormData={setFormData} />
        <SelectLanguage formData={formData} setFormData={setFormData} />
      </FlexContainer>
      <div style={{color: 'white', display: 'flex', gap:'1rem'}}>
        <h5>change profile picture</h5>
        <input
          label="Image"
          placeholder="change profile"
          accept="image/png,image/jpeg"
          type="file"
          onChange={(e) => {
            setImageUpload(e.target.files[0]);
          }}
        />
      </div>
      <Bio placeholder={profile.bio}/>
      <SaveButton onClick={updateProfile}>{buttonText}</SaveButton>
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

const TitleText = styled.h4`
  text-align: center;
  color: white;
  margin-bottom: 1rem;
`;
const FlexContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const TextInput = styled.input`
  width: 45%;
  outline: none;
  border: none;
  padding: .6rem;
  border-radius: 5px;
`;

const Bio = styled.textarea`
  padding: 0.5rem 1rem;
  width: 80%;
  border-radius: 5px;
  outline: none;
  border: none;
  margin-top: 1rem;
  resize: none;
`

const SaveButton = styled.button`
  border: none;
  outline: none;
  width: 30%;
  background: green;
  color: white;
  cursor: pointer;
  margin: 1rem 0;
  padding: .5rem 0;
  border-radius: .5rem;
`;
export default UpdateProfile;
