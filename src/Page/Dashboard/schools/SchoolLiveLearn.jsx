import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { LuCircleArrowLeft } from "react-icons/lu";
import { FiArrowRightCircle } from "react-icons/fi";
import DescriptionCard from "../../../Components/Cards/DescriptionCard";
const SchoolLiveLearn = () => {
  const [examId, setExamId] = useState("");
  const [examToDo, setExamToDo] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [showNoQuestionsMessage, setShowNoQuestionsMessage] = useState(false);
  const [viewedQuestions, setViewedQuestions] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id") || "";
    setExamId(id);
  }, [location.search]);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://congozi-backend.onrender.com/api/v1/exams/${examId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const examData = res.data.data;
        setExamToDo(examData);
        localStorage.setItem("live_exam_data", JSON.stringify(examData));
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    };
    if (examId) fetchExamDetails();
  }, [examId]);

  useEffect(() => {
    if (examToDo && examId) {
      setExamQuestions(examToDo?.questions || []);
      const storedTime = localStorage.getItem(`examTimeLeft_${examId}`);
      const initialTime = storedTime ? parseInt(storedTime, 10) : 3600; // 60 minutes
      setTimeLeft(initialTime);
    }
  }, [examToDo, examId]);

  useEffect(() => {
    if (!examId) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          localStorage.removeItem(`examTimeLeft_${examId}`);
          return 0;
        }
        const newTime = prevTime - 1;
        localStorage.setItem(`examTimeLeft_${examId}`, newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examId]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    const storedViewed = localStorage.getItem(`viewed_${examId}`);
    if (storedViewed) setViewedQuestions(JSON.parse(storedViewed));
  }, [examId]);

  useEffect(() => {
    localStorage.setItem(`viewed_${examId}`, JSON.stringify(viewedQuestions));
  }, [viewedQuestions, examId]);

  useEffect(() => {
    if (examToDo && examToDo.questions?.length === 0) {
      setShowNoQuestionsMessage(true);
    }
  }, [examToDo]);

  const handleSelectQuestion = (index) => {
    if (timeLeft <= 0) return;
    setSelectedQuestion(index);
    setViewedQuestions((prev) =>
      prev.includes(index) ? prev : [...prev, index]
    );
  };

  const currentQuestion = examQuestions[selectedQuestion];

  return (
    <div className="flex flex-col bg-white md:p-2 gap-2">
      {showNoQuestionsMessage ? (
        <div className="text-center mt-10 text-Total font-semibold">
          This exam has no questions. Please contact your administrator.
        </div>
      ) : (
        <>
          {timeLeft <= 0 ? (
            <div className="text-center text-red-600 font-bold mt-10">
              Igihe kirarangiye. Ntushobora gukomeza kwiga kuri iki kizamini.
            </div>
          ) : (
            <>
              <h1 className="md:text-md text-sm text-center md:py-1 py-3 font-bold text-Total capitalize">
                Ibisubizo by'ukuri biri mu ibara ry'icyatsi
              </h1>
              <DescriptionCard
                questions={examQuestions.length}
                total20={examQuestions.length * 1}
                total100={examQuestions.length * 5}
                pass20={((12 / 20) * examQuestions.length).toFixed(2)}
                pass100={((60 / 20) * examQuestions.length).toFixed(2)}
                number={examToDo?.number}
                type={examToDo?.type}
                timeLeft={formatTime(timeLeft)}
                access={examId}
              />

              <div className="flex flex-wrap justify-start py-1 md:gap-4 gap-2">
                {examQuestions.map((q, idx) => {
                  return (
                    <button
                      key={q._id}
                      onClick={() => handleSelectQuestion(idx)}
                      disabled={timeLeft <= 0}
                      className={`w-20 h-10 text-sm rounded-md flex justify-center items-center 
                      ${
                        selectedQuestion === idx
                          ? "bg-blue-500 text-white"
                          : viewedQuestions.includes(idx)
                          ? "bg-blue-500 text-white"
                          : "bg-white border"
                      }
                      ${timeLeft <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Ikibazo: {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="w-full px-3">
                {currentQuestion && (
                  <>
                    <h3 className="mb-0 md:text-md text-sm font-semibold">
                      Q{selectedQuestion + 1}. {currentQuestion.phrase}
                    </h3>
                    {currentQuestion.image && (
                      <img
                        src={currentQuestion.image}
                        alt="question"
                        className="w-16 h-16 rounded-full mb-1"
                      />
                    )}
                    <form className="space-y-1 md:text-md text-sm">
                      {currentQuestion.options.map((option, index) => {
                        const label = ["a", "b", "c", "d"][index];
                        return (
                          <div key={index} className="flex items-center gap-2">
                            <label
                              htmlFor={`option-${index}`}
                              className={`cursor-pointer ${
                                option.isCorrect
                                  ? "text-green-600 font-semibold"
                                  : ""
                              }`}
                            >
                              <span className="capitalize">{label}:</span>{" "}
                              {option.text}
                            </label>
                          </div>
                        );
                      })}
                    </form>

                    <div className="mt-4 flex justify-around flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handleSelectQuestion(
                            Math.max(selectedQuestion - 1, 0)
                          )
                        }
                        className={`text-white px-4 py-1 rounded flex items-center gap-2 ${
                          selectedQuestion === 0
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-blue-900"
                        }`}
                        disabled={selectedQuestion === 0}
                      >
                        <LuCircleArrowLeft />
                        Ikibanza
                      </button>

                      <button
                        onClick={() =>
                          handleSelectQuestion(
                            Math.min(
                              selectedQuestion + 1,
                              examQuestions.length - 1
                            )
                          )
                        }
                        className={`text-white px-4 py-1 rounded flex items-center gap-2 ${
                          selectedQuestion === examQuestions.length - 1
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-blue-900"
                        }`}
                        disabled={selectedQuestion === examQuestions.length - 1}
                      >
                        <FiArrowRightCircle />
                        Igikurikira
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SchoolLiveLearn;
