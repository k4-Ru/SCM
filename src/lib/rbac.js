const ROLE_HOME_PATH = {
  superadmin: '/dashboard',
  admin: '/dashboard',
  procurement: '/dashboard',
  warehouse: '/dashboard',
  supplier: '/dashboard',
  viewer: '/settings',
}






const NAV_ITEMS = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'dashboard',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse', 'supplier'],
  },
  {
    name: 'Products',
    path: '/products',
    icon: 'products',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse', 'viewer', 'supplier'],
  },
  {
    name: 'Inventory',
    path: '/inventory',
    icon: 'inventory',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse'],
  },
  {
    name: 'Suppliers',
    path: '/suppliers',
    icon: 'suppliers',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse', 'supplier'],
  },
  {
    name: 'Orders',
    path: '/orders',
    icon: 'orders',
    roles: ['superadmin', 'admin'],
  },
  {
    name: 'Shipments',
    path: '/shipments',
    icon: 'shipments',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse', 'supplier'],
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: 'analytics',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse'],
  },
  {
    name: 'Notifications',
    path: '/notifications',
    icon: 'notifications',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse', 'viewer', 'supplier'],
  },
  {
    name: 'Supplier Apps',
    path: '/supplier-applications',
    icon: 'supplierApps',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse'],
  },
  {
    name: 'Activity Logs',
    path: '/activity-logs',
    icon: 'activityLogs',
    roles: ['superadmin', 'admin'],
  },
]

const BOTTOM_ITEMS = [
  {
    name: 'Settings',
    path: '/settings',
    icon: 'settings',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse', 'viewer', 'supplier'],
  },
]

function isAllowed(item, role) {
  if (!item?.roles || item.roles.length === 0) return true
  if (!role) return false
  return item.roles.includes(role)
}

export function getHomePathByRole(role) {
  return ROLE_HOME_PATH[role] || '/settings'
}

export function isRouteAllowed(role, allowedRoles = []) {
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) return true
  if (!role) return false
  return allowedRoles.includes(role)
}

export function getVisibleNavItems(role) {
  return NAV_ITEMS.filter((item) => isAllowed(item, role))
}

export function getVisibleBottomItems(role) {
  return BOTTOM_ITEMS.filter((item) => isAllowed(item, role))
}
