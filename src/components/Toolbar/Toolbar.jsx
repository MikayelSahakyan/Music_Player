import React from 'react';
import { FaPlay, FaCaretDown, FaPlus } from 'react-icons/fa';
import { RiArrowUpDownFill } from "react-icons/ri";
import './Toolbar.scss';

function Toolbar({
  handlePlayAll,
  handleAddAll,
  handleStopAll,
  toggleSortDirection,
  toggleDropdown,
  handleSortOptionChange,
  isDropdownOpen,
  sortOption,
  searchQuery,
  setSearchQuery
}) {
  return (
    <div className='toolbar'>
      <div className="toolbar-left">
        <div className='btn-wrapper'>
          <button className='button main-btn' onClick={handlePlayAll}>
            <FaPlay className="icon-play" />
            Play All
          </button>
          <button className='button carret-btn'>
            <FaCaretDown />
          </button>
        </div>
        <div className='btn-wrapper'>
          <button className='button main-btn' onClick={handleAddAll}>
            <FaPlus className='icon-plus' />
            Add All
          </button>
          <button className='button carret-btn'>
            <FaCaretDown />
          </button>
        </div>
        <button className='button' onClick={handleStopAll}>Stop All</button>
      </div>
      <div className="toolbar-right">
        <div className="sort-dropdown">
          <div className='btn-wrapper'>
            <button className='button main-btn' onClick={toggleSortDirection}>
              <RiArrowUpDownFill className='arrowUpDown-icon' />
              {sortOption ? sortOption : 'Sort by'}
            </button>
            <button className='button carret-btn' onClick={toggleDropdown}>
              <FaCaretDown />
            </button>
          </div>
          {isDropdownOpen && (
            <ul>
              <li onClick={() => handleSortOptionChange('Song Name')}>Song Name</li>
              <li onClick={() => handleSortOptionChange('Artist Name')}>Artist Name</li>
              <li onClick={() => handleSortOptionChange('Track Number')}>Track Number</li>
            </ul>
          )}
        </div>
        <div className="search">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
