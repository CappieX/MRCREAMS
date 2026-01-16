import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandButton } from '../components/custom/Button';
import { BrandInput } from '../components/custom/Input';
import { BrandText } from '../components/custom/Typography';
import { AuthPageShell, NotificationBanner } from '../components/custom/CustomUI';
import { BRAND_SPACING } from '../assets/brand';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');
    
    try {
      // END USERS: No organization code, auto-detect role from credentials
      const result = await login(formData.email, formData.password, '', '');
      
      if (result.success) {
        navigate('/dashboard/user'); // Always go to user dashboard for end users
      } else {
        setLoginError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageShell
      title="Sign in to MR.CREAMS"
      subtitle="For individuals and couples – your relationship support home."
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            flexWrap: 'wrap'
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/register')}
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
            Create Account
          </button>
          <span
            style={{
              fontSize: 13,
              color: 'rgba(15,23,42,0.5)'
            }}
          >
            •
          </span>
          <button
            type="button"
            onClick={() => navigate('/login/professional')}
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
            Professional Login
          </button>
        </div>
      }
    >
      {loginError && (
        <div
          style={{
            marginBottom: BRAND_SPACING.sm
          }}
        >
          <NotificationBanner
            tone="coral"
            title="We could not sign you in"
            message={loginError}
          />
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
            label="Email address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            name="email"
            autoComplete="email"
            autoFocus
            required
            disabled={isSubmitting}
          />
          <div>
            <BrandInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              name="password"
              autoComplete="current-password"
              required
              disabled={isSubmitting}
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
            style={{
              width: '100%',
              marginTop: BRAND_SPACING.sm
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in…' : 'Sign In as User'}
          </BrandButton>
          <BrandText
            variant="caption"
            tone="muted"
            style={{
              marginTop: 4
            }}
          >
            Private by design. Your emotional data is encrypted in transit and at rest.
          </BrandText>
        </div>
      </form>
    </AuthPageShell>
  );
};

export default Login;
