import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { dashboardTheme } from '../../constants/dashboardTheme';

const StatusIndicator = ({ status, label, size = 'medium', showIcon = true }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
      case 'healthy':
      case 'active':
      case 'online':
        return {
          color: dashboardTheme.colors.success,
          icon: CheckCircleIcon,
          label: label || 'Healthy'
        };
      case 'warning':
      case 'degraded':
        return {
          color: dashboardTheme.colors.warning,
          icon: WarningIcon,
          label: label || 'Warning'
        };
      case 'error':
      case 'critical':
      case 'offline':
        return {
          color: dashboardTheme.colors.error,
          icon: ErrorIcon,
          label: label || 'Critical'
        };
      case 'info':
      case 'pending':
        return {
          color: dashboardTheme.colors.info,
          icon: InfoIcon,
          label: label || 'Info'
        };
      default:
        return {
          color: dashboardTheme.colors.text.secondary,
          icon: InfoIcon,
          label: label || 'Unknown'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Chip
      icon={showIcon ? <Icon /> : undefined}
      label={config.label}
      size={size}
      sx={{
        backgroundColor: `${config.color}15`,
        color: config.color,
        fontWeight: 600,
        '& .MuiChip-icon': {
          color: config.color
        }
      }}
    />
  );
};

export const StatusDot = ({ status, size = 12 }) => {
  const getColor = () => {
    switch (status) {
      case 'success':
      case 'healthy':
      case 'active':
        return dashboardTheme.colors.success;
      case 'warning':
      case 'degraded':
        return dashboardTheme.colors.warning;
      case 'error':
      case 'critical':
        return dashboardTheme.colors.error;
      default:
        return dashboardTheme.colors.text.secondary;
    }
  };

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: getColor(),
        boxShadow: `0 0 0 2px ${getColor()}30`,
        animation: status === 'active' ? 'pulse 2s infinite' : 'none',
        '@keyframes pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        }
      }}
    />
  );
};

export default StatusIndicator;
