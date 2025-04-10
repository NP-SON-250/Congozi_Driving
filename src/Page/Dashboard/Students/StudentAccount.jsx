import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import Police from "../../../assets/Policelogo.png";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";

const StudentAccount = () => {
  const [isSearched, setIsSearched] = useState(false);
  const [examCode, setExamCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Exam details (hardcoded except for Exam Access Code)
  const examDetails = {
    studentName: "UMURERWA Anaise",
    studentAddress: "Nyagatare, Rwanda",
    studentPhone: "25078xxxxxxx",
    examAccessCode: examCode, // Dynamic value
    examRegisteredDate: "17-03-2025 08:37:42 PM",
    examValueDate: "20-03-2025 12:00:00 AM",
    grantedAccessStatus: "Granted Access",
  };

  const params = new URLSearchParams(location.search);
  useEffect(() => {
    const initialExamNumber = params.get("examNumber") || "";
    setExamCode(initialExamNumber);
  }, [params]);

  // Handle search click
  const handleSearch = () => {
    if (examCode.trim() !== "") {
      setIsSearched(true);
    }
  };

  const handleNotReady = () => {
    setExamCode("");
    setIsSearched(false);
  };

  const handleStartExam = () => {
    navigate(`/liveExam?examNumber=${examCode}`);
  };

  return (
    <div className="flex flex-col justify-center items-center md:px-5 gap-1 bg-white">
      <WelcomeDear/>

      <div className="flex flex-col gap-2 w-full border border-gray-400 rounded-md mt-2 ">
        <div className="flex justify-center items-center gap-3 border border-gray-400 text-center w-full bg-blue-100 py-0 rounded-md">
          <MdOutlineContentPasteSearch size={24} className="text-blue-900" />
          <h1 className=" text-center md:text-3xl text-base text-blue-900">
            Examination Tracking Center
          </h1>
        </div>

        {/* Conditional Rendering based on Search */}
        {!isSearched ? (
          // Search Input Section
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
                  className="absolute md:right-[263px] right-6 bg-blue-500 cursor-pointer rounded-r-full p-2 text-white"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Exam Details Section
          <div className="flex flex-col justify-center p-2">
            <h2 className="text-xl font-bold text-center">Examination Details</h2>
            <table className="border-collapse border border-gray-500 w-full mt-2">
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-1 font-bold">Student’s Name</td>
                  <td className="border border-gray-400 p-1">{examDetails.studentName}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-1 font-bold">Student Address</td>
                  <td className="border border-gray-400 p-1">{examDetails.studentAddress}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-1 font-bold">Student Phone</td>
                  <td className="border border-gray-400 p-1">{examDetails.studentPhone}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-1 font-bold">Exam Access Code</td>
                  <td className="border border-gray-400 p-1">{examDetails.examAccessCode}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-1 font-bold">Exam Registered Date</td>
                  <td className="border border-gray-400 p-1">{examDetails.examRegisteredDate}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-1 font-bold">Exam Value Date</td>
                  <td className="border border-gray-400 p-1">{examDetails.examValueDate}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-1 font-bold">Granted Access Status</td>
                  <td className="border border-gray-400 p-1">{examDetails.grantedAccessStatus}</td>
                </tr>
              </tbody>
            </table>

            {/* Exam Start Buttons */}
            <div className="flex md:flex-row flex-col justify-center items-center gap-4 mt-5">
              <p>Are you ready to start exam?</p>
              <div className="flex gap-32">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleStartExam}>Yes</button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-md" onClick={handleNotReady}>I'm Not Ready</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAccount;
