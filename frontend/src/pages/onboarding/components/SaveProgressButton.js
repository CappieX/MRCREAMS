import React from 'react';
import { Button } from '@mui/material';

const SaveProgressButton = ({ onClick, disabled }) => {
  return (
    <Button
      variant="text"
      size="small"
      onClick={onClick}
      disabled={disabled}
      sx={{ textTransform: 'none', opacity: disabled ? 0.6 : 1 }}
    >
      Save and finish later
    </Button>
  );
};

export default SaveProgressButton;

