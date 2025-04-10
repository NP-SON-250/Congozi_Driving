import React, { useState } from "react";

const AddNewAccountPopup = ({ setShowAddAccountPopup }) => {
  const [accountTitle, setAccountTitle] = useState("");
  const [accountFees, setAccountFees] = useState("");
  const [accountValid, setAccountValid] = useState("");

  const handleSave = () => {
    // Logic for saving the new account, for now, just logging
    console.log("New Account Added:", { accountTitle, accountFees, accountValid });
    setShowAddAccountPopup(false); // Close the popup after saving
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add New Account
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="accountTitle" className="block text-sm text-gray-700">
              Account Title
            </label>
            <input
              type="text"
              id="accountTitle"
              value={accountTitle}
              onChange={(e) => setAccountTitle(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Valid Period</label>
            <input
              type="text"
              id="accountValid"
              value={accountValid}
              onChange={(e) => setAccountValid(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="accountFees" className="block text-sm text-gray-700">
              Account Fees
            </label>
            <input
              type="text"
              id="accountFees"
              value={accountFees}
              onChange={(e) => setAccountFees(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-around">
          <button
            onClick={() => setShowAddAccountPopup(false)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewAccountPopup;
