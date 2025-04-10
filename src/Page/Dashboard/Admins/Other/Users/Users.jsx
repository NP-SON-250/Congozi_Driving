import React, { useState } from "react";
import { MdMoreHoriz } from "react-icons/md";
import EditUserPopup from "./EditUserPopup";
import DeleteUserPopup from "./DeleteUserPopup";
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Student",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Admin",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Robert Joe",
    email: "robert@example.com",
    role: "School",
    status: "Active",
  },
  {
    id: 4,
    name: "Alexis HAKIZIMANA",
    email: "alexis@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 5,
    name: "Katushabe Geofrey",
    email: "geofrey@example.com",
    role: "School",
    status: "Inactive",
  },
  {
    id: 6,
    name: "Linda Brown",
    email: "linda@example.com",
    role: "Student",
    status: "Active",
  },
];

const USERS_PER_PAGE = 4;

const Users = () => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [editedStatus, setEditedStatus] = useState("");

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const toggleMenu = (userId) => {
    setSelectedMenu(selectedMenu === userId ? null : userId);
  };

  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = mockUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(mockUsers.length / USERS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedMenu(null);
  };

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setEditedName(user.name);
    setEditedEmail(user.email);
    setEditedRole(user.role);
    setEditedStatus(user.status);
    setShowEditPopup(true);
    setSelectedMenu(null);
  };

  const handleSaveUserEdit = () => {
    console.log("Updated User:", {
      name: editedName,
      email: editedEmail,
      role: editedRole,
      status: editedStatus,
    });
    setShowEditPopup(false);
  };
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = () => {
    console.log("User Deleted:", userToDelete);
    setShowDeletePopup(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setUserToDelete(null);
  };
  return (
    <div className="md:px-6 py-6 px-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Users</h2>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-2">Name</th>
              <th className="px-6 py-2">Email</th>
              <th className="px-6 py-2">Role</th>
              <th className="px-6 py-2">Status</th>
              <th className="px-6 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-0 py-2 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-2 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-2 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-2 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-2 text-right relative">
                  <button
                    onClick={() => toggleMenu(user.id)}
                    className="p-2 hover:bg-gray-200 rounded-full"
                  >
                    <MdMoreHoriz size={22} />
                  </button>
                  {selectedMenu === user.id && (
                    <div className="absolute right-6 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      <ul className="text-sm text-gray-700">
                        <li
                          className="hover:bg-gray-100 px-4 py-1 cursor-pointer"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </li>
                        <li
                          className="hover:bg-gray-100 px-4 py-1 cursor-pointer"
                          onClick={() => handleDeleteClick(user)}
                        >
                          Delete
                        </li>
                        <li className="hover:bg-gray-100 px-4 py-1 cursor-pointer">
                          {user.status === "Inactive"
                            ? "Activate"
                            : "Deactivate"}
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>

        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
      {/* Edit User Popup */}
      {showEditPopup && (
        <EditUserPopup
          userToEdit={userToEdit}
          editedName={editedName}
          editedEmail={editedEmail}
          editedRole={editedRole}
          editedStatus={editedStatus}
          setEditedName={setEditedName}
          setEditedEmail={setEditedEmail}
          setEditedRole={setEditedRole}
          setEditedStatus={setEditedStatus}
          setShowEditPopup={setShowEditPopup}
          handleSaveUserEdit={handleSaveUserEdit}
        />
      )}
      {showDeletePopup && userToDelete && (
        <DeleteUserPopup
          user={userToDelete}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Users;
