Music Player Application


Overview

The Music Player Application is a web-based platform for managing and playing music tracks. It allows users to upload, organize, and play their favorite songs. The application features a responsive user interface and supports basic functionalities such as adding and playing songs.

Component Structure
The application consists of the following main components:

SongList: This component displays a list of songs along with controls for playing, adding, and sorting them. It also includes a search bar to filter songs based on user input.

MusicUploadForm: This component provides a file upload form for adding new songs to the library. It includes a progress bar to track the upload process and handles error messages during file upload.

Toolbar: This component contains buttons and controls for managing the music playback, including options to play all songs, add all songs to the playlist, and stop playback. It also includes a dropdown menu for sorting songs and a search input field.


State Management Approach

The application uses Redux for state management. The Redux store holds the application state, including the list of songs, current playback status, and active filters. Actions are dispatched to modify the state, and reducers handle these actions to update the store accordingly. The useSelector and useDispatch hooks from React-Redux are used to access the store and dispatch actions from functional components.


How to Run the Application Locally
To run the application locally, follow these steps:

Clone the repository to your local machine:
git clone https://github.com/MikayelSahakyan/Music_Player.git

Navigate to the project directory:
cd music-player-app

Install dependencies using npm:
npm install

Start the development server:
npm run dev

Open your web browser and visit http://localhost:5173/ to view the application.


Assumptions and Additional Features

~The application assumes that music files are in either MP3 or WAV format.
~Error handling is implemented in the MusicUploadForm component to handle invalid file formats and upload failures.
~The user interface is responsive and adjusts to different screen sizes to provide a consistent experience across devices.
~Basic music playback controls, such as play, pause, and stop, are provided in the Toolbar component.
~Songs can be sorted based on song name, artist name, or track number using the dropdown menu in the Toolbar component.
