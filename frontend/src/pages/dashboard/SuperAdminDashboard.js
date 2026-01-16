import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from '../../components/custom/dashboard/DashboardSidebar';
import DashboardHeader from '../../components/custom/dashboard/DashboardHeader';
import BreadcrumbNav from '../../components/custom/dashboard/BreadcrumbNav';
import StatsCard from '../../components/custom/dashboard/StatsCard';
import DataTable from '../../components/custom/dashboard/DataTable';
import ChartContainer from '../../components/custom/dashboard/ChartContainer';
import AdminMetricsChart from '../../components/custom/dashboard/AdminMetricsChart';
import UserActivityTimeline from '../../components/custom/dashboard/UserActivityTimeline';
import ProgressRadial from '../../components/custom/dashboard/ProgressRadial';
import HeatMapGrid from '../../components/custom/dashboard/HeatMapGrid';

const SuperAdminDashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const mobile = window.innerWidth < 1024;
        setIsMobile(mobile);
        setSidebarOpen(!mobile);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const path = location.pathname;

  const sectionLabel = () => {
    if (path.includes('/users')) return 'Users';
    if (path.includes('/emotion-analysis')) return 'Emotion analysis';
    if (path.includes('/sessions')) return 'Sessions';
    if (path.includes('/models')) return 'Models';
    if (path.includes('/security')) return 'Security';
    if (path.includes('/analytics')) return 'Analytics';
    if (path.includes('/data-governance')) return 'Data governance';
    if (path.includes('/integrations')) return 'Integrations';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/support')) return 'Support';
    return 'Overview';
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Super Admin', href: '/dashboard/super-admin' },
    { label: sectionLabel() }
  ];

  const stats = [
    {
      label: 'Active organizations',
      value: '18',
      hint: 'Connected across 3 regions',
      trend: '+3 this quarter',
      trendDirection: 'up',
      accent: 'teal'
    },
    {
      label: 'Total users',
      value: '8,412',
      hint: 'Across all organizations',
      trend: '+11% active vs last month',
      trendDirection: 'up',
      accent: 'navy'
    },
    {
      label: 'Platform churn',
      value: '1.2%',
      hint: 'Rolling 90 days',
      trend: '-0.3 pts vs quarter',
      trendDirection: 'down',
      accent: 'coral'
    },
    {
      label: 'System uptime',
      value: '99.98%',
      hint: 'Last 30 days',
      trend: 'No critical incidents',
      trendDirection: 'up',
      accent: 'teal'
    }
  ];

  const tableColumns = [
    { key: 'name', label: 'Organization' },
    { key: 'owner', label: 'Owner' },
    { key: 'region', label: 'Region' },
    { key: 'users', label: 'Users', align: 'right' },
    { key: 'status', label: 'Status' }
  ];

  const tableRows = [
    {
      id: 1,
      name: 'Enum Labs',
      owner: 'Enum Technology',
      region: 'US-East',
      users: 1243,
      status: 'Healthy'
    },
    {
      id: 2,
      name: 'Harmony Clinic Network',
      owner: 'Clinical ops',
      region: 'EU-West',
      users: 932,
      status: 'Monitoring'
    },
    {
      id: 3,
      name: 'Calm Relationships Co.',
      owner: 'People operations',
      region: 'US-West',
      users: 518,
      status: 'Healthy'
    },
    {
      id: 4,
      name: 'InnerWork Collective',
      owner: 'Therapist cooperative',
      region: 'APAC',
      users: 276,
      status: 'Healthy'
    },
    {
      id: 5,
      name: 'Enum Pilot Program',
      owner: 'Enum Technology',
      region: 'Global',
      users: 147,
      status: 'Sandbox'
    }
  ];

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 24px)',
        borderRadius: 24,
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 0 0, rgba(0,180,216,0.12), transparent 55%), radial-gradient(circle at 100% 100%, rgba(255,107,107,0.09), transparent 55%), #020617',
        boxShadow: '0 24px 60px rgba(15,23,42,0.7)'
      }}
    >
      <div
        style={{
          display: 'flex',
          minHeight: 560
        }}
      >
        {!isMobile && (
          <DashboardSidebar
            role="super_admin"
            open={sidebarOpen}
            onToggle={() => setSidebarOpen((open) => !open)}
          />
        )}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background:
              'radial-gradient(circle at top, rgba(15,23,42,0.1), transparent 60%), #F8F9FA'
          }}
        >
          <DashboardHeader
            title="Super Admin control center"
            subtitle="Cross-organization health, safety, and growth"
            onToggleSidebar={() => setSidebarOpen((open) => !open)}
            breadcrumb={<BreadcrumbNav items={breadcrumbItems} />}
          />
          <main
            style={{
              paddingInline: 20,
              paddingTop: 16,
              paddingBottom: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
          >
            <section
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 12
              }}
            >
              {stats.map((stat) => (
                <StatsCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  hint={stat.hint}
                  trend={stat.trend}
                  trendDirection={stat.trendDirection}
                  accent={stat.accent}
                />
              ))}
            </section>

            <section
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2.2fr) minmax(0, 1.5fr)',
                gap: 16
              }}
            >
              <ChartContainer
                title="Platform usage trend"
                meta="Daily active users across all organizations"
              >
                <AdminMetricsChart />
              </ChartContainer>
              <ChartContainer
                title="Engagement heatmap"
                meta="Check-ins and sessions by day"
              >
                <HeatMapGrid />
              </ChartContainer>
            </section>

            <section
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1.3fr)',
                gap: 16
              }}
            >
              <ChartContainer
                title="Organizations"
                meta="License, user, and region overview"
              >
                <DataTable columns={tableColumns} rows={tableRows} />
              </ChartContainer>
              <ChartContainer
                title="Signals and audit trail"
                meta="Recent sensitive events across the platform"
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: 16,
                    alignItems: 'center'
                  }}
                >
                  <UserActivityTimeline />
                  <ProgressRadial value={86} />
                </div>
              </ChartContainer>
            </section>

            <section>
              <ChartContainer
                title="Workspace"
                meta="Focused view for the section you are in"
              >
                <Outlet />
              </ChartContainer>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
