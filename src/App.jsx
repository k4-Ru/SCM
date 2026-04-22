import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Inventory from './pages/Inventory'
import Suppliers from './pages/Suppliers'
import Orders from './pages/Orders'
import Shipments from './pages/Shipments'
import Analytics from './pages/Analytics'
import Notifications from './pages/Notifications'
import SupplierApplications from './pages/SupplierApplications'
import ActivityLogs from './pages/ActivityLogs'
import Settings from './pages/Settings'
import { AUTH_EXPIRED_EVENT, getAccessToken, getCurrentUserRole } from './lib/api'
import { getHomePathByRole, isRouteAllowed } from './lib/rbac'

const APP_ROUTES = [
  {
    path: '/dashboard',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse', 'supplier'],
    render: () => <Dashboard />,
  },
  {
    path: '/products',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse', 'viewer', 'supplier'],
    render: () => <Products />,
  },
  {
    path: '/inventory',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse'],
    render: () => <Inventory />,
  },
  {
    path: '/suppliers',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse', 'supplier'],
    render: () => <Suppliers />,
  },
  {
    path: '/orders',
    roles: ['superadmin', 'admin'],
    render: () => <Orders />,
  },
  {
    path: '/shipments',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse', 'supplier'],
    render: () => <Shipments />,
  },
  {
    path: '/analytics',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse'],
    render: (role) => <Analytics role={role} />,
  },
  {
    path: '/notifications',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse', 'viewer', 'supplier'],
    render: () => <Notifications />,
  },
  {
    path: '/supplier-applications',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse'],
    render: () => <SupplierApplications />,
  },
  {
    path: '/activity-logs',
    roles: ['superadmin', 'admin'],
    render: () => <ActivityLogs />,
  },
  {
    path: '/settings',
    roles: ['superadmin', 'admin', 'procurement', 'warehouse', 'viewer', 'supplier'],
    render: (role) => <Settings role={role} />,
  },
]





function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getAccessToken()))
  const [role, setRole] = useState(getCurrentUserRole())

  const homePath = getHomePathByRole(role)

  useEffect(() => {
    function handleAuthExpired() {
      setIsLoggedIn(false)
      setRole('')
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
    }
  }, [])








  return (


    
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to={homePath} replace />
          ) : (
            <Login
              onAuthSuccess={() => {
                setIsLoggedIn(true)
                setRole(getCurrentUserRole())
              }}
            />
          )
        }
      />


      <Route
        path="/register"
        element={
          isLoggedIn ? (
            <Navigate to={homePath} replace />
          ) : (
            <Register />
          )
        }
      />
      <Route
        path="/*"
        element={
          isLoggedIn ? (
            <div className="flex min-h-screen bg-gray-100">
              <Sidebar
                role={role}
                onLogout={() => {
                  setIsLoggedIn(false)
                  setRole('')
                }}
              />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Navigate to={homePath} replace />} />
                  {APP_ROUTES.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        isRouteAllowed(role, route.roles)
                          ? route.render(role)
                          : <Navigate to={homePath} replace />
                      }
                    />
                  ))}
                  <Route path="*" element={<Navigate to={homePath} replace />} />
                </Routes>
              </main>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}

export default App
