import React, { useState } from "react";
import { MdMoreHoriz } from "react-icons/md";
import { accountData } from "../../../Data/morkData"; // your provided accountData
import AddNewAccountPopup from "./Other/Accounts/AddNewAccountPopup"; // Updated import
import EditAccountPopup from "./Other/Accounts/EditAccountPopup"; // Import EditAccountPopup

const EXAMS_PER_PAGE = 4;

const AdminAccounts = () => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [accounts, setAccounts] = useState(accountData); // Replacing examData with accountData
  const [showAddAccountPopup, setShowAddAccountPopup] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState(null); // State for editing account
  const [accountToDelete, setAccountToDelete] = useState(null); // State for the account to delete
  const [editedTitle, setEditedTitle] = useState(""); // State for edited title
  const [editedFees, setEditedFees] = useState(""); // State for edited fees
  const [editedValid, setEditedValid] = useState(""); // State for edited valid status
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State to show delete confirmation

  const toggleMenu = (accountId) => {
    setSelectedMenu(selectedMenu === accountId ? null : accountId);
  };

  const handleEditClick = (account) => {
    setAccountToEdit(account);
    setEditedTitle(account.title);
    setEditedFees(account.fees);
    setEditedValid(account.valid);
    setSelectedMenu(null);
  };

  const handleDeleteClick = (account) => {
    setAccountToDelete(account);
    setShowDeleteConfirm(true); // Show the delete confirmation popup
    setSelectedMenu(null);
  };

  const handleDeleteAccount = () => {
    const updatedAccounts = accounts.filter((account) => account.id !== accountToDelete.id);
    setAccounts(updatedAccounts);
    setShowDeleteConfirm(false); // Close the delete confirmation popup
    setAccountToDelete(null); // Reset account to delete
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false); // Close the delete confirmation popup
    setAccountToDelete(null); // Reset account to delete
  };

  const handleSaveEdit = () => {
    const updatedAccounts = accounts.map((account) =>
      account.id === accountToEdit.id
        ? { ...accountToEdit, title: editedTitle, fees: editedFees, valid: editedValid }
        : account
    );
    setAccounts(updatedAccounts);
    setAccountToEdit(null); // Close the popup
  };

  const indexOfLastAccount = currentPage * EXAMS_PER_PAGE;
  const indexOfFirstAccount = indexOfLastAccount - EXAMS_PER_PAGE;
  const currentAccounts = accounts.slice(indexOfFirstAccount, indexOfLastAccount);
  const totalPages = Math.ceil(accounts.length / EXAMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedMenu(null);
  };

  return (
    <div className="md:px-6 py-6 px-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage All Accounts</h2>
        <button
          onClick={() => setShowAddAccountPopup(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add New
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-blue-900">
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-1 whitespace-nowrap">ID</th>
              <th className="px-6 py-1 whitespace-nowrap">Title</th>
              <th className="px-6 py-1 whitespace-nowrap">Fees</th>
              <th className="px-6 py-1 whitespace-nowrap">Valid</th>
              <th className="px-6 py-1 whitespace-nowrap">Exams Count</th>
              <th className="px-6 py-1 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAccounts.map((account, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-6 py-1 whitespace-nowrap">{account.id}</td>
                <td className="px-6 py-1 whitespace-nowrap">{account.title}</td>
                <td className="px-6 py-1 whitespace-nowrap">{account.fees}</td>
                <td className="px-6 py-1 whitespace-nowrap">{account.valid}</td>
                <td className="px-6 py-1 whitespace-nowrap">{account.exams.length}</td>
                <td className="px-6 py-1 text-right relative">
                  <button
                    onClick={() => toggleMenu(index)}
                    className="p-2 hover:bg-gray-200 rounded-full"
                  >
                    <MdMoreHoriz size={22} />
                  </button>
                  {selectedMenu === index && (
                    <div className="absolute right-6 mt-2 w-52 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      <ul className="text-sm text-blue-900">
                        <li
                          onClick={() => handleEditClick(account)}
                          className="hover:bg-gray-100 px-4 py-1 cursor-pointer"
                        >
                          Edit
                        </li>
                        <li
                          onClick={() => handleDeleteClick(account)}
                          className="hover:bg-gray-100 text-red-500 px-4 py-1 cursor-pointer"
                        >
                          Delete
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

      {/* Add New Account Popup */}
      {showAddAccountPopup && (
        <AddNewAccountPopup setShowAddAccountPopup={setShowAddAccountPopup} />
      )}

      {/* Edit Account Popup */}
      {accountToEdit && (
        <EditAccountPopup
          accountToEdit={accountToEdit}
          editedTitle={editedTitle}
          editedFees={editedFees}
          editedValid={editedValid}
          setEditedTitle={setEditedTitle}
          setEditedFees={setEditedFees}
          setEditedValid={setEditedValid}
          setShowEditPopup={setAccountToEdit}
          handleSaveEdit={handleSaveEdit}
        />
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[999] bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this account?
            </h2>
            <p className="text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex justify-around gap-6">
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccounts;
