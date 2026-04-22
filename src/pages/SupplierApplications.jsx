import { useState } from 'react'
import { apiRequest } from '../lib/api'

function SupplierApplications() {
  const [resourceId, setResourceId] = useState('')
  const [listData, setListData] = useState([])
  const [selectedData, setSelectedData] = useState(null)
  const [createBody, setCreateBody] = useState('{\n  "company_name": "New Supplier",\n  "contact_person": "Jane Doe",\n  "email": "supplier@example.com"\n}')
  const [patchBody, setPatchBody] = useState('{\n  "status": "approved"\n}')
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
    run('List supplier applications', async () => {
      const data = await apiRequest('/api/supplier-applications')
      setListData(Array.isArray(data) ? data : [data])
    })
  }

  function handleReadOne() {
    if (!resourceId.trim()) {
      setError('Enter an application ID first.')
      return
    }

    run('Read supplier application', async () => {
      const data = await apiRequest(`/api/supplier-applications/${resourceId.trim()}`)
      setSelectedData(data)
    })
  }

  function handleCreate() {
    run('Create supplier application', async () => {
      const body = JSON.parse(createBody)
      const data = await apiRequest('/api/supplier-applications', {
        method: 'POST',
        body,
      })
      setSelectedData(data)
      handleList()
    })
  }

  function handleUpdate() {
    if (!resourceId.trim()) {
      setError('Enter an application ID first.')
      return
    }

    run('Update supplier application', async () => {
      const body = JSON.parse(patchBody)
      const data = await apiRequest(`/api/supplier-applications/${resourceId.trim()}`, {
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
        <h2 className="text-xl font-semibold">Supplier Applications</h2>
        <p className="text-gray-600 text-sm">Review workflow for supplier onboarding.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/supplier-applications</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">POST /api/supplier-applications</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/supplier-applications/{'{'}id{'}'}</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">PATCH /api/supplier-applications/{'{'}id{'}'}</span>
        </div>
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <button onClick={handleList} className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm">Refresh list</button>
          <input
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            placeholder="Application ID"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <button onClick={handleReadOne} className="px-3 py-2 rounded-md bg-slate-700 text-white text-sm">Get by ID</button>
          <button onClick={handleUpdate} className="px-3 py-2 rounded-md bg-amber-700 text-white text-sm">Patch</button>
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
            <button onClick={handleCreate} className="mt-2 px-3 py-2 rounded-md bg-emerald-700 text-white text-sm">Create</button>
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

export default SupplierApplications
