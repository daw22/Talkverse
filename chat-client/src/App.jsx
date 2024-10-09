import Account from "./pages/Account";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserContextProvider from "./state/UserContext";
import "./index.css";
import "react-toastify/dist/ReactToastify.min.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Chat from "./pages/Chat";
import AccountSetup from "./pages/AccountSetup";

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Account />} />
          <Route path="/setup" element={<AccountSetup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
