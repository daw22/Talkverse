import { Navigate, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../state/UserContext";
import instance from "../utils/axinstance";

function ProtectedRoute() {
  const user = useContext(userContext).user;
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('accessToken');

  console.log(token);
  if (!token) {
    return <Navigate to='/' replace />
  }
  return <Outlet />;
}

export default ProtectedRoute;
