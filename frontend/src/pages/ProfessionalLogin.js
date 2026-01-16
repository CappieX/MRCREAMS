import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandButton } from '../components/custom/Button';
import { BrandInput } from '../components/custom/Input';
import { BrandText } from '../components/custom/Typography';
import { AuthPageShell, NotificationBanner } from '../components/custom/CustomUI';
import { BRAND_COLORS, BRAND_RADII, BRAND_SPACING } from '../assets/brand';

const ProfessionalLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // FIX: Start with empty role instead of 'therapist' to prevent MUI Select error
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    organizationCode: '',
    role: '' // ← CHANGED FROM 'therapist' TO EMPTY STRING
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]); // Start empty
  const [error, setError] = useState('');

  // Test credentials for quick fill
  const testCredentials = {
    super_admin: { email: 'superadmin@mrcreams.com', password: 'SuperAdmin@123', orgCode: 'MRCREAMS-SUPER-001', role: 'super_admin' },
    admin: { email: 'admin@mrcreams.com', password: 'Admin@123456', orgCode: 'MRCREAMS-ADMIN-001', role: 'admin' },
    support: { email: 'support@mrcreams.com', password: 'Support@123', orgCode: 'MRCREAMS-SUPPORT-001', role: 'support' },
    therapist: { email: 'therapist@mrcreams.com', password: 'Therapist@123', orgCode: 'MRCREAMS-THERAPIST-001', role: 'therapist' },
    executive: { email: 'executive@mrcreams.com', password: 'Executive@123', orgCode: 'MRCREAMS-EXECUTIVE-001', role: 'executive' },
    platform_admin: { email: 'platform@mrcreams.com', password: 'PlatformAdmin123!', orgCode: 'MRCREAMS-PLATFORM-001', role: 'platform_admin' }
  };

  // Auto-set roles based on org code
  useEffect(() => {
    const orgConfig = {
      'MRCREAMS-SUPER-001': ['super_admin'],
      'MRCREAMS-PLATFORM-001': ['platform_admin'],
      'MRCREAMS-ADMIN-001': ['admin'],
      'MRCREAMS-SUPPORT-001': ['support'],
      'MRCREAMS-THERAPIST-001': ['therapist'],
      'MRCREAMS-EXECUTIVE-001': ['executive']
    };

    if (formData.organizationCode && orgConfig[formData.organizationCode]) {
      setAvailableRoles(orgConfig[formData.organizationCode]);
      if (!orgConfig[formData.organizationCode].includes(formData.role)) {
        setFormData(prev => ({ ...prev, role: orgConfig[formData.organizationCode][0] }));
      }
    } else {
      setAvailableRoles(['super_admin', 'platform_admin', 'admin', 'support', 'executive', 'therapist']);
    }
  }, [formData.organizationCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate required fields
    if (!formData.email || !formData.password || !formData.organizationCode || !formData.role) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    console.log('🔍 PROFESSIONAL LOGIN DEBUG - Starting login process');
    console.log('📧 Login data:', {
      email: formData.email,
      password: formData.password,
      organizationCode: formData.organizationCode,
      role: formData.role
    });

    try {
      console.log('🔄 Calling login function from AuthContext...');
      const result = await login(formData.email, formData.password, formData.organizationCode, formData.role);
      console.log('✅ Login function completed, result:', result);

      if (result.success) {
        console.log('🎉 Login successful! User data:', result.user);
        console.log('🔀 Redirecting to dashboard:', result.user.role);

        const redirectPaths = {
          super_admin: '/dashboard/super-admin',
          admin: '/dashboard/admin',
          support: '/dashboard/support',
          executive: '/dashboard/executive',
          therapist: '/dashboard/therapist',
          platform_admin: '/dashboard/platform-admin',
          it_admin: '/dashboard/it-admin'
        };
        const roleKey = result.user?.role || result.user?.userType;
        navigate(redirectPaths[roleKey] || '/dashboard');
      } else {
        console.log('❌ Login failed with error:', result.error);
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('💥 Login catch error:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      setError('Login failed: ' + err.message);
    } finally {
      console.log('🏁 Login process completed');
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Quick fill without errors
  const quickFill = (role) => {
    const creds = testCredentials[role];
    if (creds) setFormData({
      email: creds.email,
      password: creds.password,
      organizationCode: creds.orgCode,
      role: creds.role
    });
  };

  return (
    <AuthPageShell
      title="Professional sign in"
      subtitle="For admins, therapists, support, executives and super admins."
      footer={
        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{
            border: 'none',
            background: 'transparent',
            padding: 0,
            cursor: 'pointer',
            fontSize: 13,
            color: 'rgba(15,23,42,0.8)',
            textDecoration: 'underline'
          }}
        >
          ← Back to User Login
        </button>
      }
    >
      <div
        style={{
          marginBottom: BRAND_SPACING.sm
        }}
      >
        <BrandText variant="subtle" tone="soft">
          Use your organization code and role to access MR.CREAMS Pro. Test credentials are available
          for sandbox exploration.
        </BrandText>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: BRAND_SPACING.sm
        }}
      >
        {['super_admin', 'platform_admin', 'admin', 'support', 'therapist', 'executive'].map(
          (role) => (
            <BrandButton
              key={role}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => quickFill(role)}
            >
              {role
                .split('_')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')}
            </BrandButton>
          )
        )}
      </div>
      {error && (
        <div
          style={{
            marginBottom: BRAND_SPACING.sm
          }}
        >
          <NotificationBanner tone="coral" title="Login issue" message={error} />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: BRAND_SPACING.sm
          }}
        >
          <BrandInput
            label="Organization code"
            value={formData.organizationCode}
            onChange={handleInputChange('organizationCode')}
            placeholder="e.g., MRCREAMS-SUPER-001"
            required
          />
          <label
            style={{
              display: 'block',
              fontSize: 13,
              color: 'rgba(10,37,64,0.8)'
            }}
          >
            <div
              style={{
                marginBottom: 6
              }}
            >
              Professional role
            </div>
            <select
              value={formData.role}
              onChange={handleInputChange('role')}
              required
              disabled={availableRoles.length === 0}
              style={{
                width: '100%',
                borderRadius: BRAND_RADII.lg,
                border: '1px solid rgba(10,37,64,0.22)',
                padding: '10px 12px',
                fontSize: 14,
                backgroundColor: '#ffffff',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                backgroundImage:
                  'linear-gradient(45deg, transparent 50%, rgba(15,23,42,0.45) 50%), linear-gradient(135deg, rgba(15,23,42,0.45) 50%, transparent 50%)',
                backgroundPosition: 'calc(100% - 14px) calc(50% - 3px), calc(100% - 9px) calc(50% - 3px)',
                backgroundSize: '5px 5px, 5px 5px',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {availableRoles.length === 0 ? (
                <option value="" disabled>
                  Select organization code first
                </option>
              ) : (
                <>
                  <option value="" disabled>
                    Select role
                  </option>
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role
                        .split('_')
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ')}
                    </option>
                  ))}
                </>
              )}
            </select>
          </label>
          <BrandInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            required
          />
          <div>
            <BrandInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              required
            />
            <div
              style={{
                marginTop: 6,
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <button
                type="button"
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: 0.04,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  color: 'rgba(0,180,216,0.9)'
                }}
              >
                {showPassword ? 'Hide password' : 'Show password'}
              </button>
            </div>
          </div>
          <BrandButton
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: BRAND_SPACING.sm,
              backgroundColor: BRAND_COLORS.deepBlue,
              color: '#ffffff'
            }}
          >
            {loading ? 'Signing in…' : 'Sign In as Professional'}
          </BrandButton>
        </div>
      </form>
    </AuthPageShell>
  );
};

export default ProfessionalLogin;
