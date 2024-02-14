import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSongIndex, stopAll, reorderSongs, addAll, checkSong, unCheckSong } from '../../features/songs/songSlice';
import { FaPlay, FaPause, FaHeart, FaCheck, FaShare, FaCaretDown } from 'react-icons/fa';
import { BsGripVertical } from 'react-icons/bs';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './SongList.scss';
import MusicUploadForm from '../MusicUploadForm/MusicUploadForm';
import Toolbar from '../Toolbar/Toolbar';

function SongList() {
  const songs = useSelector((state) => state.songs.songs);
  const currentSongIndex = useSelector((state) => state.songs.currentSongIndex);
  const songId = useSelector((state) => state.songs.songId);
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (currentSongIndex >= 0 && currentSongIndex < songs.length) {
      // Start playing the current song
      const songUrl = filteredSongs[currentSongIndex].url; // Assuming you have a URL field in your song object
      audioRef.current.src = songUrl;
      audioRef.current.play(); // Start playing
    } else {
      setIsPlayingAll(false);
    }
  }, [currentSongIndex, songs, audioRef]);

  const handleSongClick = (id) => {
    const index = filteredSongs.findIndex(song => song.id === id);
    if (index === currentSongIndex) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } else {
      dispatch(setCurrentSongIndex(index));
    }
    setIsPlayingAll(false);
    dispatch(unCheckSong());
  };

  const handleStopAll = () => {
    dispatch(stopAll());
    dispatch(unCheckSong());
    audioRef.current.pause(); // Pause playback
    audioRef.current.currentTime = 0; // Reset playback position
    setIsPlayingAll(false);
  };

  const handlePlayAll = () => {
    setIsPlayingAll(true);
    
    if (currentSongIndex === 0) {
      audioRef.current.currentTime = 0;
      audioRef.current.play(); // Pause if already playing from the first song
      dispatch(checkSong(currentSongIndex));
    } else {
      const index = 0;
      dispatch(setCurrentSongIndex(index));
      dispatch(checkSong(index));
    }
    console.log('Play All clicked');
  };

  const handleAddAll = () => {
    setIsPlayingAll(true);
    audioRef.current.play();
    if (currentSongIndex === -1) {
      const index = 0;
      dispatch(addAll());
      dispatch(checkSong(index));
    } else {
      dispatch(addAll());
      dispatch(checkSong(currentSongIndex));
    }
    console.log('Add All clicked');
  };

  const handleSongEnd = () => {
    if (isPlayingAll) {
      const nextSongIndex = currentSongIndex + 1;
      if (nextSongIndex < songs.length) {
        dispatch(setCurrentSongIndex(nextSongIndex));
      } else {
        dispatch(stopAll());
        setIsPlayingAll(false);
      }
    } else {
      dispatch(stopAll());
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const startIndex = result.source.index;
    const endIndex = result.destination.index;
  
    const draggedSong = filteredSongs[startIndex];
    const originalStartIndex = songs.findIndex(song => song.id === draggedSong.id);
    const originalEndIndex = songs.findIndex(song => song.id === filteredSongs[endIndex].id);

    // Update currentSongIndex if the currently playing song is affected by reordering
    let newIndex = currentSongIndex;
    if (startIndex === currentSongIndex) {
      newIndex = endIndex;
    } else if (startIndex < currentSongIndex && endIndex >= currentSongIndex) {
      newIndex--;
    } else if (startIndex > currentSongIndex && endIndex <= currentSongIndex) {
      newIndex++;
    }

    dispatch(reorderSongs({ startIndex: originalStartIndex, endIndex: originalEndIndex }));
    dispatch(setCurrentSongIndex(newIndex));
    setSortOption(null);
  };

  const handleSortOptionChange = (option) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleSorting = () => {
    if (!sortOption) return songs;

    const sortedSongs = [...songs].sort((a, b) => {
      if (sortOption === 'Song Name') {
        return a.songName.localeCompare(b.songName);
      } else if (sortOption === 'Artist Name') {
        return a.artistName.localeCompare(b.artistName);
      } else if (sortOption === 'Track Number') {
        return a.trackNumber - b.trackNumber;
      }
      return 0;
    });

    return sortDirection === 'asc' ? sortedSongs : sortedSongs.reverse();
  };

  // Function to filter songs based on search query
  const filteredSongs = handleSorting().filter((song) => {
    const { songName, artistName, trackNumber } = song;
    const normalizedQuery = searchQuery.toLowerCase();
    return (
      songName.toLowerCase().includes(normalizedQuery) ||
      artistName.toLowerCase().includes(normalizedQuery) ||
      trackNumber.toString().includes(normalizedQuery)
    );
  });

  return (
    <div className='container'>
      <Toolbar
        handlePlayAll={handlePlayAll}
        handleAddAll={handleAddAll}
        handleStopAll={handleStopAll}
        toggleSortDirection={toggleSortDirection}
        toggleDropdown={toggleDropdown}
        handleSortOptionChange={handleSortOptionChange}
        isDropdownOpen={isDropdownOpen}
        sortOption={sortOption}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="song-list">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Song Name</th>
                <th>Artist Name</th>
                <th>Track</th>
                <th></th>
              </tr>
            </thead>
            <Droppable droppableId="songs">
              {(provided) => (
                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                  {filteredSongs.map((song, index) => (
                    <Draggable key={song.id} draggableId={song.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={snapshot.isDragging ? 'dragged-item' : ''}
                        >
                          <td>
                            <span className="icon-grip" {...provided.dragHandleProps}>
                              <BsGripVertical />
                            </span>
                            <span className="icon-play" onClick={() => handleSongClick(song.id)}>
                              {index === currentSongIndex ? <FaPause /> : <FaPlay />}
                            </span>
                          </td>
                          <td>{song.songName}</td>
                          <td>{song.artistName}</td>
                          <td>{song.trackNumber}</td>
                          <td>
                            <FaHeart className="icon-heart" />
                            <FaCheck className={`icon-check ${song.added ? 'active' : ''}`} />
                            <FaShare className="icon-share" />
                            <FaCaretDown className="icon" />
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </table>
        </div>
      </DragDropContext>
      <div className='toolbar'>
        <MusicUploadForm />
      </div>
      <audio ref={audioRef} controls={false} onEnded={handleSongEnd} />
    </div>
  );
}

export default SongList;