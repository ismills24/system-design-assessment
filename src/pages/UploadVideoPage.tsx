// UploadVideoPage.tsx
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const UploadVideoPage: React.FC = () => {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false); // New state to track if the message is an error

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  function extractThumbnail(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.muted = true;

      video.addEventListener('loadeddata', () => {
        video.currentTime = 1; // Capture the first second frame
      });

      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create thumbnail.'));
            }
          }, 'image/jpeg');
        } else {
          reject(new Error('Failed to create canvas context.'));
        }
      });

      video.addEventListener('error', () => {
        reject(new Error('Failed to load video for thumbnail extraction'));
      });
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) {
      setIsError(true);
      setMessage('Please provide a title and select a video file.');
      return;
    }

    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    try {
      setUploading(true);
      const token = await getAccessTokenSilently();

      // Extract thumbnail
      const thumbnailBlob = await extractThumbnail(file);

      // Prepare the form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('thumbnail', thumbnailBlob, 'thumbnail.jpg');

      // Send a POST request to the backend upload endpoint
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/videos/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        setIsError(false);
        setMessage('Video uploaded successfully!');
      } else {
        setIsError(true);
        setMessage('Failed to upload video. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      setIsError(true);
      setMessage('An error occurred during the upload. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload a Video</h2>
      {message && (
        <p className={`mb-4 ${isError ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Video File</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="video/*"
            className="mt-1"
            required
          />
        </div>
        <button
          type="submit"
          className={`mt-4 p-2 w-full bg-two text-white rounded-md ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
};

export default UploadVideoPage;
