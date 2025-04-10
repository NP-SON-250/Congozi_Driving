<td className="px-6 py-1 text-right">
  <button
    onClick={() => onEdit(index)}
    className="px-4 py-2 hover:bg-gray-200 rounded"
  >
    Edit
  </button>
  <button
    onClick={() => onDelete(index)}
    className="px-4 py-2 text-red-500 hover:bg-gray-200 rounded"
  >
    Delete
  </button>
</td>;
