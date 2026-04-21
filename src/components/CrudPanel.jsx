import { useMemo, useState } from 'react'
import { apiRequest } from '../lib/api'

function stringify(value) {
  return JSON.stringify(value, null, 2)
}

function readJsonInput(raw, fallback = {}) {
  if (!raw.trim()) return fallback
  return JSON.parse(raw)
}

function CrudPanel({
  title,
  basePath,
  createPath = basePath,
  listPath = basePath,
  detailPath = (id) => `${basePath}/${id}`,
  updatePath = (id) => `${basePath}/${id}`,
  deletePath = (id) => `${basePath}/${id}`,
  createMethod = 'POST',
  updateMethod = 'PATCH',
  createSeed = {},
  updateSeed = {},
  note,
}) {
  const [id, setId] = useState('')
  const [listData, setListData] = useState([])
  const [selectedData, setSelectedData] = useState(null)
  const [createBody, setCreateBody] = useState(stringify(createSeed))
  const [updateBody, setUpdateBody] = useState(stringify(updateSeed))
  const [error, setError] = useState('')
  const [busyAction, setBusyAction] = useState('')

  const hasId = useMemo(() => id.trim().length > 0, [id])

  async function run(actionName, task) {
    setBusyAction(actionName)
    setError('')

    try {
      await task()
    } catch (err) {
      setError(err.message || 'Request failed')
    } finally {
      setBusyAction('')
    }
  }

  function handleList() {
    run('list', async () => {
      const data = await apiRequest(listPath)
      setListData(Array.isArray(data) ? data : [data])
    })
  }

  function handleReadOne() {
    if (!hasId) {
      setError('Enter an ID first.')
      return
    }

    run('get', async () => {
      const data = await apiRequest(detailPath(id.trim()))
      setSelectedData(data)
    })
  }

  function handleCreate() {
    run('create', async () => {
      const body = readJsonInput(createBody, {})
      const data = await apiRequest(createPath, {
        method: createMethod,
        body,
      })
      setSelectedData(data)
      handleList()
    })
  }

  function handleUpdate() {
    if (!hasId) {
      setError('Enter an ID first.')
      return
    }

    run('update', async () => {
      const body = readJsonInput(updateBody, {})
      const data = await apiRequest(updatePath(id.trim()), {
        method: updateMethod,
        body,
      })
      setSelectedData(data)
      handleList()
    })
  }

  function handleDelete() {
    if (!hasId) {
      setError('Enter an ID first.')
      return
    }

    run('delete', async () => {
      await apiRequest(deletePath(id.trim()), { method: 'DELETE' })
      setSelectedData({ success: true, id: id.trim() })
      handleList()
    })
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {note ? <p className="text-sm text-gray-600 mt-1">{note}</p> : null}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={handleList} disabled={busyAction === 'list'} className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm">
          Refresh list
        </button>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Resource ID"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <button onClick={handleReadOne} disabled={busyAction === 'get'} className="px-3 py-2 rounded-md bg-slate-700 text-white text-sm">
          Get by ID
        </button>
        <button onClick={handleDelete} disabled={busyAction === 'delete'} className="px-3 py-2 rounded-md bg-rose-700 text-white text-sm">
          Delete
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
          <button onClick={handleCreate} disabled={busyAction === 'create'} className="mt-2 px-3 py-2 rounded-md bg-emerald-700 text-white text-sm">
            Create
          </button>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Update payload</p>
          <textarea
            value={updateBody}
            onChange={(e) => setUpdateBody(e.target.value)}
            rows={7}
            className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs"
          />
          <button onClick={handleUpdate} disabled={busyAction === 'update'} className="mt-2 px-3 py-2 rounded-md bg-amber-700 text-white text-sm">
            Update
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium mb-2">List response</p>
          <pre className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs overflow-auto max-h-72">
            {stringify(listData)}
          </pre>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Selected response</p>
          <pre className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs overflow-auto max-h-72">
            {stringify(selectedData)}
          </pre>
        </div>
      </div>
    </section>
  )
}

export default CrudPanel
