import React from 'react';
import {
  Box, Typography, Grid, Alert, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import {
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';
import DashboardCard from '../../components/dashboard/DashboardCard';
import MetricCard from '../../components/dashboard/MetricCard';
import StatusIndicator from '../../components/dashboard/StatusIndicator';
import { dashboardTheme } from '../../constants/dashboardTheme';

const SecurityCenter = () => {
  const securityMetrics = [
    { id: 1, metric: 'GDPR Compliance', status: 'compliant', lastAudit: '2024-01-10', findings: 'None' },
    { id: 2, metric: 'HIPAA Compliance', status: 'compliant', lastAudit: '2024-01-15', findings: 'Minor (2)' },
    { id: 3, metric: 'SOC 2 Type II', status: 'in-progress', lastAudit: '2023-12-20', findings: 'Pending' }
  ];

  const accessLogs = [
    { id: 1, user: 'admin@mrcreams.com', action: 'User Created', ip: '192.168.1.100', time: '10 min ago', status: 'success' },
    { id: 2, user: 'superadmin@mrcreams.com', action: 'Model Deployed', ip: '192.168.1.101', time: '1 hour ago', status: 'success' },
    { id: 3, user: 'unknown@external.com', action: 'Login Failed', ip: '45.123.45.67', time: '2 hours ago', status: 'blocked' }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Security Center
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Security Score"
            value="98/100"
            change="Excellent"
            changeType="increase"
            icon={ShieldIcon}
            color={dashboardTheme.colors.success}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Threats"
            value="0"
            change="All clear"
            changeType="increase"
            icon={CheckCircleIcon}
            color={dashboardTheme.colors.success}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Failed Logins"
            value="12"
            change="Last 24h"
            changeType="warning"
            icon={WarningIcon}
            color={dashboardTheme.colors.warning}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Encryption"
            value="100%"
            change="Full coverage"
            changeType="increase"
            icon={SecurityIcon}
            color={dashboardTheme.colors.chart.blue}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <DashboardCard title="Compliance Status" subtitle="Regulatory requirements">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Standard</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Last Audit</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Findings</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {securityMetrics.map((metric) => (
                    <TableRow key={metric.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {metric.metric}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusIndicator 
                          status={metric.status === 'compliant' ? 'success' : 'warning'} 
                          label={metric.status}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{metric.lastAudit}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{metric.findings}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DashboardCard title="Recent Access Logs" subtitle="Security audit trail">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>IP Address</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accessLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {log.user}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{log.action}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={log.ip} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{log.time}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={log.status} 
                          size="small"
                          color={log.status === 'success' ? 'success' : 'error'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SecurityCenter;
