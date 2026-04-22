import { useState } from 'react'
import { FaArrowsRotate, FaMagnifyingGlass, FaPenToSquare, FaPlus } from 'react-icons/fa6'
import { apiRequest } from '../lib/api'

function Notifications() {
  const [resourceId, setResourceId] = useState('')
  const [listData, setListData] = useState([])
  const [selectedData, setSelectedData] = useState(null)
  const [createBody, setCreateBody] = useState('{\n  "title": "System notice",\n  "message": "Inventory has been updated"\n}')
  const [patchBody, setPatchBody] = useState('{\n  "is_read": true\n}')
  const [error, setError] = useState('')

  async function run(label, handler) {
    setError('')
    try {
      await handler()
    } catch (err) {
      setError(`${label}: ${err.message || 'Request failed'}`)
    }
  }

  function handleList() {
    run('List notifications', async () => {
      const data = await apiRequest('/api/notifications')
      setListData(Array.isArray(data) ? data : [data])
    })
  }

  function handleReadOne() {
    if (!resourceId.trim()) {
      setError('Enter a notification ID first.')
      return
    }

    run('Read notification', async () => {
      const data = await apiRequest(`/api/notifications/${resourceId.trim()}`)
      setSelectedData(data)
    })
  }

  function handleCreate() {
    run('Create notification', async () => {
      const body = JSON.parse(createBody)
      const data = await apiRequest('/api/notifications', {
        method: 'POST',
        body,
      })
      setSelectedData(data)
      handleList()
    })
  }

  function handleUpdate() {
    if (!resourceId.trim()) {
      setError('Enter a notification ID first.')
      return
    }

    run('Update notification', async () => {
      const body = JSON.parse(patchBody)
      const data = await apiRequest(`/api/notifications/${resourceId.trim()}`, {
        method: 'PATCH',
        body,
      })
      setSelectedData(data)
      handleList()
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Notifications</h2>
        <p className="text-gray-600 text-sm">Own notifications for everyone; admin can view all.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/notifications</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">POST /api/notifications</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">PATCH /api/notifications/{'{'}id{'}'}</span>
        </div>
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <button onClick={handleList} className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm inline-flex items-center gap-2">
            <FaArrowsRotate className="text-xs" />
            <span>Refresh list</span>
          </button>
          <input
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            placeholder="Notification ID"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <button onClick={handleReadOne} className="px-3 py-2 rounded-md bg-slate-700 text-white text-sm inline-flex items-center gap-2">
            <FaMagnifyingGlass className="text-xs" />
            <span>Get by ID</span>
          </button>
          <button onClick={handleUpdate} className="px-3 py-2 rounded-md bg-amber-700 text-white text-sm inline-flex items-center gap-2">
            <FaPenToSquare className="text-xs" />
            <span>Patch</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Create payload</p>
            <textarea
              value={createBody}
              onChange={(e) => setCreateBody(e.target.value)}
              rows={7}
              className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs"
            />
            <button onClick={handleCreate} className="mt-2 px-3 py-2 rounded-md bg-emerald-700 text-white text-sm inline-flex items-center gap-2">
              <FaPlus className="text-xs" />
              <span>Create</span>
            </button>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Patch payload</p>
            <textarea
              value={patchBody}
              onChange={(e) => setPatchBody(e.target.value)}
              rows={7}
              className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs"
            />
          </div>
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">List response</p>
            <pre className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs overflow-auto max-h-72">{JSON.stringify(listData, null, 2)}</pre>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Selected response</p>
            <pre className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs overflow-auto max-h-72">{JSON.stringify(selectedData, null, 2)}</pre>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Notifications
