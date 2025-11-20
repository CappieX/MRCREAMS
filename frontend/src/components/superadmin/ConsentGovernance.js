import React, { useState } from 'react';
import {
  Box, Typography, Grid, Chip, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tabs, Tab, Alert, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField
} from '@mui/material';
import {
  Gavel as GavelIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import DashboardCard from '../dashboard/DashboardCard';
import StatusIndicator from '../dashboard/StatusIndicator';
import { dashboardTheme } from '../../constants/dashboardTheme';

const ConsentGovernance = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [purgeDialog, setPurgeDialog] = useState(false);

  const consentTemplates = [
    { 
      id: 1, 
      type: 'Primary Consent', 
      version: 'v3.2', 
      effective: '2024-01-01', 
      users: 12458,
      status: 'active',
      changes: 'Initial consent for platform use'
    },
    { 
      id: 2, 
      type: 'Research Consent', 
      version: 'v2.1', 
      effective: '2024-01-15', 
      users: 8742,
      status: 'active',
      changes: 'Anonymous data for research purposes'
    },
    { 
      id: 3, 
      type: 'Emergency Access', 
      version: 'v1.5', 
      effective: '2023-12-01', 
      users: 345,
      status: 'active',
      changes: 'Crisis intervention data sharing'
    }
  ];

  const versionHistory = [
    { version: 'v3.1', changes: 'Data retention clarification', retired: '2023-12-31', users: 11234 },
    { version: 'v3.0', changes: 'GDPR compliance updates', retired: '2023-11-15', users: 10892 },
    { version: 'v2.9', changes: 'Third-party sharing policy', retired: '2023-10-01', users: 9654 }
  ];

  const dataClassification = [
    { 
      category: 'PII', 
      examples: 'Name, Email, Phone', 
      retention: '7 years', 
      encryption: 'AES-256',
      count: 12458
    },
    { 
      category: 'Sensitive', 
      examples: 'Emotional scores, Session transcripts', 
      retention: '10 years', 
      encryption: 'AES-256-GCM',
      count: 45892
    },
    { 
      category: 'Health Data', 
      examples: 'Therapy notes, Medical history', 
      retention: '15 years', 
      encryption: 'AES-256-GCM+HMAC',
      count: 23456
    }
  ];

  const retentionPolicies = [
    { 
      dataType: 'Session Data', 
      active: '7 years', 
      archived: '3 years', 
      purged: '10 years',
      compliance: 'HIPAA'
    },
    { 
      dataType: 'User Profiles', 
      active: '5 years', 
      archived: '2 years (anonymized)', 
      purged: '7 years',
      compliance: 'GDPR'
    },
    { 
      dataType: 'Model Training Data', 
      active: 'Indefinitely', 
      archived: 'Anonymized', 
      purged: 'Never',
      compliance: 'Research Ethics'
    }
  ];

  const purgeQueue = [
    { id: 1, type: 'Retention Expired', count: 234, scheduled: '2024-01-20 03:00 AM', status: 'pending' },
    { id: 2, type: 'Consent Withdrawn', count: 12, scheduled: '2024-01-19 03:00 AM', status: 'pending' },
    { id: 3, type: 'User Deleted', count: 8, scheduled: '2024-01-19 03:00 AM', status: 'pending' }
  ];

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <GavelIcon sx={{ fontSize: 32, color: dashboardTheme.colors.chart.blue }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Consent & Data Governance
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<EditIcon />}
          sx={{ textTransform: 'none', background: dashboardTheme.colors.chart.blue }}
        >
          New Consent Template
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Consent Templates" />
        <Tab label="Data Classification" />
        <Tab label="Retention Policies" />
        <Tab label="Purge Management" />
      </Tabs>

      {/* Tab 0: Consent Templates */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DashboardCard title="Active Consent Templates" subtitle="Current versions in use">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Version</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Effective Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Active Users</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {consentTemplates.map((template) => (
                      <TableRow key={template.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {template.type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={template.version} size="small" color="primary" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{template.effective}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {template.users.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusIndicator status="success" label={template.status} size="small" />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Template">
                              <IconButton size="small">
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Template">
                              <IconButton size="small">
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Version History">
                              <IconButton size="small">
                                <HistoryIcon fontSize="small" />
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

          <Grid item xs={12}>
            <DashboardCard title="Version History" subtitle="Retired consent templates">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Version</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Changes</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Retired Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Affected Users</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {versionHistory.map((version, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Chip label={version.version} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{version.changes}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{version.retired}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{version.users.toLocaleString()}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DashboardCard>
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info" icon={<CheckCircleIcon />}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Audit Trail: All consent changes logged
              </Typography>
              <Typography variant="caption">
                Approval required for all template modifications • Rollback capability enabled
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Data Classification */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DashboardCard title="Data Classification Levels" subtitle="Sensitivity & protection requirements">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Examples</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Retention Period</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Encryption</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Record Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataClassification.map((data, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Chip 
                            label={data.category} 
                            size="small"
                            sx={{ 
                              backgroundColor: data.category === 'Health Data' ? '#ffebee' : data.category === 'Sensitive' ? '#fff3e0' : '#e3f2fd',
                              color: data.category === 'Health Data' ? '#c62828' : data.category === 'Sensitive' ? '#f57c00' : '#1565c0',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{data.examples}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {data.retention}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={data.encryption} size="small" color="success" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{data.count.toLocaleString()}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <DashboardCard title="Automated Labeling">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Classification Accuracy</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: dashboardTheme.colors.success, my: 1 }}>
                    96.8%
                  </Typography>
                  <Chip label="Excellent Performance" size="small" color="success" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Manual Review Rate</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                    2.1%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Required for health data classification
                  </Typography>
                </Box>
              </Box>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <DashboardCard title="Encryption Coverage">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Alert severity="success">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    100% Encryption Coverage
                  </Typography>
                  <Typography variant="caption">
                    All data encrypted at rest and in transit
                  </Typography>
                </Alert>
                <Alert severity="info">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Key Rotation: Every 90 days
                  </Typography>
                  <Typography variant="caption">
                    Last rotation: January 10, 2024
                  </Typography>
                </Alert>
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>
      )}

      {/* Tab 2: Retention Policies */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DashboardCard title="Data Retention Policies" subtitle="Lifecycle management rules">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Data Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Active Period</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Archived Period</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Purge After</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Compliance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {retentionPolicies.map((policy, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {policy.dataType}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{policy.active}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{policy.archived}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {policy.purged}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={policy.compliance} size="small" color="primary" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DashboardCard>
          </Grid>

          <Grid item xs={12}>
            <DashboardCard title="Compliance Requirements">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Alert severity="success">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>GDPR Compliance</Typography>
                    <Typography variant="caption">Right to erasure: Automated (30 days)</Typography>
                  </Alert>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Alert severity="success">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>HIPAA Compliance</Typography>
                    <Typography variant="caption">Retention: 6 years minimum</Typography>
                  </Alert>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Alert severity="success">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>CCPA Compliance</Typography>
                    <Typography variant="caption">Opt-out: Automated processing</Typography>
                  </Alert>
                </Grid>
              </Grid>
            </DashboardCard>
          </Grid>
        </Grid>
      )}

      {/* Tab 3: Purge Management */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DashboardCard title="Scheduled Purge Operations" subtitle="Automated data deletion queue">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Purge Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Record Count</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Scheduled Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purgeQueue.map((purge) => (
                      <TableRow key={purge.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {purge.type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={purge.count} size="small" color="warning" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{purge.scheduled}</Typography>
                        </TableCell>
                        <TableCell>
                          <StatusIndicator status="warning" label={purge.status} size="small" />
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setPurgeDialog(true)}
                          >
                            Execute Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DashboardCard>
          </Grid>

          <Grid item xs={12}>
            <Alert severity="warning" icon={<SecurityIcon />}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Two-Person Approval Required for Manual Purge
              </Typography>
              <Typography variant="caption">
                All manual purge operations require approval from Privacy Officer and Legal Counsel • Backup retained for 30 days
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      )}

      {/* Purge Confirmation Dialog */}
      <Dialog open={purgeDialog} onClose={() => setPurgeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Data Purge Operation</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              WARNING: This action cannot be undone
            </Typography>
            <Typography variant="caption">
              Two-person approval required • Backup will be retained for 30 days
            </Typography>
          </Alert>
          <TextField
            fullWidth
            label="Justification (Required)"
            multiline
            rows={3}
            sx={{ mt: 2 }}
            placeholder="Enter reason for manual purge operation..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPurgeDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error">
            Request Approval
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsentGovernance;
