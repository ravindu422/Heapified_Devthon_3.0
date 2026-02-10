export default function LowStockCard({ data }) {
  if (!data) return null;

  return (
    <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-red-800">Stock is Low</h3>
          <div className="mt-2 text-sm text-red-700">
            <p className="font-semibold">{data.name}</p>
            <p className="mt-1">
              {data.location && `Location: ${data.location}`}
            </p>
            <p className="mt-1">
              Current Stock: <span className="font-bold">{data.stock}</span> units
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
