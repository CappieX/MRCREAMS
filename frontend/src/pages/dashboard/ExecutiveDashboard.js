import { useNavigate } from 'react-router-dom';
import { BrandCard } from '../../components/custom/Card';
import { BrandText } from '../../components/custom/Typography';
import { BRAND_COLORS } from '../../assets/brand';
import { useAuth } from '../../context/AuthContext';

const ExecutiveDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs font-medium text-slate-500 hover:text-slate-900 hover:underline underline-offset-2"
        >
          Logout
        </button>
      </div>
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-amber-50 via-orange-50 to-slate-50 px-4 py-4 sm:px-6 sm:py-5">
        <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-amber-100 blur-3xl" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <BrandText variant="h2">
              Executive insights
            </BrandText>
            <BrandText variant="body" tone="soft">
              A single, calm view of the health of your relationships, revenue, and engagement across the MR.CREAMS platform.
            </BrandText>
          </div>
          <div className="grid grid-cols-2 gap-3 text-right text-xs text-slate-600 sm:text-sm">
            <div>
              <div className="font-semibold text-slate-900">
                $128,450
              </div>
              <div className="text-emerald-600">
                +12% revenue this month
              </div>
            </div>
            <div>
              <div className="font-semibold text-slate-900">
                2,845
              </div>
              <div className="text-emerald-600">
                active users
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <BrandCard
          tone="surface"
          header={{
            title: 'Revenue',
            meta: 'Monthly run rate'
          }}
        >
          <BrandText variant="h3" style={{ color: BRAND_COLORS.coral }}>
            $128,450
          </BrandText>
          <BrandText variant="caption" tone="soft">
            +12% vs last month · driven by new organization rollouts
          </BrandText>
        </BrandCard>

        <BrandCard
          tone="surface"
          header={{
            title: 'Active users',
            meta: 'Last 30 days'
          }}
        >
          <BrandText variant="h3" style={{ color: BRAND_COLORS.teal }}>
            2,845
          </BrandText>
          <BrandText variant="caption" tone="soft">
            +5% vs last month · strong therapist and support adoption
          </BrandText>
        </BrandCard>

        <BrandCard
          tone="surface"
          header={{
            title: 'Profit',
            meta: 'Contribution margin'
          }}
        >
          <BrandText variant="h3" style={{ color: BRAND_COLORS.deepBlue }}>
            $89,450
          </BrandText>
          <BrandText variant="caption" tone="soft">
            +8% vs last month · infrastructure efficiency and retention
          </BrandText>
        </BrandCard>

        <BrandCard
          tone="surface"
          header={{
            title: 'Engagement',
            meta: 'Session quality'
          }}
        >
          <BrandText variant="h3" style={{ color: BRAND_COLORS.coral }}>
            78%
          </BrandText>
          <BrandText variant="caption" tone="soft">
            +3% vs last month · more check-ins and completed guidance flows
          </BrandText>
        </BrandCard>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
