import { Outlet, useNavigate } from 'react-router-dom';
import { BrandCard } from '../../components/custom/Card';
import { BrandText } from '../../components/custom/Typography';
import { BRAND_COLORS } from '../../assets/brand';
import { useAuth } from '../../context/AuthContext';

const TherapistDashboard = () => {
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
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-violet-50 via-sky-50 to-slate-50 px-4 py-4 sm:px-6 sm:py-5">
        <BrandText variant="h2">
          Therapist workspace
        </BrandText>
        <BrandText variant="body" tone="soft">
          A calm overview of sessions, clients, and emotional data so you can stay fully present in the room.
        </BrandText>
        <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
          <div>
            <span className="font-semibold text-slate-900">
              Today
            </span>
            <span className="ml-1 text-slate-500">
              4 sessions scheduled
            </span>
          </div>
          <div>
            <span className="font-semibold text-slate-900">
              Check-ins
            </span>
            <span className="ml-1 text-slate-500">
              12 new emotion logs
            </span>
          </div>
          <div>
            <span className="font-semibold" style={{ color: BRAND_COLORS.teal }}>
              Signals
            </span>
            <span className="ml-1 text-slate-500">
              3 relationships watching closely
            </span>
          </div>
        </div>
      </section>

      <BrandCard
        tone="surface"
        header={{
          title: 'Clinical workspace'
        }}
      >
        <Outlet />
      </BrandCard>
    </div>
  );
};

export default TherapistDashboard;
