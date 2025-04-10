import React, { useState } from "react";

const AddNewExamPopup = ({ setShowAddExamPopup }) => {
  const [examTitle, setExamTitle] = useState("");
  const [examFees, setExamFees] = useState("");

  const handleSave = () => {
    // Logic for saving the new exam, for now, just logging
    console.log("New Exam Added:", { examTitle, examFees });
    setShowAddExamPopup(false); // Close the popup after saving
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add New Exam
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="examTitle" className="block text-sm text-gray-700">
              Exam Title
            </label>
            <input
              type="text"
              id="examTitle"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select
              className="w-full border border-blue-900/20 rounded px-3 py-2 mt-1"
            >
              <option value="Active">Learn</option>
              <option value="Not Active">Test</option>
            </select>
          </div>
          <div>
            <label htmlFor="examFees" className="block text-sm text-gray-700">
              Exam Fees
            </label>
            <input
              type="text"
              id="examFees"
              value={examFees}
              onChange={(e) => setExamFees(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-around">
          <button
            onClick={() => setShowAddExamPopup(false)}
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

export default AddNewExamPopup;
