import { Outlet, useNavigate } from 'react-router-dom';
import { BrandCard } from '../../components/custom/Card';
import { BrandText } from '../../components/custom/Typography';
import { useAuth } from '../../context/AuthContext';

const SupportDashboard = () => {
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
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 px-4 py-4 sm:px-6 sm:py-5">
        <BrandText variant="h2">
          Support command center
        </BrandText>
        <BrandText variant="body" tone="soft">
          Keep every ticket, escalation, and relationship-sensitive incident moving toward resolution.
        </BrandText>
      </section>

      <BrandCard
        tone="surface"
        header={{
          title: 'Ticket workspace'
        }}
      >
        <Outlet />
      </BrandCard>
    </div>
  );
};

export default SupportDashboard;
