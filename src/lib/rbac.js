const ROLE_HOME_PATH = {
  superadmin: '/dashboard',
  admin: '/dashboard',
  procurement: '/dashboard',
  warehouse: '/dashboard',
  supplier: '/dashboard',
  viewer: '/settings',
}


//need icons for nav items
const NAV_ITEMS = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: '',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse', 'supplier'],
  },
  {
    name: 'Inventory',
    path: '/inventory',
    icon: '',
    roles: ['superadmin', 'admin', 'procurement'],
  },
  {
    name: 'Suppliers',
    path: '/suppliers',
    icon: '',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse', 'supplier'],
  },
  {
    name: 'Orders',
    path: '/orders',
    icon: '',
    roles: ['superadmin', 'admin'],
  },
  {
    name: 'Shipments',
    path: '/shipments',
    icon: '',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse', 'supplier'],
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: '📈',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse'],
  },
]

const BOTTOM_ITEMS = [
  {
    name: 'Settings',
    path: '/settings',
    icon: '⚙️',
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
