# YouTube Clone Project

This is a full-stack project designed to replicate the core functionalities of YouTube, including video upload, channel creation, video deletion, and commenting. The application is built using React for the frontend and Node.js for the backend. Firebase is used to store the uploaded videos.

## Project Structure

The project is divided into two main directories:

- **Client**: The frontend part of the application built with React.
- **Server**: The backend API server built with Node.js.

## Features

- **Channel Creation**: Users can create their own channel and manage their profile.
- **Video Upload**: Users can upload videos to their channel, which are stored in Firebase.
- **Video Deletion**: Users can delete videos from their channel.
- **Comments Section**: Users can comment on videos, creating an interactive platform.
- **Responsive Design**: The application is fully responsive and works on both desktop and mobile devices.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: Firebase for storing videos and MongoDB for storing user data
- **Authentication**: JWT Authentication
- **Styling**: CSS (can be Tailwind CSS or custom styles)

## Setup Instructions

### Prerequisites

- Node.js (preferably the latest stable version)
- npm or yarn (for managing dependencies)
- Firebase account and Firebase SDK
- MongoDB Account

### 1. Clone the repository

```bash
git clone https://github.com/GitAmanS/Youtube-Clone-Mern.git


### 2. Set up the Client
cd client
npm install
npm start


By default, the client will run on http://localhost:3000.


### 3. Set up the Server
cd server
npm install
npm run dev

By default, the server will run on http://localhost:5000.




## Features Walkthrough

- **Create a Channel**:  
  After logging in, users can create their channel with a unique name.

- **Upload a Video**:  
  Users can upload videos by selecting a file and entering details like title and description.

- **Delete a Video**:  
  Any video uploaded can be deleted from the channel’s dashboard.

- **Comment on Videos**:  
  Users can comment on videos to share their thoughts with others.

## Technologies in Detail

- **React.js**:  
  The frontend is built using React, allowing for dynamic rendering and a responsive user interface.

- **Node.js & Express**:  
  The backend uses Node.js with Express to handle API requests such as video uploads, channel management, and comments.

- **JWT Authentication**:  
  JSON Web Tokens (JWT) are used to handle user authentication securely.

- **MongoDB**:  
  MongoDB is used to store user data such as user profiles, comments, and channel information.

- **Firebase**:  
  Firebase is used to store video files and handle video streaming. It provides scalable storage solutions and real-time capabilities.

## Future Improvements

- Implement video streaming instead of just video uploads.
- Add a like/dislike feature for videos.
- Add user subscriptions and video recommendations.
