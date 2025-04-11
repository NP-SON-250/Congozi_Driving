import React, { useState, useEffect } from "react";
import ExamsCard from "../../../Components/Cards/ExamsCard";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { examData } from "../../../Data/morkData";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import { SlNote } from "react-icons/sl";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import AutoTracking from "./AutoTracking";

const StudentWaiting = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [examsPerPage, setExamsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [fees, setFees] = useState("");
  const [isExamStarted, setIsExamStarted] = useState(false);

  const location = useLocation();
  const { accessCode } = queryString.parse(location.search);

  useEffect(() => {
    if (accessCode) setIsExamStarted(true);
  }, [accessCode]);

  useEffect(() => {
    const updateExamsPerPage = () => {
      setExamsPerPage(window.innerWidth >= 768 ? 6 : 2);
    };
    updateExamsPerPage();
    window.addEventListener("resize", updateExamsPerPage);
    return () => window.removeEventListener("resize", updateExamsPerPage);
  }, []);

  const filteredExams = examData.filter(
    (exam) =>
      (type === "" || exam.type.toLowerCase().includes(type.toLowerCase())) &&
      (fees === "" || exam.fees.toString().includes(fees)) &&
      (searchTerm === "" ||
        exam.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.fees.toString().includes(searchTerm) ||
        exam.number.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const currentExams = filteredExams.slice(
    currentPage * examsPerPage,
    (currentPage + 1) * examsPerPage
  );

  const navigate = useNavigate();

  const handleDoExam = (exam) => {
    if (exam.accessCode && exam.accessCode.length > 0) {
      const accessCode = exam.accessCode[0].code;
      navigate(`/students/waitingexams?accessCode=${accessCode}`);
      setIsExamStarted(true);
    } else {
      console.error("No access code available for this exam.");
    }
  };

  return (
    <div>
      {isExamStarted ? (
        <AutoTracking examNumber={accessCode} />
      ) : (
        <div className="flex flex-col justify-around items-center md:px-5 gap-1 bg-white">
          <WelcomeDear />
          <div className="grid md:grid-cols-3 grid-cols-2 justify-between items-center md:gap-32 gap-1 px-3 py-4">
            <input
              type="text"
              placeholder="---Select Exam Type---"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border-2 border-blue-500 p-2 rounded-xl"
            />
            <input
              type="text"
              placeholder="---Filter Exam Fees---"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              className="border-2 border-blue-500 p-2 rounded-xl"
            />
            <div className="w-full px-3 md:flex hidden">
              <input
                type="search"
                placeholder="Search Everything"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-blue-500 p-2 rounded-xl w-full"
              />
            </div>
          </div>

          <div className="w-full px-3 pb-3 flex md:hidden">
            <input
              type="search"
              placeholder="Search Everything"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-2 border-blue-500 p-2 rounded-xl w-full"
            />
          </div>

          {filteredExams.length === 0 ? (
            <p className="text-center py-4 text-red-500">No data found</p>
          ) : (
            <div className="grid md:grid-cols-3 w-full gap-4 md:gap-3 py-1">
              {currentExams.map((exam, index) => {
                const isLearn = exam.type.toLowerCase().includes("learn");
                const buttonColor = isLearn ? "bg-yellow-500" : "bg-green-500";
                return (
                  <ExamsCard
                    key={index}
                    {...exam}
                    onPurchase={() => handleDoExam(exam)}
                    icon={<SlNote />}
                    button={"Do Exam"}
                    buttonColor={buttonColor}
                  />
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-around md:gap-[900px] gap-[280px] md:pb-0 pb-10">
              <div>
              <button
                className={`text-blue-900 ${
                  currentPage === 0 ? "opacity-50" : ""
                }`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
              >
                <FaArrowAltCircleLeft size={24} />
              </button>
              </div>
              <div>
              <button
                className={`text-blue-900 ${
                  currentPage === totalPages - 1 ? "opacity-50" : ""
                }`}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                disabled={currentPage === totalPages - 1}
              >
                <FaArrowAltCircleRight size={24} />
              </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentWaiting;
