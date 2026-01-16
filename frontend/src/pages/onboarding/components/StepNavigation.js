import React from 'react';
import { Box, Button } from '@mui/material';

const StepNavigation = ({ onBack, onNext, onComplete, disableNext, isFirst, isLast, loading }) => {
  return (
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
      <Button
        variant="text"
        disabled={isFirst || loading}
        onClick={onBack}
      >
        Back
      </Button>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {!isLast && (
          <Button
            variant="outlined"
            disabled={loading}
            onClick={onNext}
          >
            Save & Continue
          </Button>
        )}
        {isLast && (
          <Button
            variant="contained"
            disabled={disableNext || loading}
            onClick={onComplete}
          >
            {loading ? 'Completing...' : 'Complete Onboarding'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default StepNavigation;

