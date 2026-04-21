import { useState } from 'react'
import { apiRequest } from '../lib/api'

function Analytics({ role }) {
  

  const canViewReports = ['superadmin', 'admin', 'procurement', 'warehouse'].includes(role)
  const canViewAdminReports = ['superadmin', 'admin'].includes(role)

  async function run(label, setter, endpoint) {
    setError('')
    try {
      const data = await apiRequest(endpoint)
      setter(data)
    } catch (err) {
      setError(`${label}: ${err.message || 'Request failed'}`)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Analytics</h2>
        <p className="text-gray-600 text-sm"> reports and .</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-md p-3">

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/reports/order-status</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/reports/supplier-performance</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/admin/suppliers</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/admin/orders</span>
        </div>
      </div>

    </div>
  )
}

export default Analytics
