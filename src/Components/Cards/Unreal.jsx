import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import QuestionCard from "../../../Components/Cards/QuestionCard";
import { examData } from "../../../Data/morkData";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import Police from "../../../assets/Policelogo.png";
const LiveExam = () => {
  const [examNumber, setExamNumber] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedOptions")) || {};
  });
  const [timeLeft, setTimeLeft] = useState(1200);
  const [examFinished, setExamFinished] = useState(false);
  const [examQuestions, setExamQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reviewResults, setReviewResults] = useState(false);
  const [totalMarks, setTotalMarks] = useState(0);
  const [sixtyMinuteTimer, setSixtyMinuteTimer] = useState(3600);


  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fetchedExamNumber = params.get("examId") || "";
    setExamNumber(fetchedExamNumber);

    const selectedExam = examData.find((exam) =>
      exam.accessCode.some((access) => access.code === fetchedExamNumber)
    );

    if (selectedExam) {
      setExamQuestions(selectedExam.questions);
      const storedTime = localStorage.getItem("examTimeLeft");
      if (storedTime) {
        setTimeLeft(parseInt(storedTime, 10));
      } else {
        localStorage.setItem("examTimeLeft", 1200);
        setTimeLeft(1200);
      }
    }
  }, [location.search]);

  useEffect(() => {
    if (examFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          localStorage.removeItem("examTimeLeft");
          handleSubmitExam();
          return 0;
        }
        const newTime = prevTime - 1;
        localStorage.setItem("examTimeLeft", newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examFinished]);

  useEffect(() => {
    localStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
  }, [selectedOptions]);

  const handleOptionChange = (questionId, selectedOption) => {
    if (examFinished) return;

    setSelectedOptions((prev) => {
      const updated = { ...prev, [questionId]: selectedOption };
      localStorage.setItem("selectedOptions", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmitExam = () => {
    setExamFinished(true);
    localStorage.removeItem("examTimeLeft");

    let score = 0;

    examQuestions.forEach((question) => {
      const correctOption = question.options.find((opt) => opt.isCorrect);
      const selected = selectedOptions[question.id];

      if (
        selected &&
        correctOption &&
        selected.trim() === correctOption.text.trim()
      ) {
        score += question.marks || 1;
      }
    });

    setTotalMarks(score);
  };

  const confirmFinishExam = () => {
    setShowModal(true);
  };

  const handleModalResponse = (response) => {
    if (response === "yes") {
      localStorage.removeItem("selectedOptions");
      localStorage.removeItem("examTimeLeft");
      handleSubmitExam();
    }
    setShowModal(false);
  };

  const handleReviewResults = () => {
    setReviewResults(true);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleNextQuestion = () => {
    if (selectedQuestion < examQuestions.length - 1) {
      setSelectedQuestion((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (selectedQuestion > 0) {
      setSelectedQuestion((prev) => prev - 1);
    }
  };

  const currentQuestion = examQuestions[selectedQuestion];
  const currentQuestionId = currentQuestion?.id;

  // sixity minutes countdown
  useEffect(() => {
    if (examFinished) return;
  
    const sixtyTimer = setInterval(() => {
      setSixtyMinuteTimer((prev) => {
        if (prev <= 1) {
          clearInterval(sixtyTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(sixtyTimer);
  }, [examFinished]);
  
  return (
    <div className="flex flex-col p-1 pb-12 bg-white">
      {!reviewResults && (
        <>
          <div className="flex flex-col text-blue-900 justify-center items-start bg-green-500 p-1 rounded-md">
            <div className="grid md:grid-cols-4 grid-cols-2 gap-4 w-full py-1 md:px-12 px-2">
              <p>Exam Code: {examNumber}</p>
              <p>Total Questions: {examQuestions.length}</p>
              <p>Total Marks: 20 or</p>
              <p>Total Marks: 100</p>
            </div>
            <div className="grid md:grid-cols-4 grid-cols-2 gap-4 w-full py-1 md:px-12 px-2">
              <p>Pass Marks: 12/20 or</p>
              <p>Pass Mark 60%</p>
              <p>Exam Number: {examNumber}</p>
              <p>
                Exam Time:{" "}
                <span className="bg-white p-2 rounded-full text-blue-900 font-bold">
                {formatTime(timeLeft)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap md:justify-start justify-center py-1 md:gap-4 gap-2 md:px-3">
            {examQuestions.map((q, index) => {
              const isAnswered = selectedOptions[q.id] != null;
              return (
                <QuestionCard
                  key={q.id}
                  bgColor={isAnswered ? "bg-blue-500" : "bg-orange-200"}
                  textColor={isAnswered ? "text-white" : "text-black"}
                  values={q.id}
                  onClick={() => !examFinished && setSelectedQuestion(index)}
                />
              );
            })}
          </div>
        </>
      )}

      <div className="p-4 border border-gray-300 rounded-md mt-4">
        {currentQuestion && !reviewResults ? (
          <>
            <h3 className="text-lg font-bold mb-2">
              {currentQuestion.questionPhrase}
            </h3>
            <img src={currentQuestion.image} alt="" className="w-24" />
            <form className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`question-${currentQuestionId}`}
                    id={`option-${index}`}
                    className="cursor-pointer"
                    disabled={examFinished}
                    checked={selectedOptions[currentQuestionId] === option.text}
                    onChange={() =>
                      handleOptionChange(currentQuestionId, option.text)
                    }
                  />
                  <label htmlFor={`option-${index}`} className="cursor-pointer">
                    {option.text}
                  </label>
                </div>
              ))}
            </form>
          </>
        ) : reviewResults ? (
          <div>
            <div className="pb-4">
              <WelcomeDear />
            </div>
            <div className="w-full justify-center items-center bg-green-500 text-blue-900 font-bold text-xl rounded-md">
              <h2 className="text-center font-bold mb-4">Exam Review</h2>
            </div>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead className="bg-gray-300 text-blue-900">
                <tr>
                  <th className="border border-gray-300 p-1">Question</th>
                  <th className="border border-gray-300 p-1">Options</th>
                  <th className="border border-gray-300 p-1">Decision</th>
                </tr>
              </thead>
              <tbody>
                {examQuestions.map((q) => {
                  const selectedOption = selectedOptions[q.id];
                  const correctOption = q.options.find((opt) => opt.isCorrect);
                  const correct =
                    selectedOption &&
                    correctOption &&
                    String(selectedOption).trim() ===
                      String(correctOption.text).trim();

                  return (
                    <tr key={q.id}>
                      <td className="border border-gray-300 p-2">
                        <div>{q.questionPhrase}</div>
                        <img src={q.image} alt="" className="w-24 mt-2" />
                      </td>
                      <td className="border border-gray-300 p-2">
                        {q.options.map((option, idx) => {
                          const optionText =
                            typeof option === "object" ? option.text : option;
                          const isSelected = selectedOption === optionText;
                          const isCorrectOption =
                            optionText === correctOption?.text;

                          let textColor = "";
                          if (isCorrectOption) {
                            textColor = "text-green-500";
                          } else if (isSelected && !isCorrectOption) {
                            textColor = "text-red-500";
                          }

                          return (
                            <div key={idx} className={`p-1 ${textColor}`}>
                              {optionText}
                            </div>
                          );
                        })}
                      </td>
                      <td className="border border-gray-300 p-0 mt-0">
                        <div
                          className={`text-center -mt-16 font-semibold ${
                            correct ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {correct ? "Wagikoze" : "Wakishe"}
                        </div>
                        <div>
                          {selectedOption == null
                            ? "Not Answered"
                            : correct
                            ? "Amanota: 1/20 | 5%"
                            : "Amanota: 0/20 | 0%"}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan="3"
                    className="text-center font-bold text-lg p-4 bg-gray-100"
                  >
                    <div className="text-center text-2xl font-semibold text-blue-900">
                      {totalMarks >= 10
                        ? "Conglaturations you have made it 🙌🙌🙌"
                        : "You failed this exam, You need to learn more!!"}
                    </div>
                    <div className="text-xl text-orange-500 font-medium">
                      Total Marks: {totalMarks}/20 |{" "}
                      {((totalMarks / 20) * 100).toFixed(2)}%
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  localStorage.removeItem("selectedOptions");
                  localStorage.removeItem("examTimeLeft");
                  window.location.href = "/students/waitingexams";
                }}
                className="bg-red-300 text-white py-2 px-4 rounded"
              >
                Close Review
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Click a question to view its details.</p>
        )}
      </div>

      {examFinished && !reviewResults && (
        <div className="flex flex-col items-center mt-4">
          <div className="flex gap-12 justify-center">
            <button
              disabled
              className="bg-gray-400 w-48 text-white p-2 rounded mt-2"
            >
              Finish Exam
            </button>
            <button
              onClick={handleReviewResults}
              className="bg-green-700 w-48 text-white p-2 rounded  mt-2"
            >
              Review Results
            </button>
          </div>
          <div className="text-xl text-orange-500 font-medium mt-4">
            <p>
              {totalMarks}/20 | {((totalMarks / 20) * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {!examFinished && !reviewResults && (
        <div className="flex justify-around mt-4 w-full gap-12">
          <button
            onClick={confirmFinishExam}
            className="mt-4 bg-blue-900 w-48 text-white p-2 rounded"
          >
            Finish Exam
          </button>
          <button
            onClick={handlePreviousQuestion}
            className={`mt-4 w-24 text-white p-2 rounded 
              ${
                selectedQuestion === examQuestions.length
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-900"
              }`}
            disabled={selectedQuestion === 0}
          >
            Previous
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={selectedQuestion === examQuestions.length - 1}
            className={`mt-4 w-24 text-white p-2 rounded 
    ${
      selectedQuestion === examQuestions.length - 1
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-blue-900"
    }`}
          >
            Next
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-2 z-[9999]">
          <div className="bg-Total rounded-lg flex md:flex-row flex-col items-center justify-around shadow-lg md:w-[90%] md:py-14 py-0 w-full text-center relative">
            <button
              className="absolute top-2 right-2 text-xl bg-white text-red-700 border-2 border-white rounded-full w-8 h-8 flex justify-center"
              onClick={() => handleModalResponse("no")}
            >
              ✖
            </button>
            <img
              src={Police}
              alt="Logo"
              className=" w-56 h-56 justify-center"
            />
            <div className="bg-white rounded-md md:w-1/2 w-full pb-4">
              <div className="p-2 w-full bg-green-700 rounded-md text-center">
                <h1 className="text-lg font-bold text-blue-900">Attention</h1>
              </div>
              <h3 className="text-lg font-bold my-10 text-center">
                Are you sure to finish Exam now?
              </h3>
              <div className="flex justify-between p-6">
                <button
                  onClick={() => handleModalResponse("no")}
                  className="bg-Total text-white md:px-10 px-4 py-2 rounded-md"
                >
                  No, Back
                </button>
                <button
                  onClick={() => handleModalResponse("yes")}
                  className="bg-Total text-white md:px-10 px-4 py-2 rounded-md"
                >
                  Yes, I finish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveExam;
