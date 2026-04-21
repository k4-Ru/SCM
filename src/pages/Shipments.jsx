import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../lib/api'

function formatDateTime(value) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function Shipments() {
  const [shipments, setShipments] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadShipments() {
      setLoading(true)
      setError('')

      try {
        const data = await apiRequest('/api/shipments')
        if (!active) return
        setShipments(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!active) return
        setError(err.message || 'Unable to load shipments')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadShipments()

    return () => {
      active = false
    }
  }, [])

  const filteredShipments = useMemo(() => {
    const search = query.trim().toLowerCase()
    if (!search) return shipments

    return shipments.filter((shipment) => {
      const haystack = [
        shipment.tracking_number,
        shipment.carrier,
        shipment.origin,
        shipment.destination,
        shipment.status,
        shipment.notes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(search)
    })
  }, [query, shipments])

  function getStatusStyles(status) {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700'
      case 'in_transit':
        return 'bg-blue-100 text-blue-700'
      case 'shipped':
        return 'bg-sky-100 text-sky-700'
      case 'approved':
        return 'bg-amber-100 text-amber-700'
      case 'cancelled':
        return 'bg-rose-100 text-rose-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Operations</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Shipments</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Track and manage shipments in real-time.
            </p>
          </div>

          <button className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
            + Create shipment
          </button>
        </header>

      

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by tracking number, carrier, origin, or destination"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {error ? (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[0, 1].map((index) => (
                <div key={index} className="h-[280px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
              ))}
            </div>
          ) : null}

          {!loading && filteredShipments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-base font-medium text-slate-900">No shipments found.</p>
              <p className="mt-2 text-sm text-slate-500">
                Try another search term or check whether the backend has shipment records.
              </p>
            </div>
          ) : null}

          {!loading && filteredShipments.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredShipments.map((ship) => (
                <article
                  key={ship.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{ship.tracking_number}</h2>
                      <p className="text-sm text-slate-500">{ship.carrier}</p>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(ship.status)}`}
                    >
                      {ship.status?.replaceAll('_', ' ') || 'pending'}
                    </span>
                  </div>

                  <div className="mb-4 space-y-1 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-900">From:</span> {ship.origin}
                    </p>
                    <p>
                      <span className="font-medium text-slate-900">To:</span> {ship.destination}
                    </p>
                  </div>

                  <hr className="my-4 border-slate-200" />

                  <div className="mb-4 flex justify-between gap-4 text-sm text-slate-600">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Shipped At</p>
                      <p className="mt-1 font-medium text-slate-900">{formatDateTime(ship.shipped_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Expected Delivery</p>
                      <p className="mt-1 font-medium text-slate-900">{formatDate(ship.expected_delivery)}</p>
                    </div>
                  </div>

                  <div className="mb-4 flex justify-between gap-4 text-sm text-slate-600">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Delivered At</p>
                      <p className="mt-1 font-medium text-slate-900">{formatDateTime(ship.delivered_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Procurement ID</p>
                      <p className="mt-1 font-medium text-slate-900">{ship.procurement_id}</p>
                    </div>
                  </div>

                  {ship.notes ? (
                    <p className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      {ship.notes}
                    </p>
                  ) : null}

                  <button className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    View Details
                  </button>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}

export default Shipments
