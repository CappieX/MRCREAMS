import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  HealthAndSafety as HealthIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const PlatformAdminSidebar = ({ open, onClose, variant = 'persistent' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: DashboardIcon, path: '/dashboard/platform-admin' },
    { text: 'System Health', icon: HealthIcon, path: '/dashboard/platform-admin/health' },
    { text: 'Audit Logs', icon: HistoryIcon, path: '/dashboard/platform-admin/logs' },
    { text: 'Configuration', icon: SettingsIcon, path: '/dashboard/platform-admin/config' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (variant === 'temporary') {
      onClose();
    }
  };

  const isActive = (path) => {
    if (path === '/dashboard/platform-admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
          <SettingsIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Box>
            <Box sx={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.2 }}>
              MR.CREAMS
            </Box>
            <Box sx={{ fontSize: '12px', color: 'text.secondary', lineHeight: 1 }}>
              Platform Admin
            </Box>
          </Box>
        </Box>
      </Toolbar>
      
      <Divider />
      
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive(item.path) ? 'inherit' : 'text.secondary' }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive(item.path) ? 600 : 400 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default PlatformAdminSidebar;
