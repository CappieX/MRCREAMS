import React from 'react';
import { Card, CardContent, CardHeader, Box, useTheme } from '@mui/material';

const StyledCard = ({ title, icon, children, action, elevation = 2, sx = {} }) => {
  const theme = useTheme();
  
  return (
    <Card
      elevation={elevation}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        borderRadius: 2,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[elevation + 2],
        },
        ...sx
      }}
    >
      {title && (
        <CardHeader
          title={title}
          titleTypographyProps={{ variant: 'h6', fontWeight: 'medium' }}
          avatar={
            icon && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main + '22',
                  color: theme.palette.primary.main,
                }}
              >
                {icon}
              </Box>
            )
          }
          action={action}
          sx={{
            pb: 0,
            '& .MuiCardHeader-action': {
              alignSelf: 'center',
            },
          }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, pt: title ? 1 : 2 }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default StyledCard;