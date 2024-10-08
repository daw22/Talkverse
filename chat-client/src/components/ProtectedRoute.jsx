import { Navigate, Outlet } from "react-router-dom";
function ProtectedRoute({ user }) {
  if (!user) {
    <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
