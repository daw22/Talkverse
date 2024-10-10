import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem('accessToken');

  console.log(token);
  if (!token) {
    return <Navigate to='/' replace />
  }
  return <Outlet />;
}

export default ProtectedRoute;
