{/* Next & Previous Pagination */}
<div className="flex justify-center mt-4 gap-4 md:pb-0 pb-28">
<button
  onClick={() => paginate(currentPage - 1)}
  disabled={currentPage === 1}
  className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-500 text-white"}`}
>
  Previous
</button>
<button
  onClick={() => paginate(currentPage + 1)}
  disabled={currentPage === totalPages}
  className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-500 text-white"}`}
>
  Next
</button>
</div>