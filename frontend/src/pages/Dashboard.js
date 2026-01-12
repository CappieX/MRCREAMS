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
import SubscriptionSection from '../components/subscription/SubscriptionSection';

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
  const [metadata, setMetadata] = useState({});
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        // Get user profile with metadata for personalization
        try {
          const meRes = await axios.get('/api/auth/me', config);
          const meUser = meRes.data?.user || {};
          const meta = meUser.metadata || {};
          setMetadata(meta);
          setTips(derivePersonalizedTips(meta));
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
        }
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

  const derivePersonalizedTips = (meta) => {
    const rc = meta?.relationshipContext || {};
    const gp = meta?.goalsPreferences || {};
    const goals = Array.isArray(gp?.goals) ? gp.goals : [];
    const tipsList = [];

    if (rc?.status === 'cohabiting' || rc?.status === 'newly_married') {
      tipsList.push({
        primary: 'Set shared routines',
        secondary: 'Align chores and schedules to reduce friction'
      });
      tipsList.push({
        primary: 'Weekly check-in',
        secondary: 'Create a 30-min ritual to reflect and adjust'
      });
    }

    if (rc?.hasChildren) {
      tipsList.push({
        primary: 'Clarify parenting roles',
        secondary: 'Define responsibilities to avoid role conflict'
      });
    }

    if (goals.includes('communication')) {
      tipsList.push({
        primary: 'Practice active listening',
        secondary: 'Summarize and validate before responding'
      });
    }

    if (goals.includes('conflict-resolution')) {
      tipsList.push({
        primary: 'Use timeouts wisely',
        secondary: 'Pause when escalated; resume with a plan'
      });
    }

    if (goals.includes('financial-harmony')) {
      tipsList.push({
        primary: 'Budget together',
        secondary: 'Monthly finance review to build trust'
      });
    }

    if (tipsList.length === 0) {
      return [
        { primary: 'Listen actively', secondary: 'Focus on understanding before responding' },
        { primary: "Use 'I' statements", secondary: 'Express feelings without blaming' },
        { primary: 'Take breaks when needed', secondary: 'Step away if emotions get too intense' },
        { primary: 'Focus on the issue', secondary: 'Avoid bringing up past conflicts' }
      ];
    }
    return tipsList.slice(0, 6);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <SubscriptionSection />
      </Box>
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
            <Chip label={(user?.userType || user?.user_type || 'individual').replace('_',' ').toUpperCase()} color="secondary" variant="outlined" />
            {user?.onboardingCompleted && <Chip label="Onboarding Complete" color="success" />}
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<PsychologyIcon />}
          component={Link}
          to="/emotion-checkin"
          sx={{ borderRadius: 2 }}
        >
          Emotion Check-in
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          component={Link}
          to="/harmony-hub/new"
          sx={{ borderRadius: 2 }}
        >
          Share Challenge
        </Button>
        <Button
          variant="outlined"
          startIcon={<InsightsIcon />}
          component={Link}
          to="/emotion-insights"
          sx={{ borderRadius: 2 }}
        >
          Emotion Insights
        </Button>
        <Button
          variant="outlined"
          startIcon={<PsychologyIcon />}
          component={Link}
          to="/harmony-guidance"
          sx={{ borderRadius: 2 }}
        >
          Harmony Guidance
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
          <StyledCard title="Tailored Tips" icon={<PsychologyIcon />}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <List>
                {tips.map((t, idx) => (
                  <React.Fragment key={`${t.primary}-${idx}`}>
                    <ListItem>
                      <ListItemText primary={t.primary} secondary={t.secondary} />
                    </ListItem>
                    {idx < tips.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
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
