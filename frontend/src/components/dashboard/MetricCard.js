import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveIcon from '@mui/icons-material/Remove';
import { dashboardTheme } from '../../constants/dashboardTheme';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'increase', 
  icon: Icon,
  color = dashboardTheme.colors.primary,
  subtitle
}) => {
  const getTrendIcon = () => {
    switch (changeType) {
      case 'increase': return <TrendingUpIcon fontSize="small" />;
      case 'decrease': return <TrendingDownIcon fontSize="small" />;
      default: return <RemoveIcon fontSize="small" />;
    }
  };

  const getTrendColor = () => {
    switch (changeType) {
      case 'increase': return dashboardTheme.colors.success;
      case 'decrease': return dashboardTheme.colors.error;
      default: return dashboardTheme.colors.text.secondary;
    }
  };

  return (
    <Card 
      elevation={2}
      sx={{
        borderRadius: dashboardTheme.borderRadius.lg,
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          {Icon && (
            <Box 
              sx={{ 
                backgroundColor: `${color}15`,
                borderRadius: dashboardTheme.borderRadius.md,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon sx={{ color, fontSize: 24 }} />
            </Box>
          )}
        </Box>
        
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: dashboardTheme.colors.text.primary }}>
          {value}
        </Typography>
        
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {subtitle}
          </Typography>
        )}
        
        {change && (
          <Chip
            icon={getTrendIcon()}
            label={change}
            size="small"
            sx={{
              backgroundColor: `${getTrendColor()}15`,
              color: getTrendColor(),
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24,
              '& .MuiChip-icon': {
                color: getTrendColor()
              }
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
