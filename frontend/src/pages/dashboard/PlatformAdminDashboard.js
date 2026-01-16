import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from '../../components/custom/dashboard/DashboardSidebar';
import DashboardHeader from '../../components/custom/dashboard/DashboardHeader';
import BreadcrumbNav from '../../components/custom/dashboard/BreadcrumbNav';
import StatsCard from '../../components/custom/dashboard/StatsCard';
import ChartContainer from '../../components/custom/dashboard/ChartContainer';
import AdminMetricsChart from '../../components/custom/dashboard/AdminMetricsChart';
import UserActivityTimeline from '../../components/custom/dashboard/UserActivityTimeline';
import HeatMapGrid from '../../components/custom/dashboard/HeatMapGrid';
import QuickActionGrid from '../../components/custom/dashboard/QuickActionGrid';

const PlatformAdminDashboard = () => {
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
    if (path.includes('/health')) return 'System health';
    if (path.includes('/logs')) return 'Audit logs';
    if (path.includes('/config')) return 'Configuration';
    if (path.includes('/users')) return 'Organizations';
    if (path.includes('/conflicts')) return 'Conflicts';
    if (path.includes('/professionals')) return 'Therapists';
    if (path.includes('/analytics')) return 'Analytics';
    if (path.includes('/notifications')) return 'Notifications';
    return 'Overview';
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Platform Admin', href: '/dashboard/platform-admin' },
    { label: sectionLabel() }
  ];

  const stats = [
    {
      label: 'Organizations live',
      value: '18',
      hint: 'Provisioned and active',
      trend: '+2 launched this month'
    },
    {
      label: 'Therapists onboarded',
      value: '214',
      hint: 'Across all orgs',
      trend: '+19 in review'
    },
    {
      label: 'Average latency',
      value: '47 ms',
      hint: 'Global 95th percentile',
      trend: '-6 ms vs last week',
      trendDirection: 'up'
    },
    {
      label: 'Open incidents',
      value: '3',
      hint: 'All non-critical',
      trend: '2 in monitoring',
      trendDirection: 'down',
      accent: 'coral'
    }
  ];

  const actions = [
    {
      label: 'Review new organizations',
      short: 'Org',
      description: 'Approve or configure newly invited organizations before they go live.',
      cta: 'Open queue'
    },
    {
      label: 'Monitor system health',
      short: 'Ops',
      description: 'Check API, database, and integration health across regions.',
      cta: 'Open health'
    },
    {
      label: 'Configure notification rules',
      short: 'Notify',
      description: 'Tune platform-wide notifications for admins, support, and therapists.',
      cta: 'Edit rules'
    },
    {
      label: 'Generate platform report',
      short: 'Rpt',
      description: 'Export a snapshot of uptime, usage, and adoption metrics.',
      cta: 'Generate'
    }
  ];

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 24px)',
        borderRadius: 24,
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 0 0, rgba(56,189,248,0.14), transparent 55%), radial-gradient(circle at 100% 100%, rgba(15,23,42,0.85), #020617 60%)',
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
            role="platform_admin"
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
              'radial-gradient(circle at top, rgba(15,23,42,0.08), transparent 60%), #F8F9FA'
          }}
        >
          <DashboardHeader
            title="Platform operations hub"
            subtitle="Infrastructure, organizations, and therapist readiness"
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
                  trendDirection={stat.trendDirection || 'up'}
                  accent={stat.accent}
                />
              ))}
            </section>

            <section
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2.1fr) minmax(0, 1.4fr)',
                gap: 16
              }}
            >
              <ChartContainer
                title="Infrastructure and traffic"
                meta="High-level performance across core services"
              >
                <AdminMetricsChart />
              </ChartContainer>
              <ChartContainer
                title="Adoption heatmap"
                meta="Check-ins and sessions by week across orgs"
              >
                <HeatMapGrid />
              </ChartContainer>
            </section>

            <section
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1.5fr)',
                gap: 16
              }}
            >
              <ChartContainer
                title="Latest platform events"
                meta="Operations, billing, and therapist onboarding"
              >
                <UserActivityTimeline />
              </ChartContainer>
              <ChartContainer
                title="Quick actions"
                meta="Routines to keep the platform healthy"
              >
                <QuickActionGrid actions={actions} />
              </ChartContainer>
            </section>

            <section>
              <ChartContainer
                title="Workspace"
                meta="Focused tools for the section you are working in"
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

export default PlatformAdminDashboard;
