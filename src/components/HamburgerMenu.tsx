import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi'; // Hamburger and close icons

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="text-white text-3xl focus:outline-none"
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>
      
      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg z-20">
          <Link
            to="/"
            className="block px-4 py-2 text-softRed hover:bg-softPeach hover:text-white"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block px-4 py-2 text-softRed hover:bg-softPeach hover:text-white"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block px-4 py-2 text-softRed hover:bg-softPeach hover:text-white"
            onClick={toggleMenu}
          >
            Contact Us
          </Link>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;