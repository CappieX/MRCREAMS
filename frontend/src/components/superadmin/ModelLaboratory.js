import React, { useState } from 'react';
import {
  Box, Typography, Grid, Chip, Button, LinearProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tabs, Tab, Alert, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Science as ScienceIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  PlayArrow as DeployIcon,
  Stop as RollbackIcon,
  Assessment as MetricsIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend } from 'recharts';
import DashboardCard from '../dashboard/DashboardCard';
import StatusIndicator from '../dashboard/StatusIndicator';
import { dashboardTheme } from '../../constants/dashboardTheme';

const ModelLaboratory = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [deployDialog, setDeployDialog] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  const activeModels = [
    { 
      id: 1, 
      name: 'Emotion Analysis', 
      version: 'v2.3.1', 
      accuracy: 94.2, 
      deployed: true,
      status: 'healthy',
      trainingData: '2.4M sessions',
      lastUpdated: '2024-01-15',
      biasScore: 0.02,
      ethicsReview: 'passed'
    },
    { 
      id: 2, 
      name: 'Conflict Resolution', 
      version: 'v1.8.2', 
      accuracy: 88.7, 
      deployed: true,
      status: 'healthy',
      trainingData: '1.8M sessions',
      lastUpdated: '2024-01-10',
      biasScore: 0.03,
      ethicsReview: 'passed'
    },
    { 
      id: 3, 
      name: 'Sentiment Tracking', 
      version: 'v3.0.0-rc1', 
      accuracy: 91.5, 
      deployed: false,
      status: 'testing',
      trainingData: '3.1M sessions',
      lastUpdated: '2024-01-18',
      biasScore: 0.01,
      ethicsReview: 'pending'
    }
  ];

  const performanceData = [
    { date: 'Jan 1', accuracy: 93.5, precision: 92.1, recall: 91.8 },
    { date: 'Jan 5', accuracy: 93.8, precision: 92.5, recall: 92.2 },
    { date: 'Jan 10', accuracy: 94.0, precision: 93.0, recall: 92.5 },
    { date: 'Jan 15', accuracy: 94.2, precision: 93.5, recall: 92.8 },
    { date: 'Jan 18', accuracy: 94.1, precision: 93.4, recall: 92.7 }
  ];

  const abTestCandidates = [
    { 
      model: 'emotion_v2.4.0', 
      performance: '+3.2%', 
      confidence: 'high',
      trafficSplit: '10%',
      status: 'active',
      duration: '5 days remaining'
    },
    { 
      model: 'conflict_v2.0.0', 
      performance: '+5.1%', 
      confidence: 'medium',
      trafficSplit: '15%',
      status: 'active',
      duration: '3 days remaining'
    }
  ];

  const humanReviewQueue = [
    { id: 1, type: 'Low Confidence', count: 47, avgTime: '2.3h', sla: '4h', status: 'on-track' },
    { id: 2, type: 'Flagged Content', count: 12, avgTime: '1.8h', sla: '2h', status: 'on-track' },
    { id: 3, type: 'Therapist Feedback', count: 23, avgTime: '3.1h', sla: '6h', status: 'warning' }
  ];

  const handleDeploy = (model) => {
    setSelectedModel(model);
    setDeployDialog(true);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ScienceIcon sx={{ fontSize: 32, color: dashboardTheme.colors.chart.purple }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            ML Model Laboratory
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          sx={{ textTransform: 'none' }}
        >
          Refresh Models
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Model Registry" />
        <Tab label="Performance Monitoring" />
        <Tab label="A/B Testing" />
        <Tab label="Human Review Queue" />
      </Tabs>

      {/* Tab 0: Model Registry */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DashboardCard title="Active Models" subtitle="Production & testing models">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Model</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Version</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Accuracy</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Training Data</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Bias Score</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Ethics Review</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeModels.map((model) => (
                      <TableRow key={model.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {model.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={model.version} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={model.accuracy} 
                              sx={{ width: 80, height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {model.accuracy}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <StatusIndicator 
                            status={model.deployed ? 'success' : 'warning'} 
                            label={model.deployed ? 'Deployed' : 'Testing'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{model.trainingData}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={model.biasScore} 
                            size="small"
                            sx={{ 
                              backgroundColor: model.biasScore < 0.05 ? '#e8f5e9' : '#fff3e0',
                              color: model.biasScore < 0.05 ? '#2e7d32' : '#f57c00',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={model.ethicsReview} 
                            size="small"
                            color={model.ethicsReview === 'passed' ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {!model.deployed && (
                              <Tooltip title="Deploy Model">
                                <IconButton size="small" onClick={() => handleDeploy(model)}>
                                  <DeployIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="View Metrics">
                              <IconButton size="small">
                                <MetricsIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <DashboardCard title="Model Governance" subtitle="Compliance & safety controls">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Alert severity="success" icon={<CheckCircleIcon />}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    All models passed ethics review
                  </Typography>
                  <Typography variant="caption">
                    Last audit: January 15, 2024
                  </Typography>
                </Alert>
                <Alert severity="info" icon={<SecurityIcon />}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Bias monitoring active
                  </Typography>
                  <Typography variant="caption">
                    Average bias score: 0.02 (Excellent)
                  </Typography>
                </Alert>
                <Alert severity="warning" icon={<WarningIcon />}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    1 model pending ethics review
                  </Typography>
                  <Typography variant="caption">
                    Sentiment Tracking v3.0.0-rc1 awaiting approval
                  </Typography>
                </Alert>
              </Box>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <DashboardCard title="Deployment Protocol" subtitle="Rollback & safety measures">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Automated Rollback Triggers:
                  </Typography>
                  <Chip label="Accuracy drop > 5%" size="small" sx={{ mr: 1, mb: 1 }} />
                  <Chip label="Latency increase > 2x" size="small" sx={{ mr: 1, mb: 1 }} />
                  <Chip label="Error rate > 3%" size="small" sx={{ mb: 1 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Time to Rollback: <span style={{ color: dashboardTheme.colors.success }}>{'< 2 minutes'}</span>
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Shadow Deployment: <span style={{ color: dashboardTheme.colors.chart.teal }}>15% traffic</span>
                  </Typography>
                </Box>
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Performance Monitoring */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DashboardCard title="Model Performance Trends" subtitle="Last 30 days">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke={dashboardTheme.colors.text.secondary} />
                  <YAxis stroke={dashboardTheme.colors.text.secondary} domain={[85, 100]} />
                  <ChartTooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke={dashboardTheme.colors.chart.blue} 
                    strokeWidth={3}
                    name="Accuracy %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="precision" 
                    stroke={dashboardTheme.colors.chart.purple} 
                    strokeWidth={2}
                    name="Precision %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recall" 
                    stroke={dashboardTheme.colors.chart.teal} 
                    strokeWidth={2}
                    name="Recall %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <DashboardCard title="Confidence Distribution">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">High Confidence</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>68%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={68} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Medium Confidence</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>25%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={25} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Low Confidence</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>7%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={7} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
              </Box>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <DashboardCard title="Error Analysis">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">False Positives</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: dashboardTheme.colors.chart.orange }}>
                    2.3%
                  </Typography>
                  <Chip label="Improving" size="small" color="success" sx={{ mt: 1 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">False Negatives</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: dashboardTheme.colors.chart.blue }}>
                    1.8%
                  </Typography>
                  <Chip label="Stable" size="small" sx={{ mt: 1 }} />
                </Box>
              </Box>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <DashboardCard title="Model Drift Detection">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Alert severity="success">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    No concept drift detected
                  </Typography>
                  <Typography variant="caption">
                    Last check: Jan 15, 2024
                  </Typography>
                </Alert>
                <Alert severity="warning">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Data drift: 3.2%
                  </Typography>
                  <Typography variant="caption">
                    Action: Monitoring
                  </Typography>
                </Alert>
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>
      )}

      {/* Tab 2: A/B Testing */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DashboardCard title="Active A/B Tests" subtitle="Model comparison experiments">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Model Candidate</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Performance Improvement</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Confidence</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Traffic Split</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {abTestCandidates.map((test, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {test.model}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={test.performance} 
                            size="small"
                            sx={{ 
                              backgroundColor: '#e8f5e9',
                              color: '#2e7d32',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={test.confidence} 
                            size="small"
                            color={test.confidence === 'high' ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{test.trafficSplit}</Typography>
                        </TableCell>
                        <TableCell>
                          <StatusIndicator status="success" label={test.status} size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{test.duration}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DashboardCard>
          </Grid>
        </Grid>
      )}

      {/* Tab 3: Human Review Queue */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DashboardCard title="Human-in-the-Loop Review Queue" subtitle="Quality control & feedback">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Review Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Queue Count</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Avg Response Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>SLA</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {humanReviewQueue.map((queue) => (
                      <TableRow key={queue.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {queue.type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={queue.count} size="small" color="primary" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{queue.avgTime}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{queue.sla}</Typography>
                        </TableCell>
                        <TableCell>
                          <StatusIndicator 
                            status={queue.status === 'on-track' ? 'success' : 'warning'} 
                            label={queue.status}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DashboardCard>
          </Grid>

          <Grid item xs={12}>
            <DashboardCard title="Quality Control Metrics">
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="body2" color="text.secondary">Inter-Rater Reliability</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: dashboardTheme.colors.success, my: 1 }}>
                      92%
                    </Typography>
                    <Chip label="Excellent" size="small" color="success" />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="body2" color="text.secondary">Therapist Feedback</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: dashboardTheme.colors.chart.teal, my: 1 }}>
                      89%
                    </Typography>
                    <Chip label="Positive" size="small" color="success" />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="body2" color="text.secondary">Suggestions Implemented</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: dashboardTheme.colors.chart.blue, my: 1 }}>
                      18/23
                    </Typography>
                    <Chip label="78% Rate" size="small" color="info" />
                  </Box>
                </Grid>
              </Grid>
            </DashboardCard>
          </Grid>
        </Grid>
      )}

      {/* Deploy Dialog */}
      <Dialog open={deployDialog} onClose={() => setDeployDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Deploy Model to Production</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Two-Person Approval Required
            </Typography>
            <Typography variant="caption">
              This action requires approval from ML Lead and Security Officer
            </Typography>
          </Alert>
          {selectedModel && (
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Model:</strong> {selectedModel.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Version:</strong> {selectedModel.version}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Accuracy:</strong> {selectedModel.accuracy}%
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Ethics Review:</strong> {selectedModel.ethicsReview}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeployDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary">
            Request Approval
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModelLaboratory;
