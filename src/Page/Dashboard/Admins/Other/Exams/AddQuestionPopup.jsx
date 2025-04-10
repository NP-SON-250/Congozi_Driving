import React, { useState } from "react";
import { GoPaperclip } from "react-icons/go";

const AddQuestionPopup = ({ addQuestion, setAddQuestion}) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [newMarks, setNewMarks] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  if (!addQuestion) return null;

  // Images
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleClick = () => {
    document.getElementById("file-upload").click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <h3 className="text-xl font-semibold mb-4">Add New Question</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              New Question
            </label>
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full border border-blue-900 opacity-20 rounded px-3 py-1 mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Question Marks
            </label>
            <input
              type="number"
              value={newMarks}
              onChange={(e) => setNewMarks(e.target.value)}
              className="w-full border border-blue-900 opacity-20 rounded px-3 py-1 mt-1"
            />
          </div>
          <div
            className="flex cursor-pointer lg:w-28 w-28 border-desired"
            onClick={handleClick}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <GoPaperclip className="lg:w-6 lg:h-6 w-6 h-6 text-tblue mr-2" />
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Profile"
                className="lg:w-6 lg:h-6 w-12 h-12 rounded-full object-cover ml-2"
              />
            ) : (
              <span className="text-pcolor lg:text-sm lg:mt-3 mt-1 text-xl font-bold">
                Choose..
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-around gap-24">
          <button
            onClick={() => setAddQuestion(false)}
            className="px-4 py-2 bg-red-300 text-gray-800 rounded hover:bg-red-400"
          >
            Cancel
          </button>
          <button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionPopup;
