import React, { useState } from "react";
import { MdMoreHoriz } from "react-icons/md";
import EditPaymentPopup from "./EditPaymentPopup";
import DeletePaymentPopup from "./DeletePaymentPopup";

const mockPayments = [
  {
    id: 1,
    payer: "John Doe",
    amount: "$200",
    date: "2025-03-10",
    status: "Completed",
  },
  {
    id: 2,
    payer: "Jane Smith",
    amount: "$150",
    date: "2025-03-12",
    status: "Pending",
  },
  {
    id: 3,
    payer: "Robert Joe",
    amount: "$180",
    date: "2025-03-15",
    status: "Completed",
  },
  {
    id: 4,
    payer: "Alexis HAKIZIMANA",
    amount: "$220",
    date: "2025-03-16",
    status: "Failed",
  },
  {
    id: 5,
    payer: "Katushabe Geofrey",
    amount: "$210",
    date: "2025-03-17",
    status: "Completed",
  },
  {
    id: 6,
    payer: "Linda Brown",
    amount: "$160",
    date: "2025-03-18",
    status: "Pending",
  },
  {
    id: 7,
    payer: "Alexis HAKIZIMANA",
    amount: "$220",
    date: "2025-03-16",
    status: "Failed",
  },
  {
    id: 8,
    payer: "Katushabe Geofrey",
    amount: "$210",
    date: "2025-03-17",
    status: "Completed",
  },
  {
    id: 9,
    payer: "Linda Brown",
    amount: "$160",
    date: "2025-03-18",
    status: "Pending",
  },
  {
    id: 10,
    payer: "Alexis HAKIZIMANA",
    amount: "$220",
    date: "2025-03-16",
    status: "Failed",
  },
  {
    id: 11,
    payer: "Katushabe Geofrey",
    amount: "$210",
    date: "2025-03-17",
    status: "Completed",
  },
  {
    id: 12,
    payer: "Linda Brown",
    amount: "$160",
    date: "2025-03-18",
    status: "Pending",
  },
  {
    id: 13,
    payer: "Alexis HAKIZIMANA",
    amount: "$220",
    date: "2025-03-16",
    status: "Failed",
  },
  {
    id: 14,
    payer: "Katushabe Geofrey",
    amount: "$210",
    date: "2025-03-17",
    status: "Completed",
  },
  {
    id: 15,
    payer: "Linda Brown",
    amount: "$160",
    date: "2025-03-18",
    status: "Pending",
  },
];

const PAYMENTS_PER_PAGE = 4;

const Payments = () => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState(null);

  const [editedPayer, setEditedPayer] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [editedDate, setEditedDate] = useState("");
  const [editedStatus, setEditedStatus] = useState("");

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  const toggleMenu = (paymentId) => {
    setSelectedMenu(selectedMenu === paymentId ? null : paymentId);
  };

  const indexOfLastPayment = currentPage * PAYMENTS_PER_PAGE;
  const indexOfFirstPayment = indexOfLastPayment - PAYMENTS_PER_PAGE;
  const currentPayments = mockPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );
  const totalPages = Math.ceil(mockPayments.length / PAYMENTS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedMenu(null);
  };

  const handleEditClick = (payment) => {
    setPaymentToEdit(payment);
    setEditedPayer(payment.payer);
    setEditedAmount(payment.amount);
    setEditedDate(payment.date);
    setEditedStatus(payment.status);
    setShowEditPopup(true);
    setSelectedMenu(null);
  };

  const handleSavePaymentEdit = () => {
    console.log("Updated Payment:", {
      payer: editedPayer,
      amount: editedAmount,
      date: editedDate,
      status: editedStatus,
    });
    setShowEditPopup(false);
  };

  const handleDeleteClick = (payment) => {
    setPaymentToDelete(payment);
    setShowDeletePopup(true);
  };

  const handleCancelDelete = () => {
    setPaymentToDelete(null);
    setShowDeletePopup(false);
  };

  const handleConfirmDelete = () => {
    console.log("Payment Deleted:", paymentToDelete);

    setShowDeletePopup(false);
    setPaymentToDelete(null);
  };
  return (
    <div className="md:px-6 py-6 px-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage All Payments</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-blue-900">
        <table className="w-full text-left table-auto ">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-1">Payer</th>
              <th className="px-6 py-1">Amount</th>
              <th className="px-6 py-1">Date</th>
              <th className="px-6 py-1">Status</th>
              <th className="px-6 py-1 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.map((payment) => (
              <tr key={payment.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-1 whitespace-nowrap">{payment.payer}</td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {payment.amount}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">{payment.date}</td>
                <td className="px-6 py-1 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : payment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-1 text-right relative">
                  <button
                    onClick={() => toggleMenu(payment.id)}
                    className="p-2 hover:bg-gray-200 rounded-full"
                  >
                    <MdMoreHoriz size={22} />
                  </button>
                  {selectedMenu === payment.id && (
                    <div className="absolute right-6 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      <ul className="text-sm text-gray-700">
                        <li
                          className="hover:bg-gray-100 px-4 py-1 cursor-pointer"
                          onClick={() => handleEditClick(payment)}
                        >
                          Edit
                        </li>
                        <li
                          className="hover:bg-gray-100 px-4 py-1 cursor-pointer"
                          onClick={() => handleDeleteClick(payment)}
                        >
                          Delete
                        </li>
                        <li className="hover:bg-gray-100 px-4 py-1 cursor-pointer">
                          {payment.status === "Pending"
                            ? "Request to Approve"
                            : ""}
                          {payment.status === "Failed" ? "Restart" : ""}
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

      {/* Pagination Controls */}
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
      {showEditPopup && (
        <EditPaymentPopup
          paymentToEdit={paymentToEdit}
          editedPayer={editedPayer}
          editedAmount={editedAmount}
          editedDate={editedDate}
          editedStatus={editedStatus}
          setEditedPayer={setEditedPayer}
          setEditedAmount={setEditedAmount}
          setEditedDate={setEditedDate}
          setEditedStatus={setEditedStatus}
          setShowEditPopup={setShowEditPopup}
          handleSavePaymentEdit={handleSavePaymentEdit}
        />
      )}
      {showDeletePopup && paymentToDelete && (
        <DeletePaymentPopup
          payment={paymentToDelete}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Payments;
