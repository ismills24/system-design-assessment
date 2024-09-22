# SoftServe: Video Streaming Platform

## Section 1: Submission Details
This section directly addresses the initial prompts provided by the interview assessment. It highlights the design decisions, chosen technologies, and key architectural elements. The second section contains information pertaining specifically to the prototype designed for this purpose: SoftServe.

### 1. System Overview
Objective: Design a YouTube-like video streaming platform with a focus on core functionality like uploading, viewing, and interacting with videos.
Business Context: Designed to support 20,000 to 50,000 Daily Active Users, primarily in Canada and Europe, within a 6-month development timeframe and a small team.

### 2. Proposed Architecture
####System Diagram:

![Architecture Diagram](https://github.com/user-attachments/assets/dc66a1a6-302a-42e1-b2af-c1761fb35b3d)

####Languages and Technologies Used:

- **Frontend**: React, TypeScript, TailwindCSS for styling, Auth0 for authentication.
- **Backend**: Node.js with Express, PostgreSQL for data storage, Cloudflare R2 for video storage.
- **Future Considerations**: CDN integration, video transcoding, redis and microservices separation for scaling.
  
### 3. API Specification
####Endpoints Overview:
  In my design, the API contains three major routes containing various endpoints each:

- **/videos/**: Get a list of videos, get information about a specific video - likes, comments, views etc.,  upload a video, leave a comment
- **/comments/**: Like/dislike a comment, delete one of your comments
- ***/users/**: Update your profile information, subscribe to a user
  
Detailed API Spec:
See my prototpye API here: [vention-interview-api](https://github.com/ismills24/vention-interview-api)
The readme contains a complete specification of available endpoints.

### 4. Key Design Decisions and Rationale
- **Backend (ExpressJs)**: Express is a simple, easy to use and widely supported backend framework that integrates well with auth and storage components.
- **Storage (Cloudflare r2)**: Given that this project is being built from scratch and is not forced to integrate into an existing dev environment, the advantages of larger, more established storage solutions such as AWS or GoogleCloud are minimized. R2 offers interchangeable API support with S3 which makes it hassle free to implement with our architecture. The lack of data egress fees is also highly attractive given our use case of serving large data files. Cloudflare offers CDNs and video transcoding as well.
- **Database**: Given that our data structure is simple and relational (a user owns a comment, which is related to a video which is owned by a user etc), I made the decision to go with a relation DB instead of a non-relation one such as MongoDB. Mongo would have provided greater flexibility but given that our data schema is easily defineable, I don't see that as a major advantage. Given that PostgreSQL is a part of the Vention stack, it was also an opportunity for me to familiarize myself with an SQL implementation I haven't worked with before.
- **Authentication (Auth0)**: Auth0 is quick to implement, contains UI components out of box and supports multiple authentication methods including social login (Google, Facebook etc).
- **Microservices and why they aren't present in the prototype**: Separating logically grouped data processes such as User-Profile functions, or video management into distinct components offers many advantages, chief amoung them removing single points of failure. IE: If our video uploading component goes down, users can still engage with video content without the entire system failing. Ultimately, I made the decision that for the prototype it would be an inefficient use of my time to build out each feature as a separate component that I would need to deploy. Development was much faster simply implementing as many features as I could as a monolith.
  
### 5. Future Improvements and Considerations
In short, the SoftServe prototype represents a complete, end to end system. A user can register for an account and upload a video. Someone else could watch that video and leave a comment. The system represents a solid groundwork for the complete project envisoned 6 months down the line. Aside from some missing features outlined earlier, and obvious UI improvements (or rework *cough*), the main things left to implement to complete this project have to do with scaling.
 - ***Video Transcoding***: Transcoding videos for different screen resolutions is essential for better user experience and bandwidth management but ultimately felt out of scope for this timely prototype.
 - ***Microservices***: Separating components based on function into distinct microservices would improve scalability and robustness.
- ***CDN/Redis/Load balancing***: Given the reality of media streaming, a small subset of hyper popular content represents an important proportion of total traffic. By leveraging media caching via CDNs and database caching with Redis, we could improve load times and reduce load (and cost) on our cloud storage solution.
- ***Misc***: Ultimately, this was a very fast prototype and much stands to be optimized. Examples would be optimizing database queries, implementing lazy loading for our image thumbnails etc.

<hr/>

Welcome to the frontend repository for **SoftServe**, a video streaming platform built with React and TypeScript, styled with TailwindCSS. This frontend interacts with a backend API for user authentication, video streaming, uploading and comment management. The platform allows users to browse, watch, upload and interact with videos, including commenting, liking/disliking, and favoriting content.

## Features

- **Video Uploading**: Upload a video file
- **Video Streaming**: Watch videos with playback controls.
- **Authentication**: Login and registration via Auth0.
- **Comments**: Users can view, post, like, dislike, and delete comments.
- **Favorites**: Favorite and unfavorite videos, with a toggle to view favorited content.
- **Profile Management**: Users can update their display names.

## System Architecture


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

# Prerequisites
Node.js (v16.x or higher)
npm (v7.x or higher) or yarn
# Installation
1. Clone the repository:

```bash
git clone https://github.com/your-username/softserve-frontend.git
cd softserve-frontend
```

2. Install dependencies:

```bash
npm install
```
3. Set up environment variables:

Create a .env file in the root of the project and add your Auth0 configuration and backend API URL.

```bash
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_AUTH0_DOMAIN=your-auth0-domain
REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
REACT_APP_AUTH0_AUDIENCE=https://your-api.com
```
4. Run the development server:

```bash
npm start
The app will be available at http://localhost:3000.
```

# Authentication
This project uses Auth0 for authentication and authorization. You can sign in or sign up, and after authentication, you will be redirected back to your last visited page.

# Setting Up Auth0
1. Sign up at Auth0.
2. Create a new application, select "Single Page Application."
3. Get your Domain, Client ID, and Audience, and add them to the .env file.
4. Set the callback URL in Auth0 to http://localhost:3000 for local development.
