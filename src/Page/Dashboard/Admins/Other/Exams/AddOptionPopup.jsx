import React, { useState } from "react";

const AddOptionPopup = ({ question, onClose, onSave }) => {
  const [option, setOption] = useState({ text: "", isCorrect: "false" });

  const handleOptionChange = (value) => {
    setOption({ ...option, text: value });
  };

  const handleIsCorrectChange = (value) => {
    setOption({ ...option, isCorrect: value });
  };

  const handleSubmit = () => {
    if (option.text.trim() !== "") {
      const filledOption = {
        ...option,
        isCorrect: option.isCorrect === "true",
      };
      onSave(question._id, [filledOption]); // Send option as an array for consistency with backend
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Add Option</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Option text"
            value={option.text}
            onChange={(e) => handleOptionChange(e.target.value)}
            className="w-full border p-2 rounded-md mb-2"
          />
          <select
            value={option.isCorrect}
            onChange={(e) => handleIsCorrectChange(e.target.value)}
            className="w-full border p-2 rounded-md"
          >
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </div>

        <div className="flex justify-around gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-300 text-gray-800 rounded hover:bg-red-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOptionPopup;
