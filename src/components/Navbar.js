import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { auth } from '../firebaseConfig'; // Make sure this points to your firebase config
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set user state to the authenticated user
      } else {
        setUser(null); // Set to null if no user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      setUser(null); // Clear user state
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">ZenSolve Infotech Solution</h1>
        
        {/* Hamburger menu for mobile view */}
        <div className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        {/* Links - shown only on desktop or when menu is open on mobile */}
        <ul className={`md:flex md:items-center md:space-x-4 ${isOpen ? 'block' : 'hidden'}`}>
          {/* Welcome message if user is logged in */}
          {user ? (
            <>
              <li className="hover:text-gray-300">Welcome, {user.email}</li>
              <li className="hover:text-gray-300 cursor-pointer" onClick={handleLogout}>Logout</li>
            </>
          ) : (
            <>
              <li className="hover:text-gray-300"><Link to="/">Home</Link></li>
              <li className="hover:text-gray-300"><Link to="/ss">Slideshow</Link></li>
              
              {/* Dropdown for Services */}
              <li className="hover:text-gray-300"><Link to="/ed-ftr">Edit Footer Data</Link></li>
              <li className="hover:text-gray-300"><Link to="/ed-rvw">Reviews</Link></li>

              <li className="hover:text-gray-300"><Link to="/logo">Logo Upload</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
