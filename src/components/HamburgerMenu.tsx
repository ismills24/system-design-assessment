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
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
    className="text-white text-3xl focus:outline-none"
    aria-expanded={isOpen}
  >
    {isOpen ? <FiX /> : <FiMenu />}
  </button>

  {isOpen && (
    <div
      className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg z-20"
      role="menu"
      aria-label="Main menu"
    >
      <Link
        to="/"
        className="block px-4 py-2 text-softRed hover:bg-softPeach hover:text-white"
        onClick={toggleMenu}
        role="menuitem"
      >
        Home
      </Link>
      <Link
        to="/about"
        className="block px-4 py-2 text-softRed hover:bg-softPeach hover:text-white"
        onClick={toggleMenu}
        role="menuitem"
      >
        About
      </Link>
      <Link
        to="/contact"
        className="block px-4 py-2 text-softRed hover:bg-softPeach hover:text-white"
        onClick={toggleMenu}
        role="menuitem"
      >
        Contact Us
      </Link>
    </div>
  )}
</div>

  );
};

export default HamburgerMenu;