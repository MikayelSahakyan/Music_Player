import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './MusicUploadForm.scss';
import { addSong } from '../../features/songs/songSlice';

function MusicUploadForm() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const songs = useSelector((state) => state.songs.songs);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

const handleUpload = () => {
  if (file) {
    setUploading(true);
    setShowProgressBar(true);
    // Simulate a 3-second delay and update the progress every 100 milliseconds
    const totalSteps = 30;
    let currentStep = 0;
    const progressInterval = setInterval(() => {
      currentStep++;
      const progress = Math.min((currentStep / totalSteps) * 100, 100);
      setUploadProgress(progress);
      if (progress === 100) {
        clearInterval(progressInterval);
        // After reaching 100% progress, hide the progress bar and add the song
        setTimeout(() => {
          setShowProgressBar(false);
          const reader = new FileReader();
          reader.onload = () => {
            const songNameWithExtension = file.name;
            const hyphenIndex = songNameWithExtension.indexOf('-');
            let artistName, songName;

            if (hyphenIndex !== -1) {
              // Extract artist name and song name if hyphen exists
              artistName = songNameWithExtension.slice(0, hyphenIndex).trim();
              songName = songNameWithExtension.slice(hyphenIndex + 1, songNameWithExtension.lastIndexOf('.')).trim();
            } else {
              // Set default values or handle the situation accordingly
              console.error('File name does not contain hyphen');
              artistName = 'Unknown Artist';
              songName = songNameWithExtension.slice(0, songNameWithExtension.lastIndexOf('.')).trim();
            }

            // Use the FileReader's result as the audio source
            const newSong = {
              id: songs.length,
              songName,
              artistName,
              trackNumber: songs.length + 1,
              url: reader.result, // Set the URL as base64 data URL
            };
            dispatch(addSong(newSong));
            setUploading(false);
            setFile(null);
          };
          reader.onerror = () => {
            console.error('Error reading file');
            setUploading(false);
            setFile(null);
          };

          reader.readAsDataURL(file); // Read the file as data URL

        }, 1000);
      }
    }, 100);
  }
};

  return (
    <div className="music-upload-form">
      <input type="file" accept=".mp3,.wav" onChange={handleFileChange} />
      {file && <p>Selected file: {file.name}</p>}
      <button onClick={handleUpload} disabled={!file || uploading}>
        Upload
        {showProgressBar && (
          <div className="progress-bar">
            <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
      </button>
    </div>
  );
}

export default MusicUploadForm;
