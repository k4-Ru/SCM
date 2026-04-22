import CrudPanel from '../components/CrudPanel'

function Products() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Products</h2>
        <p className="text-gray-600 text-sm">Mapped to /api/products for catalog management.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/products</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">POST /api/products</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/products/{'{'}id{'}'}</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">PATCH /api/products/{'{'}id{'}'}</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">DELETE /api/products/{'{'}id{'}'}</span>
        </div>
      </div>

      <CrudPanel
        title="Products"
        basePath="/api/products"
        createSeed={{ name: 'Sample Product', sku: 'SKU-001', price: 0, status: 'active' }}
        updateSeed={{ name: 'Updated Product', price: 0 }}
        note="GET is available to all authenticated roles; write actions are restricted by backend role checks."
      />
    </div>
  )
}

export default Products
