import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../lib/api'

function Orders() {
  const [orders, setOrders] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadOrders() {
      setLoading(true)
      setError('')

      try {
        const data = await apiRequest('/api/admin/orders')
        if (!active) return
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!active) return
        setError(err.message || 'Unable to load orders')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadOrders()

    return () => {
      active = false
    }
  }, [])

  const filteredOrders = useMemo(() => {
    const search = query.trim().toLowerCase()
    if (!search) return orders

    return orders.filter((order) => {
      const haystack = [
        order.id,
        order.order_id,
        order.supplier,
        order.supplier_name,
        order.status,
        order.amount,
        order.total_amount,
        order.date,
        order.order_date,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(search)
    })
  }, [orders, query])

  function getOrderId(order) {
    return order.order_id || order.id || '—'
  }

  function getSupplier(order) {
    return order.supplier_name || order.supplier || order.vendor || '—'
  }

  function getStatus(order) {
    return order.status || '—'
  }

  function getAmount(order) {
    const value = order.total_amount ?? order.amount ?? order.total ?? 0
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(Number(value) || 0)
  }

  function getDate(order) {
    const value = order.order_date || order.date || order.created_at || order.createdAt
    if (!value) return '—'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">
            Live admin order report from the database.
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {loading ? 'Loading orders...' : `${filteredOrders.length} order(s)`}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/admin/orders</span>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search orders by ID, supplier, status, amount, or date"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Order ID</th>
                <th className="px-4 py-3 text-left font-medium">Supplier</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Amount</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    Loading orders from the database...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr key={order.id ?? order.order_id ?? index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{getOrderId(order)}</td>
                    <td className="px-4 py-3 text-gray-700">{getSupplier(order)}</td>
                    <td className="px-4 py-3 text-gray-700">{getStatus(order)}</td>
                    <td className="px-4 py-3 text-gray-700">{getAmount(order)}</td>
                    <td className="px-4 py-3 text-gray-700">{getDate(order)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    No orders match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Orders
