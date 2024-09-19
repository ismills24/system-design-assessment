// ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const ProfilePage: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch profile data from your backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDisplayName(response.data.displayName);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [getAccessTokenSilently]);

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/updateProfile`,
        { displayName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-page max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-softRed mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-softOrange font-semibold mb-2">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={handleDisplayNameChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your display name"
          />
        </div>
        <button
          type="submit"
          className="bg-softRed text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
