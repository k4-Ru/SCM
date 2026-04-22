import { useState } from 'react'
import { apiRequest } from '../lib/api'

function ActivityLogs() {
  const [listData, setListData] = useState([])
  const [createBody, setCreateBody] = useState('{\n  "action": "manual_audit",\n  "entity": "inventory",\n  "details": "Reviewed inventory state"\n}')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function run(label, handler) {
    setError('')
    setMessage('')
    try {
      await handler()
    } catch (err) {
      setError(`${label}: ${err.message || 'Request failed'}`)
    }
  }

  function handleList() {
    run('List activity logs', async () => {
      const data = await apiRequest('/api/activity-logs')
      setListData(Array.isArray(data) ? data : [data])
    })
  }

  function handleCreate() {
    run('Create activity log', async () => {
      const body = JSON.parse(createBody)
      const data = await apiRequest('/api/activity-logs', {
        method: 'POST',
        body,
      })
      setMessage('Activity log created.')
      setListData((prev) => [data, ...prev].filter(Boolean))
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Activity Logs</h2>
        <p className="text-gray-600 text-sm">Admin-only audit trail access.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/activity-logs</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">POST /api/activity-logs</span>
        </div>
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={handleList} className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm">Refresh list</button>
          <button onClick={handleCreate} className="px-3 py-2 rounded-md bg-emerald-700 text-white text-sm">Create log</button>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Create payload</p>
          <textarea
            value={createBody}
            onChange={(e) => setCreateBody(e.target.value)}
            rows={7}
            className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs"
          />
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

        <div>
          <p className="text-sm font-medium mb-2">List response</p>
          <pre className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs overflow-auto max-h-96">{JSON.stringify(listData, null, 2)}</pre>
        </div>
      </section>
    </div>
  )
}

export default ActivityLogs
