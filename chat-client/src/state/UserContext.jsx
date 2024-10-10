import { createContext, useEffect } from "react";
import { useState } from "react";

export const userContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(()=>{
    if(!user) setUser(localStorage.getItem('userData'));
  },[]);

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
};

export default UserContextProvider;
