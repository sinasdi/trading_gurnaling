import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
          📈 Trading Journal Pro
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/new-trade" className="text-gray-600 hover:text-blue-600">
            New Trade
          </Link>
          <Link to="/analytics" className="text-gray-600 hover:text-blue-600">
            Analytics
          </Link>
          
          <div className="flex items-center gap-4 border-l pl-4">
            <span className="text-gray-600">{user?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
