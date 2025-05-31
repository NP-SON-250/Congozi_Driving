import React, { useState, useEffect } from "react";
import ExamsCard from "../../../Components/Cards/ExamsCard";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { BsCart } from "react-icons/bs";
import Irembo from "../../../assets/irembopay.png";
import Mtn from "../../../assets/MTN.jpg";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import axios from "axios";

const StudentMarket = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [examsPerPage, setExamsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [fees, setFees] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");

  const [exam, setExam] = useState({ data: [] });
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUserName(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
      }
    }
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://congozi-backend.onrender.com/api/v1/exams",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExam(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const updateExamsPerPage = () => {
      setExamsPerPage(window.innerWidth >= 768 ? 6 : 2);
    };
    updateExamsPerPage();
    window.addEventListener("resize", updateExamsPerPage);
    return () => window.removeEventListener("resize", updateExamsPerPage);
  }, []);

  const exams = exam.data || [];
  const filteredExams = exams.filter(
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

  const handlePurchaseClick = (exam) => {
    setSelectedExam(exam);
    setPaymentStep("confirmation");
  };

  const handleProceedToPayment = () => {
    setPaymentStep("payment");
  };

  const handlePayLaterClick = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://congozi-backend.onrender.com/api/v1/purchases/${selectedExam._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      closePopup();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("You have already purchased this exam.");
      } else {
        console.error("Purchase request failed:", error);
        alert("Failed to initiate purchase. Please try again.");
      }
    }
  };
  const handlePayNowClick = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://congozi-backend.onrender.com/api/v1/purchases/paid/${selectedExam._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      closePopup();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("Item not found.");
      } else {
        console.error("Purchase request failed:", error);
      }
    }
  };

  const closePopup = () => {
    setSelectedExam(null);
    setPaymentStep("confirmation");
  };

  return (
    <div className="flex flex-col justify-center items-center md:px-5 gap-1 bg-white md:p-2">
      <WelcomeDear />

      <div className="grid md:grid-cols-3 grid-cols-2 justify-between items-center md:gap-12 gap-1 px-3 py-4">
        <input
          type="text"
          placeholder="--ubwoko bw'ikizami--"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl cursor-pointer"
        />
        <input
          type="text"
          placeholder="---Shaka n'igiciro---"
          value={fees}
          onChange={(e) => setFees(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl cursor-pointer"
        />
        <div className="w-full px-3 md:flex justify-center items-center hidden md:bloc">
          <input
            type="search"
            placeholder="---Ubwoko, igiciro, nimero byikizami---"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-blue-500 p-2 rounded-xl w-full"
          />
        </div>
      </div>

      <div className="w-full px-3 pb-3 flex justify-center items-center md:hidden">
        <input
          type="search"
          placeholder="---Ubwoko, igiciro, nimero byikizami---"
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
            const isiga = exam.type.toLowerCase().includes("iga");
            const buttonColor = isiga ? "bg-yellow-500" : "bg-green-500";
            return (
              <ExamsCard
                key={index}
                {...exam}
                onPurchase={() => handlePurchaseClick(exam)}
                icon={<BsCart />}
                button={"Gura Ikizami"}
                buttonColor={buttonColor}
              />
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-around md:gap-[700px] gap-[120px] md:pb-0 pt-3 px-10">
          <button
            className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
              currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            <FaArrowAltCircleLeft size={24} /> Ibibanza
          </button>
          <button
            className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2${
              currentPage === totalPages - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            Ibikurikira
            <FaArrowAltCircleRight size={24} />
          </button>
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
                  Mukiriya {userName?.fName} {userName?.lName},
                </h2>
                <p className="mt-0 text-start text-white px-6">
                  Ugiye kugura ikizamini {selectedExam.number} cyo{" "}
                  {selectedExam.type} ishyura ayamafaranga ({selectedExam.fees}{" "}
                  RWF) maze uhabwe kode yo gufungura ikizamini cyawe. Ufite
                  ikibazo hamagara kuri iyi nimero: 0783905790
                </p>
                <div className="flex justify-center md:p-6 p-2 md:mt-12 mt-6 mb-2 md:gap-6 gap-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded md:text-base text-xs"
                    onClick={closePopup}
                  >
                    Funga
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={handlePayLaterClick}
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
                      onClick={handlePayNowClick}
                    >
                      Ishyura {selectedExam.fees} RWF
                    </button>
                    <p className="text-start py-2 font-medium">
                      Nyuma yo kwemeza kwishyura unyuze kuri Ishyura{" "}
                      {selectedExam.fees}, Uragabwa SMS <br />
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

export default StudentMarket;
