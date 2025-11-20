import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { dashboardTheme } from '../../constants/dashboardTheme';

const DashboardCard = ({ 
  title, 
  subtitle, 
  children, 
  action,
  elevation = 2,
  gradient,
  minHeight = 200,
  sx = {}
}) => {
  return (
    <Card 
      elevation={elevation}
      sx={{
        borderRadius: dashboardTheme.borderRadius.lg,
        minHeight,
        background: gradient || dashboardTheme.colors.surface,
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)'
        },
        ...sx
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: gradient ? dashboardTheme.colors.text.white : dashboardTheme.colors.text.primary,
                mb: 0.5
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: gradient ? 'rgba(255,255,255,0.8)' : dashboardTheme.colors.text.secondary 
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {action && (
            <IconButton size="small" sx={{ color: gradient ? 'white' : 'inherit' }}>
              {action || <MoreVertIcon />}
            </IconButton>
          )}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
