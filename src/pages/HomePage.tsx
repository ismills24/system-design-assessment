// HomePage.tsx
import React, { useEffect } from 'react';
import VideoList from '../components/VideoList';

const HomePage: React.FC = () => {
  useEffect(() => {
    console.log('HomePage mounted');
    return () => {
      console.log('HomePage unmounted');
    };
  }, []);

  return (
    <div>
      <VideoList />
    </div>
  );
};

export default HomePage;
