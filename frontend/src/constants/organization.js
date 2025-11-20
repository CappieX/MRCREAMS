// Organization configuration and validation
export const ORGANIZATION_CONFIG = {
  // SUPER ADMIN ORGANIZATION (Can create other orgs)
  'MRCREAMS-SUPER-2024': {
    name: 'MR.CREAMS Headquarters',
    type: 'super_admin',
    allowedRoles: ['super_admin', 'admin', 'it_admin', 'support', 'executive', 'therapist', 'accountant'],
    createdBy: 'system'
  },
  
  // DEFAULT ORGANIZATION CODES
  'MRCREAMS-ADMIN-001': {
    name: 'MR.CREAMS Admin Team', 
    type: 'admin',
    allowedRoles: ['admin', 'support', 'therapist']
  },
  'MRCREAMS-SUPPORT-001': {
    name: 'MR.CREAMS Support Team',
    type: 'support', 
    allowedRoles: ['support']
  },
  'MRCREAMS-THERAPY-001': {
    name: 'MR.CREAMS Therapy Network',
    type: 'therapist',
    allowedRoles: ['therapist']
  },
  'MRCREAMS-EXEC-001': {
    name: 'MR.CREAMS Executive',
    type: 'executive',
    allowedRoles: ['executive']
  }
};

// Test credentials with organization codes
export const TEST_CREDENTIALS = {
  super_admin: {
    email: 'superadmin@mrcreams.com',
    password: 'superadmin123', 
    organizationCode: 'MRCREAMS-SUPER-2024',
    role: 'super_admin'
  },
  admin: {
    email: 'admin@mrcreams.com',
    password: 'admin123',
    organizationCode: 'MRCREAMS-ADMIN-001', 
    role: 'admin'
  },
  support: {
    email: 'support@mrcreams.com',
    password: 'support123',
    organizationCode: 'MRCREAMS-SUPPORT-001',
    role: 'support'
  },
  executive: {
    email: 'executive@mrcreams.com', 
    password: 'executive123',
    organizationCode: 'MRCREAMS-EXEC-001',
    role: 'executive'
  },
  therapist: {
    email: 'therapist@mrcreams.com',
    password: 'therapist123', 
    organizationCode: 'MRCREAMS-THERAPY-001',
    role: 'therapist'
  }
};

// Validate organization code format
export const validateOrgCode = (code) => {
  return /^MRCREAMS-[A-Z]+-\d{3,4}$/.test(code);
};

// Get organization details by code
export const getOrgByCode = (code) => {
  return ORGANIZATION_CONFIG[code] || null;
};

// Get roles allowed for an organization
export const getAllowedRoles = (orgCode) => {
  const org = getOrgByCode(orgCode);
  return org ? org.allowedRoles : [];
};
