import { createContext, useEffect } from "react";
import { useState } from "react";

export const userContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [onlineContacts, setOnlineContacts] = useState([]);
  return (
    <userContext.Provider value={{ user, setUser, onlineContacts, setOnlineContacts }}>
      {children}
    </userContext.Provider>
  );
};

export default UserContextProvider;
