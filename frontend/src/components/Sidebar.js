import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  List as ListIcon,
  Add as AddIcon,
  BarChart as BarChartIcon,
  Lightbulb as LightbulbIcon,
  Mood as MoodIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: 8,
        },
      }}
    >
      <List>
        <ListItem button component={RouterLink} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        
        <ListItem button component={RouterLink} to="/harmony-hub">
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="Harmony Tracker" />
        </ListItem>
        
    <ListItem button component={RouterLink} to="/emotion-checkin">
      <ListItemIcon>
        <MoodIcon />
      </ListItemIcon>
      <ListItemText primary="Emotion Check-in" />
    </ListItem>

    <ListItem button component={RouterLink} to="/conflict-input">
      <ListItemIcon>
        <AddIcon />
      </ListItemIcon>
      <ListItemText primary="Share Challenge" />
    </ListItem>
      </List>
      
      <Divider />
      
      <List>
        <ListItem button component={RouterLink} to="/emotion-insights">
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Emotion Insights" />
        </ListItem>
        
        <ListItem button component={RouterLink} to="/harmony-guidance">
          <ListItemIcon>
            <LightbulbIcon />
          </ListItemIcon>
          <ListItemText primary="Harmony Guidance" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;