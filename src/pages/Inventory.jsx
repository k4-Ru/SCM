import CrudPanel from '../components/CrudPanel'

function Inventory() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Inventory</h2>
        <p className="text-gray-600 text-sm">Mapped to /api/inventory for stock operations.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/inventory</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">POST /api/inventory</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/inventory/{'{'}id{'}'}</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">PATCH /api/inventory/{'{'}id{'}'}</span>
        </div>
      </div>

      <CrudPanel
        title="Inventory"
        basePath="/api/inventory"
        createSeed={{ product_id: 1, quantity: 0, location: 'Main warehouse' }}
        updateSeed={{ quantity: 0, location: 'Main warehouse' }}
        note="Inventory endpoints are restricted to superadmin, admin, procurement, and warehouse roles."
      />
    </div>
  )
}

export default Inventory
