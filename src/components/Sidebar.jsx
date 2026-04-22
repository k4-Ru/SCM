import { NavLink, useNavigate } from 'react-router-dom'
import {
  FaArrowRightFromBracket,
  FaBell,
  FaBoxesStacked,
  FaChartColumn,
  FaChartLine,
  FaClipboardList,
  FaFileLines,
  FaGear,
  FaGauge,
  FaShop,
  FaTruck,
  FaUsers,
} from 'react-icons/fa6'
import { getCurrentUserInfo, logout } from '../lib/api'
import { getVisibleBottomItems, getVisibleNavItems } from '../lib/rbac'







const SIDEBAR_ICONS = {
  dashboard: FaGauge,
  products: FaFileLines,
  inventory: FaBoxesStacked,
  suppliers: FaShop,
  orders: FaClipboardList,
  shipments: FaTruck,
  analytics: FaChartLine,
  notifications: FaBell,
  supplierApps: FaUsers,
  activityLogs: FaChartColumn,
  settings: FaGear,
}









function Sidebar({ onLogout, role }) {
  const navigate = useNavigate()
  const navItems = getVisibleNavItems(role)
  const bottomItems = getVisibleBottomItems(role)
  const userInfo = getCurrentUserInfo()

  const displayName = userInfo.name || userInfo.email || 'Unknown user'
  const displayRole = (role || userInfo.role || 'user').replace(/_/g, ' ')

  async function handleLogout() {
    await logout()
    if (onLogout) onLogout()
    navigate('/login')
  }

  function renderNavIcon(iconKey) {
    const Icon = SIDEBAR_ICONS[iconKey]
    if (!Icon) return null
    return <Icon className="text-sm shrink-0" aria-hidden="true" />
  }

  return (
    <aside className="w-64 bg-[#efc29f] text-[#2f1e12] min-h-screen flex flex-col">
      <div className="p-5 border-b border-[#d5a882]">
        <h1 className="text-xl font-bold tracking-wide">SCM</h1>
        <p className="text-xs text-[#6f4b35] mt-1">Supply Chain Management</p>
        <div className="mt-3 rounded-lg bg-[#f6dec9] border border-[#deb38f] px-3 py-2">
          <p className="text-xs font-semibold text-[#4a2e1e] truncate">
            <span>{displayName}: </span>
            <span className="font-mono tracking-wider text-[#7a3f22]">{displayRole.toUpperCase()}</span>
          </p>
        </div>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-[#7a3f22] text-[#fff5ee]'
                      : 'text-[#3e2719] hover:bg-[#e6b28d] hover:text-[#2b1a10]'
                  }`
                }
              >
                <span className="w-4 flex justify-center">{renderNavIcon(item.icon)}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-[#d5a882] py-4 px-3 space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-[#7a3f22] text-[#fff5ee]'
                  : 'text-[#3e2719] hover:bg-[#e6b28d] hover:text-[#2b1a10]'
              }`
            }
          >
            <span className="w-4 flex justify-center">{renderNavIcon(item.icon)}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#3e2719] hover:bg-[#e6b28d] hover:text-[#2b1a10] transition-colors w-full"
        >
          <span className="w-4 flex justify-center">
            <FaArrowRightFromBracket className="text-sm shrink-0" aria-hidden="true" />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
