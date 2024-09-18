import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VideoPlayer from './pages/VideoPlayer';
import HamburgerMenu from './components/HamburgerMenu'; // Import the HamburgerMenu component
import logo from './assets/logo.png';  // Import the logo

const App: React.FC = () => {
  return (
    <Router>
      <div className="bg-pastelPeach min-h-screen">
        <header className="bg-softRed p-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="SoftServe Logo" className="w-auto h-12 md:h-16" />
          </Link>

          {/* Hamburger menu for small screens */}
          <div className="block md:hidden">
            <HamburgerMenu />
          </div>
        </header>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/videos/:id" element={<VideoPlayer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;