# SoftServe Frontend

Welcome to the frontend repository for **SoftServe**, a video streaming platform built with React and TypeScript, styled with TailwindCSS. This frontend interacts with a backend API for user authentication, video streaming, and comment management. The platform allows users to browse, watch, and interact with videos, including commenting, liking/disliking, and favoriting content.

## Features

- **Video Streaming**: Watch videos with playback controls.
- **Authentication**: Login and registration via Auth0.
- **Comments**: Users can view, post, like, dislike, and delete comments.
- **Favorites**: Favorite and unfavorite videos, with a toggle to view favorited content.
- **Profile Management**: Users can update their display names.

## Technologies Used

- **React**: Frontend framework
- **TypeScript**: Type-safe JavaScript
- **Auth0**: Authentication and Authorization
- **Axios**: HTTP client for making API requests
- **React Router**: Navigation and routing for the application
- **TailwindCSS**: Utility-first CSS framework
- **ESLint & Prettier**: Code linting and formatting

## Project Structure

```bash
src/
├── assets/          # Images, icons, etc.
├── components/      # Reusable UI components (VideoCard, Comments, HamburgerMenu, etc.)
├── hooks/           # Custom React hooks (useSearch, useComments, useProfile, etc.)
├── pages/           # Page components (HomePage, VideoPlayer, ProfilePage)
├── services/        # API service files (videoService, commentService, profileService)
├── App.tsx          # Main application component
├── index.tsx        # Entry point for the React app
└── styles/          # Global styles
```
Getting Started
To run this project locally, follow these steps:

Prerequisites
Node.js (v16.x or higher)
npm (v7.x or higher) or yarn
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/softserve-frontend.git
cd softserve-frontend
Install dependencies:

bash
Copy code
npm install
Set up environment variables:

Create a .env file in the root of the project and add your Auth0 configuration and backend API URL.

bash
Copy code
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_AUTH0_DOMAIN=your-auth0-domain
REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
REACT_APP_AUTH0_AUDIENCE=https://your-api.com
Run the development server:

bash
Copy code
npm start
The app will be available at http://localhost:3000.

Available Scripts
npm start: Runs the app in development mode.
npm run build: Builds the app for production.
npm run lint: Runs ESLint for code linting.
npm run format: Runs Prettier to format the code.
Authentication
This project uses Auth0 for authentication and authorization. You can sign in or sign up, and after authentication, you will be redirected back to your last visited page.

Setting Up Auth0
Sign up at Auth0.
Create a new application, select "Single Page Application."
Get your Domain, Client ID, and Audience, and add them to the .env file.
Set the callback URL in Auth0 to http://localhost:3000 for local development.
