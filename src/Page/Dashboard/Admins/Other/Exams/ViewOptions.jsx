import React, { useState } from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { MdMoreHoriz } from "react-icons/md";

const ViewOptions = ({ question, onBack, onEdit, onDelete }) => {
  const [selectedMenu, setSelectedMenu] = useState(null);

  const toggleMenu = (index) => {
    setSelectedMenu(selectedMenu === index ? null : index);
  };

  return (
    <div className="md:px-6 py-6 px-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-xl text-sm font-semibold">
          Question: {question.questionPhrase}
        </h2>
        <button
          onClick={onBack}
          title="Back to questions"
          className="bg-gray-300 text-blue-900 px-4 py-2 text-2xl font-bold rounded hover:bg-gray-400"
        >
          <IoReturnUpBack size={24} />
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-blue-900">
        <table className="w-full text-left table-auto relative">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-1 whitespace-nowrap">Option</th>
              <th className="px-6 py-1 whitespace-nowrap">Correct</th>
              <th className="px-6 py-1 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {question.options.map((option, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 relative">
                <td className="px-6 py-1 whitespace-nowrap">{option.text}</td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {option.isCorrect ? "True" : "False"}
                </td>
                <td className="px-6 py-1 text-right relative">
                  <button
                    onClick={() => toggleMenu(index)}
                    className="p-2 hover:bg-gray-200 rounded-full"
                  >
                    <MdMoreHoriz size={22} />
                  </button>

                  {selectedMenu === index && (
                    <div className="absolute right-4 top-10 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      <ul className="text-sm text-blue-900">
                        <li
                          className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                          onClick={() => {
                            onEdit(index);
                            setSelectedMenu(null);
                          }}
                        >
                          Edit
                        </li>
                        <li
                          className="hover:bg-gray-100 text-red-500 px-4 py-2 cursor-pointer"
                          onClick={() => {
                            onDelete(index);
                            setSelectedMenu(null);
                          }}
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
    </div>
  );
};

export default ViewOptions;
