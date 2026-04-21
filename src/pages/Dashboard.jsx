import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../lib/api'

const StatCard = ({ title, value, change, icon, color }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-xl font-semibold">{value}</h3>
        <p className={`text-sm ${color}`}>{change}</p>
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

function formatShortDate(value) {
  if (!value) return '—'

  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function statusPill(status) {
  const normalized = (status || '').toLowerCase()
  if (normalized === 'delivered') return 'text-green-600'
  if (normalized === 'pending' || normalized === 'in_transit' || normalized === 'shipped') return 'text-yellow-600'
  if (normalized === 'cancelled') return 'text-red-600'
  return 'text-blue-600'
}

const Dashboard = () => {
  const [query, setQuery] = useState('')
  const [procurements, setProcurements] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadDashboardData() {
      setLoading(true)
      setError('')

      const [procurementResult, supplierResult, shipmentResult] = await Promise.allSettled([
        apiRequest('/api/procurements'),
        apiRequest('/api/suppliers'),
        apiRequest('/api/shipments'),
      ])

      if (!active) return

      const anySuccess =
        procurementResult.status === 'fulfilled' ||
        supplierResult.status === 'fulfilled' ||
        shipmentResult.status === 'fulfilled'

      if (procurementResult.status === 'fulfilled') {
        setProcurements(Array.isArray(procurementResult.value) ? procurementResult.value : [])
      }

      if (supplierResult.status === 'fulfilled') {
        setSuppliers(Array.isArray(supplierResult.value) ? supplierResult.value : [])
      }

      if (shipmentResult.status === 'fulfilled') {
        setShipments(Array.isArray(shipmentResult.value) ? shipmentResult.value : [])
      }

      if (!anySuccess) {
        const firstError =
          (procurementResult.status === 'rejected' && procurementResult.reason?.message) ||
          (supplierResult.status === 'rejected' && supplierResult.reason?.message) ||
          (shipmentResult.status === 'rejected' && shipmentResult.reason?.message) ||
          'Unable to load dashboard data.'

        setError(firstError)
      }

      setLoading(false)
    }

    loadDashboardData()

    return () => {
      active = false
    }
  }, [])

  const supplierById = useMemo(() => {
    return suppliers.reduce((acc, supplier) => {
      acc[supplier.id] = supplier
      return acc
    }, {})
  }, [suppliers])

  const stats = useMemo(() => {
    const totalInventoryValue = procurements.reduce(
      (sum, item) => sum + (Number(item.total_amount) || 0),
      0,
    )

    const activeOrders = procurements.filter(
      (item) => !['delivered', 'cancelled'].includes((item.status || '').toLowerCase()),
    ).length

    const deliveredShipments = shipments.filter((item) => item.status === 'delivered')
    const onTimeDelivered = deliveredShipments.filter((item) => {
      if (!item.expected_delivery || !item.delivered_at) return false
      const deliveredDate = new Date(item.delivered_at)
      const expectedDate = new Date(`${item.expected_delivery}T23:59:59`)
      if (Number.isNaN(deliveredDate.getTime()) || Number.isNaN(expectedDate.getTime())) return false
      return deliveredDate <= expectedDate
    }).length

    const onTimeRate = deliveredShipments.length
      ? `${((onTimeDelivered / deliveredShipments.length) * 100).toFixed(1)}%`
      : '0.0%'

    return {
      totalInventoryValue,
      activeOrders,
      suppliersCount: suppliers.length,
      onTimeRate,
      deliveredShipments: deliveredShipments.length,
    }
  }, [procurements, suppliers.length, shipments])

  const recentOrders = useMemo(() => {
    const sorted = [...procurements].sort((a, b) => {
      const aDate = new Date(a.order_date || 0).getTime()
      const bDate = new Date(b.order_date || 0).getTime()
      return bDate - aDate
    })

    const search = query.trim().toLowerCase()

    return sorted.filter((item) => {
      if (!search) return true
      const supplierName = supplierById[item.supplier_id]?.name || `Supplier #${item.supplier_id}`
      const haystack = [
        item.id,
        supplierName,
        item.status,
        item.total_amount,
        item.order_date,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(search)
    })
  }, [procurements, supplierById, query])

  const topSuppliers = useMemo(() => {
    const totals = procurements.reduce((acc, item) => {
      const key = item.supplier_id
      acc[key] = (acc[key] || 0) + (Number(item.total_amount) || 0)
      return acc
    }, {})

    return Object.entries(totals)
      .map(([supplierId, total]) => ({
        supplierId: Number(supplierId),
        name: supplierById[supplierId]?.name || `Supplier #${supplierId}`,
        total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3)
  }, [procurements, supplierById])

  const alerts = useMemo(() => {
    const list = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const delayed = shipments.filter((item) => {
      if (!item.expected_delivery) return false
      if (['delivered', 'cancelled'].includes((item.status || '').toLowerCase())) return false
      const expected = new Date(`${item.expected_delivery}T00:00:00`)
      if (Number.isNaN(expected.getTime())) return false
      return expected < today
    })

    if (delayed.length > 0) {
      list.push({
        level: 'danger',
        message: `Delayed Shipment Alert - ${delayed.length} shipment(s) are past expected delivery`,
      })
    }

    const pending = procurements.filter((item) => item.status === 'pending').length
    if (pending > 0) {
      list.push({
        level: 'warning',
        message: `Pending Orders Alert - ${pending} procurement order(s) awaiting approval`,
      })
    }

    const inactiveSuppliers = suppliers.filter((item) => item.status === 'inactive').length
    if (inactiveSuppliers > 0) {
      list.push({
        level: 'info',
        message: `${inactiveSuppliers} supplier(s) marked inactive`,
      })
    }






    if (list.length === 0) {
      list.push({
        level: 'info',
        message: 'No urgent supply chain alerts at the moment',
      })
    }

    return list
  }, [procurements, shipments, suppliers])






  //GET /api/procurements
  //GET /api/suppliers
  //GET /api/shipments

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-6 space-y-6">



        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Supply Chain Dashboard</h1>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>



        {error ? <p className="text-sm text-red-600">{error}</p> : null}






        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Inventory Worth"
            value={loading ? '...' : formatCurrency(stats.totalInventoryValue)}
            change={loading ? 'Loading data...' : `${procurements.length} procurement records`} // replace loading data
            color="text-green-500"
            icon="📦"
          />
          <StatCard
            title="Active Orders"
            value={loading ? '...' : stats.activeOrders}
            change={loading ? 'Loading data...' : `${procurements.length} total orders`}
            color="text-blue-500"
            icon="🛒"
          />
          <StatCard
            title="Suppliers"
            value={loading ? '...' : stats.suppliersCount}
            change={loading ? 'Loading data...' : `${suppliers.filter((s) => s.status === 'active').length} active`}
            color="text-green-500"
            icon="🚚" //add assets later 
          />




          <StatCard
            title="On-Time Delivery"
            value={loading ? '...' : stats.onTimeRate}
            change={loading ? 'Loading data...' : `${stats.deliveredShipments} delivered shipments`}
            color="text-green-500"
            icon="⏱️"
          />
        </div>

        {/* Charts (placeholders) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm h-64">
            <h3 className="font-semibold mb-2">Inventory Levels</h3>
            <div className="h-full flex items-center justify-center text-gray-400">
              cahrt dto
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm h-64">
            <h3 className="font-semibold mb-2">
              Supply Chain Performance
            </h3>
            <div className="h-full flex items-center justify-center text-gray-400">
              chart dito
            </div>
          </div>
        </div>



        {/* Tables + Side */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">




          {/* Recent Orders */}
          <div className="xl:col-span-2 bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-3">Recent Orders</h3>
            <table className="w-full text-sm">
              <thead className="text-gray-500">
                <tr>
                  <th className="text-left py-2">Order ID</th>
                  <th className="text-left">Supplier</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {(loading ? [] : recentOrders.slice(0, 6)).map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="py-2 text-left">#ORD-{String(order.id).padStart(3, '0')}</td>
                    <td className="py-2 text-left">{supplierById[order.supplier_id]?.name || `Supplier #${order.supplier_id}`}</td>
                    <td className={`py-2 text-center font-medium ${statusPill(order.status)}`}>{order.status}</td>
                    <td className="py-2 text-center">{formatCurrency(order.total_amount)}</td>
                    <td className="py-2 text-center">{formatShortDate(order.order_date)}</td>
                  </tr>
                ))}
                {!loading && recentOrders.length === 0 ? (
                  <tr className="border-t">
                    <td colSpan={5} className="py-4 text-center text-gray-500">No orders found.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>





          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-3">Top Suppliers</h3>
            <ul className="space-y-3 text-sm">
              {(loading ? [] : topSuppliers).map((supplier) => (
                <li key={supplier.supplierId} className="flex justify-between">
                  <span>{supplier.name}</span>
                  <span>{formatCurrency(supplier.total)}</span>
                </li>
              ))}
              {!loading && topSuppliers.length === 0 ? (
                <li className="text-gray-500">No supplier spend data yet.</li>
              ) : null}
            </ul>
          </div>
        </div>




        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-3">Supply Chain Alerts</h3>

          <div className="space-y-2 text-sm">
            {alerts.map((alert, index) => (
              <div
                key={`${alert.level}-${index}`}
                className={`p-3 rounded-lg ${
                  alert.level === 'danger'
                    ? 'bg-red-100 text-red-700'
                    : alert.level === 'warning'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                }`}
              >
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard