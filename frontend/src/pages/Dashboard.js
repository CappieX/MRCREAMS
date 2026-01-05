import React, { useState, useEffect } from 'react';
import { Typography, Grid, Box, Button, Divider, List, ListItem, ListItemText, CircularProgress, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { BarChart as ChartIcon, Add as AddIcon, Insights as InsightsIcon, Psychology as PsychologyIcon } from '@mui/icons-material';
import axios from 'axios';
import StyledCard from '../components/StyledCard';
import EmotionCheckInWidget from '../components/EmotionCheckInWidget';
import EmotionalMapVisualization from '../components/EmotionalMapVisualization';
import HarmonyProgressChart from '../components/HarmonyProgressChart';
import ResolutionRecommendationCard from '../components/ResolutionRecommendationCard';
import ReflectionJournalEntry from '../components/ReflectionJournalEntry';
import LiveEmotionPulse from '../components/LiveEmotionPulse';
import PatternRecognitionInsights from '../components/PatternRecognitionInsights';
import AdvancedRecommendationEngine from '../components/AdvancedRecommendationEngine';
import CoupleCollaborationHub from '../components/CoupleCollaborationHub';
import AdvancedAnalyticsSuite from '../components/AdvancedAnalyticsSuite';
import HarmonyGamificationSystem from '../components/HarmonyGamificationSystem';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalConflicts: 0,
    averageIntensity: 0,
    averageDuration: 0,
    topReason: 'N/A'
  });
  const [summary, setSummary] = useState({
    emotionTrends: { totalCheckins: 0 },
    conflictAnalytics: { totalConflicts: 0, resolutionRate: 0 },
    progressMetrics: { progressScore: 0 },
    behavioralInsights: { insights: [] }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('/api/conflicts', config);
        setConflicts(response.data.slice(0, 5)); // Get only the 5 most recent conflicts
        
        // Calculate stats
        if (response.data.length > 0) {
          const totalConflicts = response.data.length;
          const avgIntensity = response.data.reduce((sum, conflict) => sum + conflict.fight_degree, 0) / totalConflicts;
          const avgDuration = response.data.reduce((sum, conflict) => sum + conflict.time_consumption, 0) / totalConflicts;
          
          // Find most common reason
          const reasonCounts = {};
          response.data.forEach(conflict => {
            reasonCounts[conflict.conflict_reason] = (reasonCounts[conflict.conflict_reason] || 0) + 1;
          });
          
          let topReason = 'N/A';
          let maxCount = 0;
          
          Object.entries(reasonCounts).forEach(([reason, count]) => {
            if (count > maxCount) {
              maxCount = count;
              topReason = reason;
            }
          });
          
          setStats({
            totalConflicts,
            averageIntensity: avgIntensity.toFixed(1),
            averageDuration: Math.round(avgDuration),
            topReason
          });
        }
        // Fetch analytics summary
        try {
          const summaryRes = await axios.get('/api/analytics/dashboard/summary', config);
          const data = summaryRes.data?.data || summaryRes.data || {};
          setSummary({
            emotionTrends: data.emotionTrends || { totalCheckins: 0 },
            conflictAnalytics: data.conflictAnalytics || { totalConflicts: 0, resolutionRate: 0 },
            progressMetrics: data.progressMetrics || { progressScore: 0 },
            behavioralInsights: data.behavioralInsights || { insights: [] }
          });
        } catch (err) {
          console.error('Failed to fetch analytics summary:', err);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="medium">
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome to MR.CREAMS - Smart healing for modern relationships through intelligent conflict analysis and emotional insight.
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label={user?.name || user?.email || 'User'} color="primary" variant="outlined" />
            <Chip label={(user?.user_type || 'individual').replace('_',' ').toUpperCase()} color="secondary" variant="outlined" />
            {user?.onboarding_completed && <Chip label="Onboarding Complete" color="success" />}
          </Box>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/harmony-hub/new"
          sx={{ borderRadius: 2 }}
        >
          Share Challenge
        </Button>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard
            title="Harmony Opportunities"
            icon={<ChartIcon />}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={40} />
              </Box>
            ) : (
              <Typography variant="h3" align="center" sx={{ mt: 2, fontWeight: 'bold' }}>
                {stats.totalConflicts}
              </Typography>
            )}
          </StyledCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard
            title="Emotional Awareness"
            icon={<InsightsIcon />}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={40} />
              </Box>
            ) : (
              <Typography variant="h3" align="center" sx={{ mt: 2, fontWeight: 'bold' }}>
                {stats.averageIntensity}/10
              </Typography>
            )}
          </StyledCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard
            title="Harmony Recovery"
            icon={<InsightsIcon />}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={40} />
              </Box>
            ) : (
              <Typography variant="h3" align="center" sx={{ mt: 2, fontWeight: 'bold' }}>
                {stats.averageDuration} min
              </Typography>
            )}
          </StyledCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard
            title="Growth Opportunity"
            icon={<PsychologyIcon />}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={40} />
              </Box>
            ) : (
              <Typography variant="h6" align="center" sx={{ mt: 2, fontWeight: 'medium' }}>
                {stats.topReason}
              </Typography>
            )}
          </StyledCard>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StyledCard title="Emotion Check-ins">
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <Typography variant="h4" align="center" sx={{ mt: 1, fontWeight: 'bold' }}>
                {summary.emotionTrends.totalCheckins || 0}
              </Typography>
            )}
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StyledCard title="Conflicts Resolved">
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <Typography variant="h4" align="center" sx={{ mt: 1, fontWeight: 'bold' }}>
                {Math.round((summary.conflictAnalytics.resolutionRate || 0) * 100)}%
              </Typography>
            )}
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StyledCard title="Progress Score">
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <Typography variant="h4" align="center" sx={{ mt: 1, fontWeight: 'bold' }}>
                {summary.progressMetrics.progressScore || 0}%
              </Typography>
            )}
          </StyledCard>
        </Grid>
      </Grid>

      {/* Advanced AI-Powered Components */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} lg={6}>
          <LiveEmotionPulse 
            realTimeData={conflicts} 
            onEmotionUpdate={(data) => console.log('Emotion updated:', data)} 
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <PatternRecognitionInsights 
            emotionalData={conflicts} 
            relationshipData={conflicts} 
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <AdvancedRecommendationEngine 
            userProfile={{}} 
            emotionalState={{}} 
            relationshipData={conflicts} 
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} lg={6}>
          <CoupleCollaborationHub 
            coupleData={conflicts} 
            onSyncUpdate={(data) => console.log('Sync update:', data)} 
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <HarmonyGamificationSystem 
            userProgress={conflicts} 
            coupleData={conflicts} 
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <AdvancedAnalyticsSuite 
            analyticsData={conflicts} 
            relationshipMetrics={conflicts} 
          />
        </Grid>
      </Grid>

      {/* Original Emotional Intelligence Components */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} lg={6}>
          <EmotionCheckInWidget onEmotionSubmit={(data) => console.log('Emotion submitted:', data)} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <EmotionalMapVisualization emotionData={conflicts} />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <HarmonyProgressChart progressData={conflicts} />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} lg={8}>
          <ResolutionRecommendationCard recommendations={[]} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <ReflectionJournalEntry onSave={(entry) => console.log('Journal entry saved:', entry)} />
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard title="Recent Harmony Opportunities" icon={<ChartIcon />}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : conflicts.length > 0 ? (
              <List>
                {conflicts.map((conflict, index) => (
                  <React.Fragment key={conflict.id}>
                    <ListItem>
                      <ListItemText
                        primary={conflict.conflict_reason}
                        secondary={
                          <React.Fragment>
                            <Typography component="span" variant="body2" color="text.primary">
                              Intensity: {conflict.fight_degree}/10
                            </Typography>
                            {` — ${conflict.date} (${conflict.time_consumption} min)`}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    {index < conflicts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" sx={{ p: 2 }}>
                No recent challenges recorded. Share your first relationship challenge to begin your harmony journey.
              </Typography>
            )}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button component={Link} to="/harmony-hub" size="small" color="primary">
                View All
              </Button>
            </Box>
          </StyledCard>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledCard title="Quick Tips" icon={<PsychologyIcon />}>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Listen actively"
                  secondary="Focus on understanding before responding"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Use 'I' statements"
                  secondary="Express feelings without blaming"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Take breaks when needed"
                  secondary="Step away if emotions get too intense"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Focus on the issue"
                  secondary="Avoid bringing up past conflicts"
                />
              </ListItem>
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button component={Link} to="/recommendations" size="small" color="primary">
                More Tips
              </Button>
            </Box>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
