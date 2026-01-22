// Route permissions mapping
export const ROUTE_PERMISSIONS = {
    '/admin': null, // Dashboard - everyone can access
    '/admin/users': 'users.view',
    '/admin/packages': 'packages.view',
    '/admin/transactions': 'transactions.view',
    '/admin/withdrawals': 'withdrawals.view',
    '/admin/logs': 'logs.view',
    '/admin/admins': 'admins.view',
    '/admin/roles': 'roles.view',
    '/admin/profile': null, // Profile - everyone can access
};

// Menu items with required permissions
export const MENU_ITEMS = [
    {
        path: '/admin',
        label: 'Dashboard',
        icon: '📊',
        permission: null, // No permission required
    },
    {
        path: '/admin/users',
        label: 'Users',
        icon: '👥',
        permission: 'users.view',
    },
    {
        path: '/admin/packages',
        label: 'Packages',
        icon: '📦',
        permission: 'packages.view',
    },
    {
        path: '/admin/transactions',
        label: 'Transactions',
        icon: '💳',
        permission: 'transactions.view',
    },
    {
        path: '/admin/withdrawals',
        label: 'Withdrawals',
        icon: '💰',
        permission: 'withdrawals.view',
    },
    {
        path: '/admin/logs',
        label: 'Logs',
        icon: '📝',
        permission: 'logs.view',
    },
    {
        path: '/admin/admins',
        label: 'Admin Management',
        icon: '👨‍💼',
        permission: 'admins.view',
        superAdminOnly: true, // Only super admins
    },
    {
        path: '/admin/roles',
        label: 'Role Management',
        icon: '🎭',
        permission: 'roles.view',
        superAdminOnly: true, // Only super admins
    },
    {
        path: '/admin/profile',
        label: 'Profile',
        icon: '👤',
        permission: null, // No permission required
    },
];

// Action permissions
export const ACTION_PERMISSIONS = {
    // Users
    'users.create': 'users.create',
    'users.update': 'users.update',
    'users.delete': 'users.delete',
    'users.reset_2fa': 'users.reset_2fa',

    // Packages
    'packages.create': 'packages.create',
    'packages.update': 'packages.update',
    'packages.delete': 'packages.delete',

    // Withdrawals
    'withdrawals.approve': 'withdrawals.approve',
    'withdrawals.reject': 'withdrawals.reject',
    'withdrawals.complete': 'withdrawals.complete',

    // Admins
    'admins.create': 'admins.create',
    'admins.update': 'admins.update',
    'admins.delete': 'admins.delete',

    // Roles
    'roles.create': 'roles.create',
    'roles.update': 'roles.update',
    'roles.delete': 'roles.delete',
};
