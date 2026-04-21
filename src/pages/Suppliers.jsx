import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../lib/api'

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadSuppliers() {
      setLoading(true)
      setError('')

      try {
        const data = await apiRequest('/api/suppliers')
        if (!active) return
        setSuppliers(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!active) return
        setError(err.message || 'Unable to load suppliers')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadSuppliers()

    return () => {
      active = false
    }
  }, [])

  const filteredSuppliers = useMemo(() => {
    const search = query.trim().toLowerCase()
    if (!search) return suppliers

    return suppliers.filter((supplier) => {
      const haystack = [
        supplier.name,
        supplier.contact_person,
        supplier.email,
        supplier.phone,
        supplier.address,
        supplier.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(search)
    })
  }, [query, suppliers])

  function statusStyles(status) {
    return status === 'active'
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-slate-100 text-slate-600'
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Supplier Directory</h1>
          <p className="text-gray-500 text-sm mt-1">
            supplier list from the db
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {loading ? 'Loading suppliers...' : `${filteredSuppliers.length} supplier(s)`}
        </div>
      </div>

  

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search suppliers by name, contact, email, or status"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Supplier</th>
                <th className="px-4 py-3 text-left font-medium">Contact Person</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    Loading suppliers from the database...
                  </td>
                </tr>
              ) : filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{supplier.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <div>
                        <div>{supplier.name}</div>
                        <div className="mt-1 text-xs text-gray-500">{supplier.address || 'No address listed'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{supplier.contact_person || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{supplier.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{supplier.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles(supplier.status)}`}>
                        {supplier.status || 'unknown'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    No suppliers match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
};

export default Suppliers;