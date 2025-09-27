import DashboardLayout from "@/components/DashboardLayout";

export default function ClientDashboard() {
  return (
    <DashboardLayout
      title="Dashboard Cliente"
      description="Panel de control para clientes"
    >
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Bienvenido, Cliente
          </h3>
        </div>
      </div>
    </DashboardLayout>
  );
}
