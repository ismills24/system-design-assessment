// ProfilePage.tsx
import React, { useState } from 'react';
import useProfile from '../hooks/useProfiles';

const ProfilePage: React.FC = () => {
  const { profile, loading, updateProfile } = useProfile();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName) {
      updateProfile(displayName);
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
