import { useNavigate } from 'react-router-dom';
import { BrandCard } from '../../components/custom/Card';
import { BrandText } from '../../components/custom/Typography';
import { BrandButton } from '../../components/custom/Button';
import { BRAND_COLORS } from '../../assets/brand';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
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
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-cyan-50 via-sky-50 to-slate-50 px-4 py-4 sm:px-6 sm:py-5">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-100 blur-3xl" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <BrandText variant="h2">
              Admin control center
            </BrandText>
            <BrandText variant="body" tone="soft">
              Keep users, roles, and permissions in a healthy balance without losing sight of the humans behind the data.
            </BrandText>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <BrandButton
              size="sm"
              style={{ backgroundColor: BRAND_COLORS.teal }}
            >
              Review pending approvals
            </BrandButton>
            <BrandButton
              size="sm"
              variant="outline"
            >
              Open user directory
            </BrandButton>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <BrandCard
          tone="surface"
          header={{
            title: 'User snapshot',
            meta: 'Live overview'
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 bg-white/70 px-3 py-2.5 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Active users
              </div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                324
              </div>
              <div className="mt-1 text-xs text-emerald-600">
                +12% vs last week
              </div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white/70 px-3 py-2.5 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Pending approvals
              </div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                15
              </div>
              <div className="mt-1 text-xs text-amber-600">
                Review within 24 hours
              </div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white/70 px-3 py-2.5 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                New this week
              </div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                28
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Mostly therapists and support roles
              </div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white/70 px-3 py-2.5 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                At-risk accounts
              </div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                6
              </div>
              <div className="mt-1 text-xs text-rose-600">
                Escalated to support
              </div>
            </div>
          </div>
        </BrandCard>

        <BrandCard
          tone="surface"
          header={{
            title: 'Quick actions',
            meta: 'Admin shortcuts'
          }}
        >
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-white/80 px-3 py-2">
              <span>Manage users and roles</span>
              <span className="text-xs font-medium text-slate-500">
                2 pending changes
              </span>
            </li>
            <li className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-white/80 px-3 py-2">
              <span>Review access policies</span>
              <span className="text-xs font-medium text-amber-600">
                Annual review in progress
              </span>
            </li>
            <li className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-white/80 px-3 py-2">
              <span>Download audit report</span>
              <span className="text-xs font-medium text-slate-500">
                Last generated 3 days ago
              </span>
            </li>
            <li className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-white/80 px-3 py-2">
              <span>Configure notifications</span>
              <span className="text-xs font-medium text-emerald-600">
                Healthy signal-to-noise
              </span>
            </li>
          </ul>
        </BrandCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
