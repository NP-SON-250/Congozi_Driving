import React from "react";

const EditUserPopup = ({
  userToEdit,
  editedName,
  editedEmail,
  editedRole,
  editedStatus,
  setEditedName,
  setEditedEmail,
  setEditedRole,
  setEditedStatus,
  setShowEditPopup,
  handleSaveUserEdit,
}) => {
  if (!userToEdit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-3 py-1 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              className="w-full px-3 py-1 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              value={editedRole}
              onChange={(e) => setEditedRole(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
              <option value="School">School</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
            onClick={handleSaveUserEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserPopup;
