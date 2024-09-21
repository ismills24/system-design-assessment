import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import AuthButtons from './AuthButtons';

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        className="text-white text-3xl focus:outline-none"
        aria-expanded={isOpen}
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {isOpen && (
        <div
          className="hamburger-dropdown"
          role="menu"
          aria-label="Main menu"
        >
          <Link
            to="/"
            className="block px-4 py-2 text-one hover:bg-three hover:text-white"
            onClick={toggleMenu}
            role="menuitem"
          >
            Home
          </Link>
          <Link
            to="/profile"
            className="block px-4 py-2 text-one hover:bg-three hover:text-white"
            onClick={toggleMenu}
            role="menuitem"
          >
            Profile
          </Link>
          <Link
            to="/upload"
            className="block px-4 py-2 text-one hover:bg-three hover:text-white"
            onClick={toggleMenu}
            role="menuitem"
          >
            Upload a Video
          </Link>
          <AuthButtons /> {/* Ensure this renders Login/Logout correctly */}
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
