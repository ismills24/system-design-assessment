// App.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VideoPlayer from './pages/VideoPlayer';
import ProfilePage from './pages/ProfilePage'; // Import the ProfilePage component
import HamburgerMenu from './components/HamburgerMenu';
import logo from './assets/logo.png';

const App: React.FC = () => {
  return (
    <div className="bg-pastelPeach min-h-screen">
      <header className="bg-softRed p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="SoftServe Logo" className="w-auto h-12 md:h-16" />
        </Link>
        <HamburgerMenu />
      </header>
      <main className="p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/videos/:id" element={<VideoPlayer />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* Add the Profile route */}
        </Routes>
      </main>
    </div>
  );
};

export default App;
