import React from "react";

const EditPaymentPopup = ({
  paymentToEdit,
  editedPayer,
  editedAmount,
  editedDate,
  editedStatus,
  setEditedPayer,
  setEditedAmount,
  setEditedDate,
  setEditedStatus,
  setShowEditPopup,
  handleSavePaymentEdit,
}) => {
  if (!paymentToEdit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Payment</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Payer</label>
            <input
              type="text"
              value={editedPayer}
              readOnly
              onChange={(e) => setEditedPayer(e.target.value)}
              className="w-full px-3 py-1 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="text"
              value={editedAmount}
              onChange={(e) => setEditedAmount(e.target.value)}
              className="w-full px-3 py-1 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              value={editedDate}
              onChange={(e) => setEditedDate(e.target.value)}
              className="w-full px-3 py-1 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-around gap-6">
          <button
            onClick={() => setShowEditPopup(false)}
            className="px-4 py-2 bg-red-300 text-gray-800 rounded hover:bg-red-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSavePaymentEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPaymentPopup;
