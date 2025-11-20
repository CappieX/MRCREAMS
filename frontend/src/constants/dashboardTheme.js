// Professional Dashboard Design System
export const dashboardTheme = {
  colors: {
    primary: '#1A237E',      // Deep Blue - Trust
    secondary: '#00695C',    // Teal - Growth
    accent: '#7B1FA2',       // Purple - Innovation
    success: '#2E7D32',      // Green - Positive
    warning: '#F57C00',      // Orange - Attention
    error: '#C62828',        // Red - Critical
    info: '#0277BD',         // Blue - Information
    background: '#F5F5F5',   // Light Gray
    surface: '#FFFFFF',      // White
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9E9E9E',
      white: '#FFFFFF'
    },
    chart: {
      blue: '#1976D2',
      teal: '#00897B',
      purple: '#8E24AA',
      orange: '#FB8C00',
      green: '#43A047',
      red: '#E53935',
      pink: '#D81B60',
      indigo: '#3949AB'
    }
  },
  
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: '1.5rem', fontWeight: 500 },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
    caption: { fontSize: '0.75rem', fontWeight: 400 }
  },
  
  spacing: {
    xs: 0.5,   // 4px
    sm: 1,     // 8px
    md: 1.5,   // 12px
    lg: 2,     // 16px
    xl: 3,     // 24px
    xxl: 4     // 32px
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%'
  },
  
  shadows: {
    low: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.12)',
    high: '0 8px 16px rgba(0,0,0,0.15)',
    elevated: '0 12px 24px rgba(0,0,0,0.18)'
  }
};

// Role-specific color schemes
export const roleColors = {
  super_admin: {
    primary: '#1A237E',
    gradient: 'linear-gradient(135deg, #1A237E 0%, #283593 100%)',
    light: '#E8EAF6',
    icon: '#3949AB'
  },
  it_admin: {
    primary: '#01579B',
    gradient: 'linear-gradient(135deg, #01579B 0%, #0277BD 100%)',
    light: '#E1F5FE',
    icon: '#0288D1'
  },
  therapist: {
    primary: '#7B1FA2',
    gradient: 'linear-gradient(135deg, #7B1FA2 0%, #8E24AA 100%)',
    light: '#F3E5F5',
    icon: '#9C27B0'
  },
  support: {
    primary: '#00695C',
    gradient: 'linear-gradient(135deg, #00695C 0%, #00897B 100%)',
    light: '#E0F2F1',
    icon: '#00897B'
  },
  executive: {
    primary: '#BF360C',
    gradient: 'linear-gradient(135deg, #BF360C 0%, #D84315 100%)',
    light: '#FBE9E7',
    icon: '#E64A19'
  },
  admin: {
    primary: '#1565C0',
    gradient: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
    light: '#E3F2FD',
    icon: '#1E88E5'
  }
};

// Common dashboard metrics
export const metricTypes = {
  increase: { color: '#2E7D32', icon: 'TrendingUp' },
  decrease: { color: '#C62828', icon: 'TrendingDown' },
  stable: { color: '#757575', icon: 'Remove' },
  warning: { color: '#F57C00', icon: 'Warning' }
};

export default dashboardTheme;
