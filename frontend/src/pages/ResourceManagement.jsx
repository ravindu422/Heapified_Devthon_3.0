// pages/ResourceManagement.jsx
import { useEffect, useState } from "react";
import { fetchResources } from "../services/resourceService";
import ResourceTable from "../components/ResourceTable";
import LowStockCard from "../components/LowStockCard";
import DashboardLayout from "../components/dashboard/DashboardLayout";

export default function ResourceManagement() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources().then(res => setResources(res.data));
  }, []);

  const lowStock = resources.filter(r => r.stock < 100);

  return (
    <DashboardLayout activePage="resource">
      <div className="space-y-6">
        {/* Title + Action */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Resource Management Panel</h1>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Add New Resource Type +
          </button>
        </div>

        {/* Low Stock Alert */}
        {lowStock.length > 0 && (
          <LowStockCard data={lowStock[0]} />
        )}

        {/* Table */}
        <ResourceTable data={resources} />
      </div>
    </DashboardLayout>
  );
}
