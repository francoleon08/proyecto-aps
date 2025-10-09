import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-xl p-8 text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          🚫 Acceso Denegado
        </h1>
        <p className="text-gray-700 mb-6">
          No tenés permisos para acceder a esta sección.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
