import CrudPanel from '../components/CrudPanel'

function Inventory() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Inventory / Procurements</h2>
      <p className="text-gray-600 text-sm">
        inventory flow.
      </p>
      <div className="bg-white rounded-lg border border-gray-200 p-3">

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/procurements</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">POST /api/procurements</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">PATCH /api/procurements</span>
        </div>
      </div>
   
    </div>
  )
}

export default Inventory
