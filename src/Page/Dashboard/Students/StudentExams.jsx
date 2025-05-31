import React, { useState, useEffect } from "react";
import axios from "axios";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import {
  FaCartPlus,
  FaEdit,
  FaArrowAltCircleRight,
  FaArrowAltCircleLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Irembo from "../../../assets/irembopay.png";
import Mtn from "../../../assets/MTN.jpg";
import { toast, ToastContainer } from "react-toastify";

const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

const StudentExams = () => {
  const [allExams, setAllExams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExam, setSelectedExam] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");
  const examsPerPage = 5;
  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        "https://congozi-backend.onrender.com/api/v1/purchases/user",
        config
      );
      const result = response.data?.data;
      setAllExams(Array.isArray(result) ? result : [result]);
    } catch (error) {
      console.error("Error fetching exam data:", error);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = allExams.slice(indexOfFirstExam, indexOfLastExam);
  const totalPages = Math.ceil(allExams.length / examsPerPage);

  const handleigaExam = (exam) => {
    if (exam.accessCode && exam.accessCode.length > 0) {
      navigate(`/liveiga?code=${exam.accessCode}`);
    } else {
      console.error("No access code available for this exam.");
    }
  };

  const handleDoExam = (exam) => {
    if (exam.accessCode && exam.accessCode.length > 0) {
      navigate(`/liveExam?code=${exam.accessCode}`);
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

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      const purchaseId = selectedExam._id;

      const response = await axios.put(
        `https://congozi-backend.onrender.com/api/v1/purchases/${purchaseId}`,
        { status: "complete" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      closePopup();
      await fetchExams();
      toast.success("Kwishyura byakunze!");
    } catch (error) {
      toast.error("Kwishyura byanze.");
      console.error("Payment error:", error);
    }
  };
  return (
    <div className="md:p-2 flex gap-2 flex-col">
      <WelcomeDear />
      <div className="flex justify-center items-center gap-4 text-blue-900 font-bold py-2 border bg-gray-100 rounded-md">
        <h1>Ibizamini Byanjye</h1>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-blue-900">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 border text-blue-900 md:text-base text-xs font-bold">
                <th className="text-center p-2 whitespace-nowrap">No.</th>
                <th className="text-center p-2 whitespace-nowrap">
                  Umutwe w'ikizami
                </th>
                <th className="text-center p-2 whitespace-nowrap">Ubwoko</th>
                <th className="text-center p-2 whitespace-nowrap">Itariki</th>
                <th className="text-center p-2 whitespace-nowrap">Igiciro</th>
                <th className="text-center p-2 whitespace-nowrap">Imimerere</th>
                <th className="text-center p-2 whitespace-nowrap">Igikorwa</th>
              </tr>
            </thead>
            <tbody>
              {currentExams.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-4 text-red-500 font-semibold"
                  >
                    Ntakizamini uragura.
                  </td>
                </tr>
              ) : (
                currentExams.map((exam, index) => (
                  <tr
                    key={exam._id}
                    className="bg-white border text-blue-900 md:text-base text-xs whitespace-nowrap"
                  >
                    <td className="text-center md:tex-md text-xs py-2 px-4 whitespace-nowrap">
                      {indexOfFirstExam + index + 1}
                    </td>
                    <td className="text-start md:tex-md text-xs px-1 whitespace-nowrap">
                      {exam.itemId?.title}
                    </td>
                    <td className="text-start md:tex-md text-xs p-2 whitespace-nowrap">
                      {exam.itemId?.type}
                    </td>
                    <td className="text-start md:tex-md text-xs px-2 whitespace-nowrap">
                      {getCurrentDate()}
                    </td>
                    <td className="text-start md:tex-md text-xs px-2 whitespace-nowrap">
                      {exam.amount} Rwf
                    </td>
                    <td className="text-start md:tex-md text-xs px-2 whitespace-nowrap">
                      {exam.status}
                    </td>
                    <td className="text-center p-2 whitespace-nowrap">
                      {exam.status === "pending" ? (
                        <button
                          title="Proceed to payment"
                          onClick={() => handlePurchaseClick(exam)}
                          className="text-blue-900 py-1 px-3 flex md:tex-xs text-xs items-center gap-2"
                        >
                          <FaCartPlus />
                        </button>
                      ) : exam.status === "complete" &&
                        exam.itemId?.type === "kora" ? (
                        <button
                          onClick={() => handleDoExam(exam)}
                          className="text-blue-900 py-1 px-3 md:tex-xs text-xs flex items-center gap-2"
                        >
                          <FaEdit />
                        </button>
                      ) : exam.status === "complete" &&
                        exam.itemId?.type === "iga" ? (
                        <button
                          onClick={() => handleigaExam(exam)}
                          className="text-blue-900 py-1 px-3 md:tex-xs text-xs flex items-center gap-2"
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-around md:gap-[700px] gap-[120px] md:pb-0 pt-3 px-10">
          <div>
            <button
              className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaArrowAltCircleLeft size={24} />
              Ibibanza
            </button>
          </div>
          <div>
            <button
              className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Ibikurikira
              <FaArrowAltCircleRight size={24} />
            </button>
          </div>
        </div>
      )}

      {selectedExam && (
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
                  Mukiriya {selectedExam.purchasedBy?.lName},
                </h2>
                <p className="mt-0 text-start text-white px-6">
                  Ugiye kugura ikizamini {selectedExam.itemId?.number} cyo{" "}
                  {selectedExam.itemId?.type} ishyura ayamafaranga (
                  {selectedExam.itemId?.fees} RWF) maze uhabwe kode yo gufungura
                  ikizamini cyawe. Ufite ikibazo hamagara kuri iyi nimero:
                  0783905790.
                </p>
                <div className="flex justify-center md:p-6 p-2 md:mt-12 mt-6 mb-2 md:gap-6 gap-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={closePopup}
                  >
                    Funga
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={closePopup}
                  >
                    Ishyura Mukanya
                  </button>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={handleProceedToPayment}
                  >
                    Ishyura Nonaha
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
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mt-4 w-full"
                      onClick={handlePayment}
                    >
                      Ishyura {selectedExam.itemId?.fees} RWF
                    </button>
                    <p className="text-start py-2 font-medium">
                      Nyuma yo kwemeza kwishyura unyuze kuri Ishyura{" "}
                      {selectedExam.itemId?.fees}, Uragabwa SMS <br />
                      kuri telefone yawe wemeze maze ushyiremo umubare w'ibanga.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default StudentExams;
