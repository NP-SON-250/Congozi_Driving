import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BsCart } from "react-icons/bs";
import { GrSend } from "react-icons/gr";
import { LuCircleArrowLeft } from "react-icons/lu";
import { FiArrowRightCircle } from "react-icons/fi";
import DescriptionCard from "../../../Components/Cards/DescriptionCard";
const LiveLearn = () => {
  const [examCode, setExamCode] = useState("");
  const [paidExam, setPaidExam] = useState(null);
  const [testExam, setTestExam] = useState(null);
  const [examToDo, setExamToDo] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [examFinished, setExamFinished] = useState(false);
  const [reviewResults, setReviewResults] = useState(false);
  const [showNoQuestionsMessage, setShowNoQuestionsMessage] = useState(false);
  const [paymentPopup, setPaymentPopup] = useState(false);
  const [interactedQuestions, setInteractedQuestions] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code") || "";
    setExamCode(code);
  }, [location.search]);

  useEffect(() => {
    const fetchPaidExam = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:4900/api/v1/purchases/access/${examCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPaidExam(res.data.data.itemId);
      } catch (error) {
        console.error("Error fetching paid exam:", error);
      }
    };
    if (examCode) fetchPaidExam();
  }, [examCode]);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const examId = paidExam?.examId || paidExam?._id;
        if (!examId) return;
        const res = await axios.get(
          `http://localhost:4900/api/v1/exams/${examId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const examData = res.data.data;
        setExamToDo(examData);
        localStorage.setItem("live_exam_data", JSON.stringify(examData));
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    };
    if (paidExam) fetchExamDetails();
  }, [paidExam]);

  useEffect(() => {
    if (examToDo && examCode) {
      setExamQuestions(examToDo.questions || []);
      const storedTime = localStorage.getItem(`examTimeLeft_${examCode}`);
      const initialTime = storedTime ? parseInt(storedTime, 10) : 1200;
      setTimeLeft(initialTime);
    }
  }, [examToDo, examCode]);

  useEffect(() => {
    if (examFinished || !examCode) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          localStorage.removeItem(`examTimeLeft_${examCode}`);
          handleSubmitExam();
          return 0;
        }
        const newTime = prevTime - 1;
        localStorage.setItem(`examTimeLeft_${examCode}`, newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examFinished, examCode]);

  const handleSubmitExam = () => {
    let score = 0;
    examQuestions.forEach((q) => {
      const selectedOptionId = selectedOptions[q._id];
      const correctOption = q.options.find((opt) => opt.isCorrect);
      if (selectedOptionId && selectedOptionId === correctOption?._id) {
        score++;
      }
    });
    setTotalMarks(score);
    setExamFinished(true);
    localStorage.removeItem(`examTimeLeft_${examCode}`);
  };

  const handleReviewResults = () => setReviewResults(true);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (examToDo && examToDo.questions?.length === 0) {
      setShowNoQuestionsMessage(true);
    }
  }, [examToDo]);

  const fetchTestExam = async () => {
    try {
      const token = localStorage.getItem("token");
      const number = paidExam?.number;

      if (!number) {
        console.warn("No number found to fetch test exam");
        return;
      }

      // Fetch the list of purchased exams for the current user
      const purchaseRes = await axios.get(
        "http://localhost:4900/api/v1/purchases/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Check if the current exam is in the list of purchased exams
      const purchasedExams = purchaseRes.data.data;
      const examPurchased = purchasedExams.some(
        (purchase) => purchase.accessCode === examCode
      );

      if (examPurchased) {
        // If the exam is purchased, fetch the test exam details
        const res = await axios.get(
          `http://localhost:4900/api/v1/exams/test/${number}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const TestData = res.data.data;
        setTestExam(TestData);
        localStorage.setItem("test_exam_data", JSON.stringify(TestData));
      } else {
      }
    } catch (error) {
      console.error("Error fetching test exam:", error);
    }
  };

  const handleShowPaymentPopup = async () => {
    await fetchTestExam();
    setPaymentPopup(true);
  };

  const handleClosePaymentPopup = () => {
    setPaymentPopup(false);
  };
  const handlePayLaterClick = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:4900/api/v1/purchases/${testExam._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleClosePaymentPopup();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("You have already purchased this exam.");
      } else {
        console.error("Purchase request failed:", error);
        alert("Failed to initiate purchase. Please try again.");
      }
    }
  };
  const handleSelectQuestion = (index) => {
    setSelectedQuestion(index);
    if (!interactedQuestions.includes(index)) {
      setInteractedQuestions((prev) => [...prev, index]);
    }
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
          {!reviewResults && (
            <>
              <h1 className="md:text-xl text-center md:py-1 py-3 font-bold text-Total capitalize">
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
                access={examCode}
              />

              <div className="flex flex-wrap justify-start py-1 md:gap-4 gap-2">
                {examQuestions.map((q, idx) => {
                  const isCurrent = selectedQuestion === idx;
                  const isInteracted = interactedQuestions.includes(idx);

                  return (
                    <button
                      key={q._id}
                      onClick={() => !examFinished && handleSelectQuestion(idx)}
                      disabled={examFinished}
                      className={`w-20 h-10 text-sm rounded-md flex justify-center items-center 
                    ${isCurrent ? "bg-blue-500 text-white" : ""}
                    ${
                      isInteracted
                        ? "bg-blue-500 text-white"
                        : "bg-white border"
                    }
                    ${examFinished ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                    >
                      Ikibazo: {idx + 1}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div className="w-full px-3">
            {!reviewResults && currentQuestion ? (
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
                    const optionLabels = ["a", "b", "c", "d"];
                    const label = optionLabels[index];
                    const isCorrect = option.isCorrect;

                    return (
                      <div key={index} className="flex items-center gap-2">
                        <label
                          htmlFor={`option-${index}`}
                          className={`cursor-pointer ${
                            isCorrect ? "text-green-600 font-semibold" : ""
                          }`}
                        >
                          <span className="capitalize">{label}:</span>{" "}
                          {option.text}
                        </label>
                      </div>
                    );
                  })}
                </form>

                {!examFinished && (
                  <div className="mt-4 flex justify-between flex-wrap gap-2">
                    <button
                      onClick={handleShowPaymentPopup}
                      className="bg-blue-900 text-white px-4 py-1 rounded flex md:ml-0 ml-12 items-center gap-2"
                    >
                      <GrSend />
                      Isuzume Muri ikikizamini
                    </button>
                    // Previous
                    <button
                      onClick={() =>
                        handleSelectQuestion(Math.max(selectedQuestion - 1, 0))
                      }
                      disabled={selectedQuestion === 0}
                      className={`text-white px-4 py-1 rounded flex items-center gap-2
                     ${
                       selectedQuestion === 0
                         ? "bg-gray-500 cursor-not-allowed"
                         : "bg-blue-900"
                     }
                     `}
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
                      disabled={selectedQuestion === examQuestions.length - 1}
                      className={`text-white px-4 py-1 rounded flex items-center gap-2
                      ${
                        selectedQuestion === examQuestions.length - 1
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-blue-900"
                      }
  `}
                    >
                      <FiArrowRightCircle /> Igikurikira
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </>
      )}

      {/* Payment Popup */}
      {paymentPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-Total p-4 rounded-lg md:w-1/2 h-1/2 flex justify-center items-center w-full relative">
            <button
              className="absolute top-1 bg-white w-10 h-10 rounded-full right-2 text-red-500 text-xl"
              onClick={handleClosePaymentPopup}
            >
              ✖
            </button>

            <div className="md:w-1/2 w-full md:px-0 px-3">
              <div className="flex w-full flex-col bg-gray-300 rounded-lg">
                <div className="flex flex-col justify-center items-center gap-1 py-5">
                  <h1 className="text-xl pt-1 text-Total font-bold">
                    {testExam?.title}: {testExam?.number}
                  </h1>
                  <div className="flex flex-col justify-center items-start">
                    <p className="text-Total">
                      Exam Fees:{" "}
                      <span className="font-bold">{testExam?.fees} Rwf</span>
                    </p>
                    <p className="text-Total">Exam Type: {testExam?.type}</p>
                  </div>
                </div>
                <div className="pt-1">
                  <button
                    className={`flex items-center justify-center gap-4 text-lg py-1 px-4 rounded-md w-full text-white bg-yellow-500`}
                    onClick={handlePayLaterClick}
                  >
                    <BsCart /> Pay Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveLearn;
