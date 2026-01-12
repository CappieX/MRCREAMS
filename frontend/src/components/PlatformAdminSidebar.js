import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Badge,
  Collapse,
  ListSubheader
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  HealthAndSafety as HealthIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
  BarChart as MetricsIcon,
  Flag as FlagIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  Warning as WarningIcon,
  Work as WorkIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const PlatformAdminSidebar = ({ open, onClose, variant = 'persistent' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState({ platform: true, observability: true, governance: true, management: true, analytics: true, notifications: true });
  const [badges, setBadges] = useState({ alerts: 0, logs: 0 });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const fetchBadges = async () => {
      try {
        const logsRes = await fetch('/api/platform/audit-logs?limit=10', { headers: { Authorization: `Bearer ${token}` } });
        const logs = await logsRes.json();
        const alertCount = Array.isArray(logs) ? logs.filter(l => l.severity === 'critical' || l.action === 'ALERT').length : 0;
        setBadges({ alerts: alertCount, logs: Array.isArray(logs) ? logs.length : 0 });
      } catch (_) {}
    };
    fetchBadges();
  }, []);

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
      
      <List
        sx={{ px: 1, py: 2 }}
        subheader={<ListSubheader sx={{ bgcolor: 'transparent' }}>Platform</ListSubheader>}
      >
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => setExpanded(prev => ({ ...prev, platform: !prev.platform }))}
            sx={{ borderRadius: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <Collapse in={expanded.platform}>
          <List disablePadding>
            <ListItem disablePadding sx={{ mb: 0.5, ml: 2 }}>
              <ListItemButton onClick={() => handleNavigation('/dashboard/platform-admin')} selected={isActive('/dashboard/platform-admin')} sx={{ borderRadius: 1 }}>
                <ListItemIcon sx={{ minWidth: 40, color: isActive('/dashboard/platform-admin') ? 'inherit' : 'text.secondary' }}>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText primary="Overview" primaryTypographyProps={{ fontWeight: isActive('/dashboard/platform-admin') ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 0.5, ml: 2 }}>
              <ListItemButton onClick={() => handleNavigation('/dashboard/platform-admin/config')} selected={isActive('/dashboard/platform-admin/config')} sx={{ borderRadius: 1 }}>
                <ListItemIcon sx={{ minWidth: 40, color: isActive('/dashboard/platform-admin/config') ? 'inherit' : 'text.secondary' }}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Configuration" primaryTypographyProps={{ fontWeight: isActive('/dashboard/platform-admin/config') ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>

      <Divider />

      <List sx={{ px: 1, py: 2 }} subheader={<ListSubheader sx={{ bgcolor: 'transparent' }}>Management</ListSubheader>}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton onClick={() => setExpanded(prev => ({ ...prev, management: !prev.management }))} sx={{ borderRadius: 1 }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users & Conflicts" />
          </ListItemButton>
        </ListItem>
        <Collapse in={expanded.management}>
          <List disablePadding>
            <ListItem disablePadding sx={{ mb: 0.5, ml: 2 }}>
              <ListItemButton onClick={() => handleNavigation('/dashboard/platform-admin/users')} selected={isActive('/dashboard/platform-admin/users')} sx={{ borderRadius: 1 }}>
                <ListItemIcon sx={{ minWidth: 40, color: isActive('/dashboard/platform-admin/users') ? 'inherit' : 'text.secondary' }}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="User Management" primaryTypographyProps={{ fontWeight: isActive('/dashboard/platform-admin/users') ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 0.5, ml: 2 }}>
              <ListItemButton onClick={() => handleNavigation('/dashboard/platform-admin/conflicts')} selected={isActive('/dashboard/platform-admin/conflicts')} sx={{ borderRadius: 1 }}>
                <ListItemIcon sx={{ minWidth: 40, color: isActive('/dashboard/platform-admin/conflicts') ? 'inherit' : 'text.secondary' }}>
                  <WarningIcon />
                </ListItemIcon>
                <ListItemText primary="Conflicts Admin" primaryTypographyProps={{ fontWeight: isActive('/dashboard/platform-admin/conflicts') ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 0.5, ml: 2 }}>
              <ListItemButton onClick={() => handleNavigation('/dashboard/platform-admin/professionals')} selected={isActive('/dashboard/platform-admin/professionals')} sx={{ borderRadius: 1 }}>
                <ListItemIcon sx={{ minWidth: 40, color: isActive('/dashboard/platform-admin/professionals') ? 'inherit' : 'text.secondary' }}>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText primary="Professionals" primaryTypographyProps={{ fontWeight: isActive('/dashboard/platform-admin/professionals') ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>

      <Divider />

      <List
        sx={{ px: 1, py: 2 }}
        subheader={<ListSubheader sx={{ bgcolor: 'transparent' }}>Observability</ListSubheader>}
      >
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton onClick={() => setExpanded(prev => ({ ...prev, observability: !prev.observability }))} sx={{ borderRadius: 1 }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              <MetricsIcon />
            </ListItemIcon>
            <ListItemText primary="Logs & Metrics" />
          </ListItemButton>
        </ListItem>
        <Collapse in={expanded.observability}>
          <List disablePadding>
            <ListItem disablePadding sx={{ mb: 0.5, ml: 2 }}>
              <ListItemButton onClick={() => handleNavigation('/dashboard/platform-admin/health')} selected={isActive('/dashboard/platform-admin/health')} sx={{ borderRadius: 1 }}>
                <ListItemIcon sx={{ minWidth: 40, color: isActive('/dashboard/platform-admin/health') ? 'inherit' : 'text.secondary' }}>
                  <HealthIcon />
                </ListItemIcon>
                <ListItemText primary="System Health" primaryTypographyProps={{ fontWeight: isActive('/dashboard/platform-admin/health') ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 0.5, ml: 2 }}>
              <ListItemButton onClick={() => handleNavigation('/dashboard/platform-admin/logs')} selected={isActive('/dashboard/platform-admin/logs')} sx={{ borderRadius: 1 }}>
                <ListItemIcon sx={{ minWidth: 40, color: isActive('/dashboard/platform-admin/logs') ? 'inherit' : 'text.secondary' }}>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText primary="Audit Logs" primaryTypographyProps={{ fontWeight: isActive('/dashboard/platform-admin/logs') ? 600 : 400 }} />
                <Badge color="error" badgeContent={badges.logs} sx={{ '& .MuiBadge-badge': { right: 16 } }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>

      <Divider />

      <List sx={{ px: 1, py: 2 }} subheader={<ListSubheader sx={{ bgcolor: 'transparent' }}>Analytics</ListSubheader>}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton onClick={() => setExpanded(prev => ({ ...prev, analytics: !prev.analytics }))} sx={{ borderRadius: 1 }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              <MetricsIcon />
            </ListItemIcon>
            <ListItemText primary="Analytics Hub" />
          </ListItemButton>
        </ListItem>
        <Collapse in={expanded.analytics}>
          <List disablePadding>
            <ListItem disablePadding sx={{ mb: 0.5, ml: 2 }}>
              <ListItemButton onClick={() => handleNavigation('/dashboard/platform-admin/analytics')} selected={isActive('/dashboard/platform-admin/analytics')} sx={{ borderRadius: 1 }}>
                <ListItemIcon sx={{ minWidth: 40, color: isActive('/dashboard/platform-admin/analytics') ? 'inherit' : 'text.secondary' }}>
                  <MetricsIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" primaryTypographyProps={{ fontWeight: isActive('/dashboard/platform-admin/analytics') ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>

      <Divider />

      <List
        sx={{ px: 1, py: 2 }}
        subheader={<ListSubheader sx={{ bgcolor: 'transparent' }}>Audit & Security</ListSubheader>}
      >
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton onClick={() => setExpanded(prev => ({ ...prev, governance: !prev.governance }))} sx={{ borderRadius: 1 }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText primary="Security" />
            <Badge color="warning" badgeContent={badges.alerts} />
          </ListItemButton>
        </ListItem>
        <Collapse in={expanded.governance}>
          <List disablePadding>
            <ListItem disablePadding sx={{ mb: 0.5, ml: 2 }}>
              <ListItemButton onClick={() => handleNavigation('/dashboard/platform-admin/config')} selected={isActive('/dashboard/platform-admin/config')} sx={{ borderRadius: 1 }}>
                <ListItemIcon sx={{ minWidth: 40, color: isActive('/dashboard/platform-admin/config') ? 'inherit' : 'text.secondary' }}>
                  <FlagIcon />
                </ListItemIcon>
                <ListItemText primary="Feature Flags" primaryTypographyProps={{ fontWeight: isActive('/dashboard/platform-admin/config') ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>

      <Divider />

      <List sx={{ px: 1, py: 2 }} subheader={<ListSubheader sx={{ bgcolor: 'transparent' }}>Notifications</ListSubheader>}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton onClick={() => setExpanded(prev => ({ ...prev, notifications: !prev.notifications }))} sx={{ borderRadius: 1 }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="Notification Center" />
          </ListItemButton>
        </ListItem>
        <Collapse in={expanded.notifications}>
          <List disablePadding>
            <ListItem disablePadding sx={{ mb: 0.5, ml: 2 }}>
              <ListItemButton onClick={() => handleNavigation('/dashboard/platform-admin/notifications')} selected={isActive('/dashboard/platform-admin/notifications')} sx={{ borderRadius: 1 }}>
                <ListItemIcon sx={{ minWidth: 40, color: isActive('/dashboard/platform-admin/notifications') ? 'inherit' : 'text.secondary' }}>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText primary="Center" primaryTypographyProps={{ fontWeight: isActive('/dashboard/platform-admin/notifications') ? 600 : 400 }} />
                <Badge color="error" badgeContent={badges.alerts} sx={{ '& .MuiBadge-badge': { right: 16 } }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default PlatformAdminSidebar;
