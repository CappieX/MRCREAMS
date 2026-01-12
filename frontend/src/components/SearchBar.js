import React from 'react';
import { Paper, InputBase, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar = ({ placeholder = "Search...", onSearch }) => {
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', maxWidth: 400 }}
      elevation={1}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'search' }}
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <Search />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
