import React, { useState } from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { MdMoreHoriz } from "react-icons/md";
import ViewOptions from "./ViewOptions";
import EditQuestionPopup from "./EditQuestionPopup";
const ViewQuestions = ({ exam, onBack }) => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 4;

  const [viewOptionsQuestion, setViewOptionsQuestion] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [editedMarks, setEditedMarks] = useState("");
  const [editedPhrase, setEditedPhrase] = useState("");
  const [editedImage, setEditedImage] = useState("");

  const totalPages = Math.ceil(exam.questions.length / questionsPerPage);

  const toggleMenu = (index) => {
    setSelectedMenu(selectedMenu === index ? null : index);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Get the questions for the current page
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = exam.questions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  // Handle when the user clicks "View Options"
  const handleViewOptions = (question) => {
    setViewOptionsQuestion(question);
  };

  // Handle back to questions list
  const handleBackToQuestions = () => {
    setViewOptionsQuestion(null);
  };

  const handleEditClick = (question) => {
    setQuestionToEdit(question);
    setEditedMarks(question.marks);
    setEditedPhrase(question.questionPhrase);
    setEditedImage(question.image || "");
    setShowEditPopup(true);
  };

  const handleSaveQuestionEdit = () => {
    console.log("Updated Question:", {
      id: questionToEdit._id,
      marks: editedMarks,
      questionPhrase: editedPhrase,
      image: editedImage,
    });
    setShowEditPopup(false);
  };

  return (
    <div className="md:px-6 py-6 px-1">
      {viewOptionsQuestion ? (
        <ViewOptions
          question={viewOptionsQuestion}
          onBack={handleBackToQuestions}
          onEdit={() => alert("Edit functionality")}
          onDelete={() => alert("Delete functionality")}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Questions for: {exam.id}</h2>
            <button
              onClick={onBack}
              title="Back to exams"
              className="bg-gray-300 text-blue-900 px-4 py-2 text-2xl font-bold rounded hover:bg-gray-400"
            >
              <IoReturnUpBack size={24} />
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg shadow border border-blue-900">
            <table className="w-full text-left table-auto">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-1 whitespace-nowrap">Question</th>
                  <th className="px-6 py-1 whitespace-nowrap">Image</th>
                  <th className="px-6 py-1 whitespace-nowrap">Options</th>
                  <th className="px-6 py-1 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentQuestions.map((question, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-1 whitespace-nowrap">
                      {question.questionPhrase}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap">
                      {question.image ? (
                        <img
                          src={question.image}
                          alt="Q"
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap">
                      {question.options.length}
                    </td>
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
                              className="hover:bg-gray-100 px-4 py-1 cursor-pointer"
                              onClick={() => handleEditClick(question)}
                            >
                              Edit
                            </li>
                            <li className="hover:bg-gray-100 text-red-500 px-4 py-1 cursor-pointer">
                              Delete
                            </li>
                            <li className="hover:bg-gray-100 px-4 py-1 cursor-pointer">
                              Add Options
                            </li>
                            {question.options.length > 0 && (
                              <li
                                className="hover:bg-gray-100 px-4 py-1 cursor-pointer pb-2"
                                onClick={() => handleViewOptions(question)}
                              >
                                View {question.options.length} Options
                              </li>
                            )}
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
        </>
      )}
      {showEditPopup && (
        <EditQuestionPopup
          questionToEdit={questionToEdit}
          editedMarks={editedMarks}
          editedPhrase={editedPhrase}
          editedImage={editedImage}
          setEditedMarks={setEditedMarks}
          setEditedPhrase={setEditedPhrase}
          setEditedImage={setEditedImage}
          setShowEditPopup={setShowEditPopup}
          handleSaveEdit={handleSaveQuestionEdit}
        />
      )}
    </div>
  );
};

export default ViewQuestions;
