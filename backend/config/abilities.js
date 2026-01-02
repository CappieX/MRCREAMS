const { AbilityBuilder, Ability } = require('@casl/ability');

/**
 * Define abilities based on user role
 * @param {Object} user - The user object
 * @returns {Ability} - CASL Ability instance
 */
function defineAbilitiesFor(user) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (!user) {
    // Guest permissions
    can('read', 'PublicContent');
    return build();
  }

  const userType = user.user_type || user.userType;

  // Super Admin - can do everything
  if (userType === 'super_admin' || userType === 'platform_admin') {
    can('manage', 'all');
    return build();
  }

  // Admin
  if (userType === 'admin') {
    can('manage', 'User');
    can('manage', 'Content');
    can('read', 'Report');
    cannot('delete', 'User'); // Admins cannot delete users, only suspend
    cannot('manage', 'SystemConfig');
  }

  // Therapist
  if (userType === 'therapist') {
    can('read', 'Client', { therapist_id: user.id });
    can('manage', 'Session', { therapist_id: user.id });
    can('read', 'Resource');
  }

  // Support
  if (userType === 'support') {
    can('read', 'User');
    can('manage', 'Ticket');
    cannot('read', 'SensitiveData'); // Cannot see passwords, health data, etc.
  }

  // Regular User (Individual)
  if (userType === 'individual') {
    can('read', 'Content');
    can('manage', 'Profile', { id: user.id });
    can('manage', 'Session', { user_id: user.id });
  }

  return build();
}

module.exports = { defineAbilitiesFor };
