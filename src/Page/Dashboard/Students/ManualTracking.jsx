import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import Police from "../../../assets/Policelogo.png";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import { examData } from "../../../Data/morkData";

const ManualTracking = () => {
  const [examCode, setExamCode] = useState("");
  const [searchedCode, setSearchedCode] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [examDetails, setExamDetails] = useState(null);
  const [grantedUsers, setGrantedUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (examCode.trim() !== "") {
      setSearchedCode(examCode); // Store original typed value
      const selectedExam = examData.find((exam) =>
        exam.accessCode.some((access) => access.code === examCode)
      );

      if (selectedExam) {
        setExamDetails(selectedExam);
        const matchedAccess = selectedExam.accessCode.find(
          (access) => access.code === examCode
        );
        setGrantedUsers(matchedAccess?.users || []);
      } else {
        setExamDetails(null);
        setGrantedUsers([]);
      }

      setIsSearched(true);
    }
  };

  const handleNotReady = () => {
    setExamCode("");
    setSearchedCode("");
    setIsSearched(false);
    setShowAllUsers(false);
    navigate(`/students/tracking`);
  };

  const handleStartExam = () => {
    navigate(`/liveExam?examId=${searchedCode}`);
  };

  return (
    <div className="flex flex-col justify-center items-center md:px-5 gap-1 bg-white md:pb-0 pb-32  ">
      <WelcomeDear />

      <div className="flex flex-col gap-2 w-full border border-gray-400 rounded-md md:mt-2 mt-16">
        <div className="flex justify-center items-center gap-3 border border-gray-400 text-center w-full bg-blue-100 py-0 rounded-md">
          <MdOutlineContentPasteSearch size={24} className="text-blue-900" />
          <h1 className="text-center md:text-3xl text-base text-blue-900">
            Examination Tracking Center
          </h1>
        </div>

        {!isSearched ? (
          <div className="flex flex-col justify-center">
            <div className="flex justify-center items-center">
              <img src={Police} alt="Police Logo" className="w-24 py-3" />
            </div>
            <div className="flex flex-col gap-4">
              <p className="capitalize font-bold text-lg text-center">
                Enter your examination access code
              </p>
              <div className="w-full md:px-3 md:pb-16 flex justify-center items-center px-6 pb-24">
                <input
                  type="search"
                  value={examCode}
                  onChange={(e) => setExamCode(e.target.value)}
                  placeholder="Search exam code"
                  className="border-2 px-5 border-blue-500 p-2 rounded-full md:w-1/2 w-full outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="absolute md:right-[263px] right-4 bg-blue-500 cursor-pointer rounded-r-full p-[10px] text-white"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center px-2">
            {examDetails ? (
              <div>
                <table className="border-collapse border border-gray-500 w-full">
                  <tbody>
                    <tr className="bg-gray-100">
                      <td
                        colSpan="2"
                        className="border border-gray-400 px-1 md:text-base text-xs text-center text-blue-800"
                      >
                        Examination Details
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-1 font-bold">
                        Exam Title
                      </td>
                      <td className="border border-gray-400 px-1">
                        {examDetails.title}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-1 font-bold">
                        Exam Access Code
                      </td>
                      <td className="border border-gray-400 px-1">
                        {searchedCode}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-1 font-bold">
                        Fees
                      </td>
                      <td className="border border-gray-400 px-1">
                        {examDetails.fees}
                      </td>
                    </tr>

                    {grantedUsers.length > 0 && (
                      <>
                        <tr>
                          <td className="border border-gray-400 px-1 md:text-base text-xs bg-blue-100 text-center text-blue-900">
                            Students Granted Access:
                          </td>
                          <td className="border border-gray-400 px-1 md:text-base text-xs bg-blue-100 text-center text-blue-900">
                            {grantedUsers.length} Students
                          </td>
                        </tr>

                        {(showAllUsers ? grantedUsers : [grantedUsers[0]]).map(
                          (user, index) => {
                            const ordinal = [
                              "First",
                              "Second",
                              "Third",
                              "Fourth",
                              "Fifth",
                            ];
                            const studentLabel =
                              ordinal[index] || `Student ${index + 1}`;
                            return (
                              <React.Fragment key={index}>
                                <tr className="bg-gray-100">
                                  <td
                                    colSpan="2"
                                    className="border border-gray-400 px-1 md:text-base text-xs text-center text-blue-800"
                                  >
                                    {studentLabel} Student Details
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-400 px-1">
                                    Student's Name
                                  </td>
                                  <td className="border border-gray-400 px-1">
                                    {user.names}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-400 px-1">
                                    Student Address
                                  </td>
                                  <td className="border border-gray-400 px-1">
                                    {user.address}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border border-gray-400 px-1">
                                    Student Phone
                                  </td>
                                  <td className="border border-gray-400 px-1">
                                    {user.phone}
                                  </td>
                                </tr>
                              </React.Fragment>
                            );
                          }
                        )}

                        {grantedUsers.length > 1 && (
                          <tr>
                            <td colSpan="2" className="text-center py-2">
                              <button
                                className="text-blue-600 hover:text-yellow-500 cursor-pointer"
                                onClick={() => setShowAllUsers((prev) => !prev)}
                              >
                                {showAllUsers
                                  ? "Less Students"
                                  : "More Students"}
                              </button>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-red-500 text-center">Exam not found</p>
            )}

            {/* Start Exam Buttons */}
            <div className="flex md:flex-row flex-col justify-center w-full items-center gap-4 md:py-2 py-6">
              <p>Are you ready to start the exam?</p>
              <div className="flex gmd:ap-32 gap-6 ">
                <button
                  className="bg-blue-500 text-white px-4 py-2 md:w-[100px] w-[80px]  rounded-full"
                  onClick={handleStartExam}
                >
                  Yes
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 md:w-[200px] w-[160px] rounded-full"
                  onClick={handleNotReady}
                >
                  I'm Not Ready
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualTracking;
