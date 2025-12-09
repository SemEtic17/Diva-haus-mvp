import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl"><Link to="/">Diva Haus</Link></h1>
        <div>
          <Link to="/cart" className="mr-4">Cart</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="mr-4">Profile</Link> {/* NEW: Profile Link */}
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
