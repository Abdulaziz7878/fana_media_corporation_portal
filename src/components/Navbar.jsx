import { useAuth } from "../customHooks/useAuth"
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">Fana Media Portal</h1>
      <div className="flex gap-4 items-center">
        <span>{user?.username} ({user?.role})</span>
        <button onClick={
          () => {
            logout();
            navigate('/');
          }} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;