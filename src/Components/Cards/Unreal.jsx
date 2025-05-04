import react, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import QuestionCard from "../../../Components/Cards/QuestionCard";
import { examData } from "../../../Data/morkData";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import Police from "../../../assets/Policelogo.png";
import { useNavigate } from "react-router-dom";
const LiveExam = () => {
  const [examNumber, setExamNumber] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedOptions")) || {};
  });
  const [timeLeft, setTimeLeft] = useState(60);
  const [examFinished, setExamFinished] = useState(false);
  const [examQuestions, setExamQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reviewResults, setReviewResults] = useState(false);
  const [totalMarks, setTotalMarks] = useState(0);

  const [typeOf, setTypeOf] = useState("");
  const [examNo, setExamNo] = useState("");
  const [viewedQuestions, setViewedQuestions] = useState({});
  const [testVersion, setTestVersion] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fetchedExamNumber = params.get("examId") || "";
    setExamNumber(fetchedExamNumber);

    const testVersion = examData.find((exam) =>
      exam.accessCode.some((access) => access.code === fetchedExamNumber)
    );

    if (testVersion) {
      setExamNo(testVersion.number);
    }

    if (testVersion) {
      setExamQuestions(testVersion.questions);
      const storedTime = localStorage.getItem("examTimeLeft");
      if (storedTime) {
        setTimeLeft(parseInt(storedTime, 10));
      } else {
        localStorage.setItem("examTimeLeft", 60);
        setTimeLeft(1200);
      }
    }
    if (testVersion) {
      setTypeOf(testVersion.type);
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
    const m = Math.floor(seconds / 1);
    const s = seconds % 1;
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
  const intervalRef = useRef(null);
  const [remainingTime, setRemainingTime] = useState(0); // UI display only

  // Duration in seconds
  const DURATION = 3600;

  useEffect(() => {
    // On first load or refresh, set start time if not already set
    let startTime = localStorage.getItem("examStartTime");
    if (!startTime) {
      startTime = Date.now();
      localStorage.setItem("examStartTime", startTime);
    } else {
      startTime = parseInt(startTime, 10);
    }

    const updateTime = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const timeLeft = Math.max(DURATION - elapsed, 0);

      setRemainingTime(timeLeft);

      if (timeLeft === 0) {
        clearInterval(intervalRef.current);
        console.log("Time's up! Auto-submitting...");
      }
    };

    updateTime(); // Call immediately
    intervalRef.current = setInterval(updateTime, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const formatTimesix = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Find test exam for Learned exam
  const handleGetTestForThisExam = () => {
    const foundTest = examData.find(
      (exam) => exam.number === examNo && exam.type === "Test"
    );

    if (foundTest) {
      console.log("Test version found:", foundTest.accessCode[0]?.code);
      setTestVersion(foundTest); // ✅ Save in state so UI can access it
    } else {
      console.log("No Test version found.");
    }
  };

  // Close Payment
  const closePopup = () => {
    setTestVersion(null);
    setPaymentStep("confirmation");
  };

  const handleProceedToPayment = () => {
    setPaymentStep("payment");
  };
  return (
    <div className="flex flex-col p-1 md:pb-0 pb-2 bg-white">
      {typeOf === "Test" ? (
        //When selected exam is type of test
        <>
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
                  <p>Exam Number: {examNo}</p>
                  <p>
                    Exam Time:{" "}
                    <span className=" p-2 text-white font-bold">
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
                      onClick={() =>
                        !examFinished && setSelectedQuestion(index)
                      }
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
                        checked={
                          selectedOptions[currentQuestionId] === option.text
                        }
                        onChange={() =>
                          handleOptionChange(currentQuestionId, option.text)
                        }
                      />
                      <label
                        htmlFor={`option-${index}`}
                        className="cursor-pointer"
                      >
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
                      const correctOption = q.options.find(
                        (opt) => opt.isCorrect
                      );
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
                                typeof option === "object"
                                  ? option.text
                                  : option;
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
              <p className="text-gray-500">
                Click a question to view its details.
              </p>
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
            <>
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
            </>
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
                    <h1 className="text-lg font-bold text-blue-900">
                      Attention
                    </h1>
                  </div>
                  <h3 className="text-lg font-bold my-10 text-center">
                    Are you sure to finish Exam now?
                  </h3>
                  <div className="flex justify-between p-6">
                    <button
                      onClick={() => handleModalResponse("no")}
                      className="bg-Total text-white md:px-10 px-2 py-1 rounded-md"
                    >
                      No, Back
                    </button>
                    <button
                      onClick={() => handleModalResponse("yes")}
                      className="bg-Total text-white md:px-10 px-2 py-1 rounded-md"
                    >
                      Yes, I finish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Data to display if type of exam is not Test */}
          <h1 className="md:text-xl text-center md:py-1 py-3 font-bold text-Total capitalize">
            Ibisubizo by'ukuri biri mu ibara ry'icyatsi
          </h1>
          <div className="flex flex-col text-blue-900 justify-center items-start bg-green-500 p-0 rounded-md">
            <div className="grid md:grid-cols-4 grid-cols-2 gap-4 w-full py-1 md:px-12 px-2">
              <p>Exam Code: {examNumber}</p>
              <p>Total Questions: {examQuestions.length}</p>
              <p>Total Marks: 20 or</p>
              <p>Total Marks: 100</p>
            </div>
            <div className="grid md:grid-cols-4 grid-cols-2 gap-4 w-full py-1 md:px-12 px-2">
              <p>Pass Marks: 12/20 or</p>
              <p>Pass Mark 60%</p>
              <p>Exam Number: {examNo}</p>
              <p>
                Exam Time:{" "}
                <span className=" p-2 text-white font-bold">
                  {formatTimesix(remainingTime)}
                </span>
              </p>
            </div>
          </div>

          {/* Fetching questions */}
          <div className="flex flex-wrap md:justify-start justify-center py-1 md:gap-4 gap-2 md:px-3">
            {examQuestions.map((q, index) => {
              const isViewed = viewedQuestions[q.id];
              return (
                <QuestionCard
                  key={q.id}
                  bgColor={isViewed ? "bg-blue-500" : "bg-orange-200"}
                  textColor={isViewed ? "text-white" : "text-black"}
                  values={q.id}
                  onClick={() => {
                    if (!examFinished) {
                      setSelectedQuestion(index);
                      setViewedQuestions((prev) => ({
                        ...prev,
                        [q.id]: true,
                      }));
                    }
                  }}
                />
              );
            })}
          </div>

          {/* Fetching Options for each question */}
          {currentQuestion && !reviewResults ? (
            <>
              <h3 className="text-lg font-bold mb-0">
                {currentQuestion.questionPhrase}
              </h3>
              {currentQuestion.image && (
                <img src={currentQuestion.image} alt="" className="w-12 mb-0" />
              )}
              <form className="space-y-1">
                {currentQuestion.options.map((option, index) => {
                  const optionLabels = ["a", "b", "c", "d"];
                  const label = optionLabels[index];

                  // Identify correct option
                  const correctOption = currentQuestion.options.find(
                    (opt) => opt.isCorrect
                  );

                  // Highlight the correct one (optional)
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
            </>
          ) : (
            <></>
          )}
          {!examFinished && (
            <div className="flex justify-around mt-4 w-full gap-12">
              <button
                onClick={handleGetTestForThisExam}
                className="mt-4 bg-blue-900 w-48 text-white p-2 rounded capitalize"
              >
                Get Test for this exam
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
        </>
      )}
      {/* Payment Popup */}
      {testVersion && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-[999]">
          <div className="bg-Total rounded-lg shadow-lg md:max-w-3xl w-full text-center relative">
            <button
              className="absolute top-1 right-1 text-xl bg-white text-red-700 border-2 border-white rounded-full w-8 h-8 flex justify-center"
              onClick={closePopup}
            >
              ✖
            </button>
            {paymentStep === "confirmation" ? (
              <>
                <h2 className="text-lg text-start font-bold text-white px-6 pt-6">
                  Dear UMURERWA Anaise,
                </h2>
                <p className="mt-0 text-start text-white px-6">
                  Your Exam {testVersion.number} for {testVersion.type} has been
                  successfully purchased! Please make payment for your bill (
                  {testVersion.fees} RWF) to get exam access code.
                </p>
                <div className="flex justify-center p-6 mt-12 gap-6">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={closePopup}
                  >
                    Close
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={closePopup}
                  >
                    Pay Later
                  </button>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={handleProceedToPayment}
                  >
                    Pay Now
                  </button>
                </div>
              </>
            ) : (
              <div className="flex md:flex-row bg-white flex-col md:gap-6 gap-1">
                <div className="text-left">
                  <ul className="md:space-y-6 space-y-2 bg-gray-200 h-full p-4">
                    <li className="text-blue-900 font-bold">
                      <input type="radio" name="payment" checked readOnly /> MTN
                      Mobile Money
                    </li>
                    <li>
                      <input type="radio" name="payment" /> Airtel Money
                    </li>
                    <li>
                      <input type="radio" name="payment" /> Ikarita ya Banki
                    </li>
                    <li>
                      <input type="radio" name="payment" /> Amafaranga mu ntoki
                      / Ejenti
                    </li>
                    <li>
                      <input type="radio" name="payment" /> Konti za banki
                    </li>
                    <img src={Irembo} alt="" className="w-24" />
                  </ul>
                </div>
                <div className="flex flex-col justify-center items-start px-3 py-2">
                  <p className="text-start">
                    Kanda ino mibare kuri telefone yawe ya MTN maze <br />
                    wishyure:
                  </p>
                  <p className="flex justify-center gap-2 md:py-6 font-bold">
                    <img src={Mtn} alt="" className="w-10 h-6" />
                    *182*3*7*
                    <span className="bg-green-400/20 border px-1 border-green-600">
                      880318112865
                    </span>
                    #
                  </p>
                  <p>Cyangwa ushyiremo nomero yawe ya MTM MoMo Maze wishyure</p>
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="ex: 0789xxxxxxx"
                      className="border border-gray-400 rounded px-2 py-1 w-full mt-2"
                    />
                    <button className="bg-green-500 text-white px-2 py-1 rounded mt-4 w-full">
                      Ishyura {testVersion.fees} RWF
                    </button>
                    <p className="text-start py-2 font-medium">
                      Nyuma yo kwemeza kwishyura unyuze kuri Ishyura{" "}
                      {testVersion.fees}, Uragabwa SMS <br />
                      kuri telefone yawe wemeze maze ushyiremo umubare w'ibanga.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveExam;
