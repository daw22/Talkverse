import { useState } from "react";
import Account from "./pages/Account";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserContextProvider from "./state/UserContext";
import "./index.css";
import "react-toastify/dist/ReactToastify.min.css";

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Account} />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
