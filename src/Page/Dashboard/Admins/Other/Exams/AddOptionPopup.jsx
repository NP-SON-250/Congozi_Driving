import React, { useState } from "react";

const AddOptionPopup = ({ question, onClose, onSave }) => {
  const [options, setOptions] = useState([{ text: "", isCorrect: "false" }]);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
  };

  const handleIsCorrectChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].isCorrect = value;
    setOptions(updatedOptions);
  };

  const handleAddMore = () => {
    setOptions([...options, { text: "", isCorrect: "false" }]);
  };

  const handleSubmit = () => {
    const filledOptions = options
      .filter(opt => opt.text.trim() !== "")
      .map(opt => ({ ...opt, isCorrect: opt.isCorrect === "true" }));
    if (filledOptions.length > 0) {
      onSave(question._id, filledOptions);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Add Options</h2>

        {options.map((option, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option.text}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="w-full border p-2 rounded-md mb-2"
            />
            <select
              value={option.isCorrect}
              onChange={(e) => handleIsCorrectChange(index, e.target.value)}
              className="w-full border p-2 rounded-md"
            >
              <option value="false">False</option>
              <option value="true">True</option>
            </select>
          </div>
        ))}

        <button
          onClick={handleAddMore}
          className="text-blue-600 text-sm mb-4 hover:text-yellow-600"
        >
          + Add another option
        </button>

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
