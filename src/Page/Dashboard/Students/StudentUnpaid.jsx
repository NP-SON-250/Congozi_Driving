import React, { useState, useEffect } from "react";
import ExamsCard from "../../../Components/Cards/ExamsCard";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";
import Irembo from "../../../assets/irembopay.png";
import Mtn from "../../../assets/MTN.jpg";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const StudentUnpaid = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [examsPerPage, setExamsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [fees, setFees] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");

  const [exam, setExam] = useState({ data: [] });
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(`${user.fName} ${user.lName}`);
    }
  }, []);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4900/api/v1/purchases/pending",
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

  const filteredExams = exam.data.filter(
    (item) =>
      (type === "" ||
        item.itemId.type?.toLowerCase().includes(type.toLowerCase())) &&
      (fees === "" || item.itemId.fees?.toString().includes(fees)) &&
      (searchTerm === "" ||
        item.itemId.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemId.fees?.toString().includes(searchTerm) ||
        item.itemId.number?.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const currentExams = filteredExams.slice(
    currentPage * examsPerPage,
    (currentPage + 1) * examsPerPage
  );

  const makePayment = (invoiceNumber, exam) => {
    IremboPay.initiate({
      publicKey: "pk_live_111e50f65489462684098ebea001da06",
      invoiceNumber: invoiceNumber,
      locale: IremboPay.locale.RW,
      callback: async (err, resp) => {
        if (!err) {
          setSelectedExam(exam);  
          try {
            const token = localStorage.getItem("token");
            const purchaseId = exam._id;

            const response = await axios.put(
              `http://localhost:4900/api/v1/purchases/${purchaseId}`,
              { status: "complete" },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            toast.success("Kwishyura byakunze.");
            closePopup();
            navigate(`/students/waitingexams`);
            fetchData();
          } catch (error) {
            toast.error("Kwishyura byanze.");
            console.error("Ikibazo:", error);
          }
        } else {
          toast.error("Payment failed");
          console.error("Payment error:", err);
        }
      },
    });
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
        <div className="w-full px-3 md:flex justify-center items-center hidden">
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
        <p className="text-center py-4 text-red-500">
          Nta kizamini kitishyuye ufite
        </p>
      ) : (
        <div className="grid md:grid-cols-3 w-full gap-4 md:gap-3 py-1">
          {currentExams.map((exam, index) => {
            const isiga = exam.itemId.type?.toLowerCase().includes("iga");
            const buttonColor = isiga ? "bg-yellow-500" : "bg-green-500";
            return (
              <ExamsCard
                key={index}
                title={exam.itemId.title}
                number={exam.itemId.number}
                fees={exam.itemId.fees}
                type={exam.itemId.type}
                onPurchase={() => {
                  setSelectedExam(exam);
                  makePayment(exam.invoiceNumber, exam);
                }}
                icon={<FaHandHoldingDollar />}
                button={"Soza Kwishyura"}
                buttonColor={buttonColor}
              />
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-around md:gap-[700px] gap-[120px] md:pb-0 pt-3 px-10">
          <div>
            <button
              className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
                currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              <FaArrowAltCircleLeft size={24} /> Ibibanza
            </button>
          </div>
          <div>
            <button
              className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
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
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default StudentUnpaid;
