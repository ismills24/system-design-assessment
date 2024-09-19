// hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchProfile, updateProfile, Profile } from '../services/profileService';

const useProfile = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = await getAccessTokenSilently();
        const data = await fetchProfile(token);
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [getAccessTokenSilently]);

  const updateProfileData = async (displayName: string) => {
    try {
      const token = await getAccessTokenSilently();
      await updateProfile(displayName, token);
      setProfile((prev) => (prev ? { ...prev, displayName } : { displayName }));
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return { profile, loading, updateProfile: updateProfileData };
};

export default useProfile;
