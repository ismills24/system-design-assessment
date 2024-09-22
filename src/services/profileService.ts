import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export interface Profile {
  displayName: string;
}

export const fetchProfile = async (token: string): Promise<Profile> => {
  const response = await axios.get<Profile>(`${API_URL}/api/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateProfile = async (displayName: string, token: string): Promise<void> => {
  await axios.post(
    `${API_URL}/api/users/updateProfile`,
    { displayName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
