import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState } from "react";

const AddUserPopup = ({
  newName,
  newEmail,
  newRole,
  newStatus,
  newTelephone,
  setNewName,
  setNewEmail,
  setNewRole,
  setNewStatus,
  setNewTelephone,
  setShowAddPopup,
  handleAddUser,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New User</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border px-4 py-1 rounded"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-1 rounded"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Telephone"
            className="w-full border px-4 py-1 rounded"
            value={newTelephone}
            onChange={(e) => setNewTelephone(e.target.value)}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border px-4 py-1 rounded pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <select
            className="w-full border px-4 py-1 rounded"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="Student">Student</option>
            <option value="School">School</option>
            <option value="Admin">Admin</option>
          </select>
          <select
            className="w-full border px-4 py-1 rounded"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="flex justify-around space-x-4 mt-6">
          <button
            onClick={() => setShowAddPopup(false)}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserPopup;
