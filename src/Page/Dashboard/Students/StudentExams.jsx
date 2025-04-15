import React, { useState } from "react";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import { examData } from "../../../Data/morkData";
import {
  FaCartPlus,
  FaEdit,
  FaArrowAltCircleRight,
  FaArrowAltCircleLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Irembo from "../../../assets/irembopay.png";
import Mtn from "../../../assets/MTN.jpg";

const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

const StudentExams = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExam, setSelectedExam] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");
  const examsPerPage = 3;
  const navigate = useNavigate();

  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = examData.slice(indexOfFirstExam, indexOfLastExam);
  const totalPages = Math.ceil(examData.length / examsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDoExam = (exam) => {
    if (exam.accessCode && exam.accessCode.length > 0) {
      const accessCode = exam.accessCode[0].code;
      navigate(`/students/waitingexams?accessCode=${accessCode}`);
    } else {
      console.error("No access code available for this exam.");
    }
  };

  const handlePurchaseClick = (exam) => {
    setSelectedExam(exam);
    setPaymentStep("confirmation");
  };

  const handleProceedToPayment = () => {
    setPaymentStep("payment");
  };

  const closePopup = () => {
    setSelectedExam(null);
    setPaymentStep("confirmation");
  };

  return (
    <div className="md:p-2 flex gap-2 flex-col">
      <WelcomeDear />
      <div className="flex justify-center items-center gap-4 text-blue-900 font-bold py-2 border bg-gray-100 rounded-md">
        <h1>My Examinations</h1>
      </div>

      <div className="overflow-x-auto mt-0 md:pt-0 pt-20">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 border text-blue-900 md:text-base text-xs font-bold">
                <th className="text-center p-2">No.</th>
                <th className="text-center p-2">Access Code</th>
                <th className="text-center p-2">Type</th>
                <th className="text-center p-2">Date</th>
                <th className="text-center p-2">Fees</th>
                <th className="text-center p-2">Status</th>
                <th className="text-center p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentExams.map((exam) => (
                <tr
                  key={exam.id}
                  className="bg-white border text-blue-900 md:text-base text-xs"
                >
                  <td className="text-center py-2 px-4">{exam.number}</td>
                  <td className="text-center py-2 px-4">
                    {exam.accessCode.map((code, i) => (
                      <div key={i}>{code.code}</div>
                    ))}
                  </td>
                  <td className="text-center p-2">{exam.type}</td>
                  <td className="text-center p-2">{getCurrentDate()}</td>
                  <td className="text-center p-2">{exam.fees}</td>
                  <td className="text-center p-2">{exam.status}</td>
                  <td className="text-center p-2">
                    {exam.status === "Unpaid" ? (
                      <button
                        title="Proceed to payment"
                        onClick={() => handlePurchaseClick(exam)}
                        className="text-blue-900 py-1 px-3 flex items-center gap-2"
                      >
                        <FaCartPlus />
                      </button>
                    ) : exam.status === "Waiting" ? (
                      <button
                        onClick={() => handleDoExam(exam)}
                        className="text-blue-900 py-1 px-3 flex items-center gap-2"
                      >
                        <FaEdit />
                      </button>
                    ) : (
                      <button className="text-blue-900 py-1 px-3" disabled>
                        -
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-around md:gap-[830px] gap-[250px] md:pb-0 pb-10">
          <button
            className={`px-4 py-2 text-blue-900 rounded ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 1}
          >
            <FaArrowAltCircleLeft size={24} />
          </button>
          <button
            className={`px-4 py-2 text-blue-900 rounded ${
              currentPage === totalPages - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            <FaArrowAltCircleRight size={24} />
          </button>
        </div>
      )}

      {/* Payment Popup */}
      {selectedExam && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-[999]">
          <div className="bg-white rounded-lg shadow-lg md:max-w-3xl w-full text-center relative">
            <button
              className="absolute top-1 right-1 text-xl bg-white text-red-700 border-2 border-white rounded-full w-8 h-8 flex justify-center"
              onClick={closePopup}
            >
              ✖
            </button>
            {paymentStep === "confirmation" ? (
              <>
                <h2 className="text-xl font-bold text-blue-900 p-6">
                  Dear UMURERWA Anaise,
                </h2>
                <p className="mt-2 text-start text-blue-900 p-6">
                  Your Exam Access Code <b>{selectedExam.id}</b> for{" "}
                  <b>{selectedExam.type}</b> has been selected. Please pay{" "}
                  <b>{selectedExam.fees} RWF</b> to access the exam.
                </p>
                <div className="flex justify-center p-6 mt-12 gap-6">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={closePopup}
                  >
                    Close
                  </button>
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded">
                    Pay Later
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleProceedToPayment}
                  >
                    Pay Now
                  </button>
                </div>
              </>
            ) : (
              <div className="flex md:flex-row flex-col md:gap-6 gap-1">
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
                    Kanda ino mibare kuri telefone yawe ya MTN maze <br />{" "}
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
                  <input
                    type="text"
                    placeholder="ex: 0789xxxxxxx"
                    className="border border-gray-400 rounded px-2 py-1 w-full mt-2"
                  />
                  <button className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full">
                    Ishyura {selectedExam.fees} RWF
                  </button>
                  <p className="text-start py-2 font-medium">
                    Nyuma yo kwemeza kwishyura unyuze kuri Ishyura{" "}
                    {selectedExam.fees}, <br />
                    Urahabwa SMS kuri telefone yawe wemeze maze ushyiremo
                    umubare w'ibanga.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentExams;
