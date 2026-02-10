import { useState } from "react";

export default function ResourceTable({ data }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((resource) =>
    resource.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-gray-500 text-sm"
                >
                  No resources found
                </td>
              </tr>
            ) : (
              filteredData.map((resource) => (
                <tr key={resource._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {resource.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {resource.category || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        resource.stock < 100
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {resource.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {resource.location || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {resource.updatedAt
                      ? new Date(resource.updatedAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-3">
                      <button className="text-blue-600 hover:text-blue-900 font-medium text-xs">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900 font-medium text-xs">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
