import { Navigate } from 'react-router-dom';
import { useAuth } from '../customHooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />; // Not logged in
  if (!allowedRoles.includes(user.user.role)) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;