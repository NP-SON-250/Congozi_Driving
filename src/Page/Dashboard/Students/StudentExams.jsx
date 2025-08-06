import React, { useState, useEffect } from "react";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaEdit,
  FaCartPlus,
} from "react-icons/fa";
import Mtn from "../../../assets/MTN.jpg";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentExams = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [examsPerPage, setExamsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [fees, setFees] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");
  const [exam, setExam] = useState({ data: [] });
  const [userName, setUserName] = useState("");
  const [phoneUsed, setPhoneUsed] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueFees, setUniqueFees] = useState([]);
  const navigate = useNavigate();

  // Get user info from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(`${user.fName} ${user.lName}`);
    }
  }, []);

  // Fetch unpaid exams
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://congozi-backend.onrender.com/api/v1/purchases/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExam(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage({
        text: "Error fetching unpaid exams data",
        type: "error",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update unique filters when exam data changes
  useEffect(() => {
    if (exam.data && exam.data.length > 0) {
      // Get unique types
      const types = [
        ...new Set(exam.data.map((item) => item.itemId?.type)),
      ].filter(Boolean);
      setUniqueTypes(types);

      // Get unique fees
      const fees = [
        ...new Set(exam.data.map((item) => item.itemId?.fees)),
      ].filter(Boolean);
      setUniqueFees(fees.sort((a, b) => a - b)); // Sort fees numerically
    }
  }, [exam.data]);

  // Adjust items per page on screen resize
  useEffect(() => {
    const updateExamsPerPage = () => {
      setExamsPerPage(window.innerWidth >= 768 ? 10 : 5);
    };
    updateExamsPerPage();
    window.addEventListener("resize", updateExamsPerPage);
    return () => window.removeEventListener("resize", updateExamsPerPage);
  }, []);

  // Enhanced search functionality
  const filteredExams = exam.data.filter(
    (item) =>
      (type === "" ||
        item.itemId.type?.toLowerCase().includes(type.toLowerCase())) &&
      (fees === "" || item.itemId.fees?.toString().includes(fees)) &&
      (searchTerm === "" ||
        item.itemId.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemId.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemId.fees?.toString().includes(searchTerm) ||
        item.status?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const indexOfFirstExam = (currentPage - 1) * examsPerPage;
  const currentExams = filteredExams.slice(
    indexOfFirstExam,
    indexOfFirstExam + examsPerPage
  );

  const makePayment = (invoiceNumber, exam) => {
    setSelectedExam(exam);
    setPaymentStep("payment");
  };

  const closePopup = () => {
    setSelectedExam(null);
    setPaymentStep("confirmation");
    setPhoneUsed("");
    setOwnerName("");
  };

  const handleNotify = async () => {
    if (!phoneUsed || !ownerName) {
      setMessage({
        text: "Uzuza nimero ya telephone n'amazina yo ibaruyeho",
        type: "error",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 9000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const purchasedDataId = selectedExam._id;
      const paidItem = selectedExam.itemId;

      const notificationMessage = `Dear Admin, Turakumenyesha ko ${userName} yishyuye ikizamini cyitwa ${paidItem.title} cy'ubwoko bwo ${paidItem.type} amafaranga ${paidItem.fees} Rwf akoresheje telephone ${phoneUsed} ibaruye kuri ${ownerName}. Reba ko wayabonye kuri telephone ya code: 072255 maze umuhe uburenganzira kuri iyi purchase Id: ${purchasedDataId}. Murakoze!!!!!`;
      const noteTitle = `${userName} requests for approval`;
      const response = await axios.post(
        "https://congozi-backend.onrender.com/api/v1/notification",
        {
          message: notificationMessage,
          noteTitle: noteTitle,
          purchasedItem: purchasedDataId,
          ownerName: userName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const purchaseId = selectedExam._id;

      await axios.put(
        `https://congozi-backend.onrender.com/api/v1/purchases/${purchaseId}`,
        { status: "waitingConfirmation" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage({
        text: response.data.message || "Kwishyura byakunze neza!",
        type: "success",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 9000);

      closePopup();
      fetchData();
    } catch (error) {
      setMessage({
        text: "Kwishyura byanze. Wongera gerageza.",
        type: "error",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 9000);
      console.error("Payment error:", error);
      closePopup();
      fetchData();
    }
  };

  const handleDoExam = (exam) => {
    if (exam.accessCode && exam.accessCode.length > 0) {
      navigate(`/liveExam?code=${exam.accessCode}`);
    } else {
      console.error("No access code available for this exam.");
    }
  };
  const handlekwigaExam = (exam) => {
    if (exam.accessCode && exam.accessCode.length > 0) {
      navigate(`/livekwiga?code=${exam.accessCode}`);
    } else {
      console.error("No access code available for this exam.");
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString();
  };

  return (
    <div className="md:p-2 flex gap-2 flex-col">
      <WelcomeDear />
      <div className="flex justify-center items-center gap-4 text-blue-900 font-bold py-2 border bg-gray-100 rounded-md">
        <h1>Ibizamini Byanjye</h1>
      </div>

      {/* Message display */}
      {message.text && (
        <div
          className={`p-2 rounded-md ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Search and filter controls */}
      <div className="grid md:grid-cols-3 grid-cols-1 justify-between items-center md:gap-32 gap-1 px-3 py-4 text-gray-400 text-sx">
        <input
          type="text"
          placeholder="---Shakisha Bukimwe---"
          className="border border-gray-300 rounded px-3 py-1 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded px-3 py-1 appearance-none bg-white pr-6 outline-none"
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ backgroundImage: "none" }}
        >
          <option value="">----Ubwoko----</option>
          {uniqueTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded px-3 py-1 appearance-none bg-white pr-6 outline-none"
          value={fees}
          onChange={(e) => setFees(e.target.value)}
          style={{ backgroundImage: "none" }}
        >
          <option value="">----Igiciro----</option>
          {uniqueFees.map((fee, index) => (
            <option key={index} value={fee}>
              {fee} Rwf
            </option>
          ))}
        </select>
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
                          title="Pay"
                          onClick={() => {
                            makePayment(exam.invoiceNumber, exam);
                          }}
                          className="text-blue-500 underline py-1 px-3 flex md:tex-md font-bold hover:text-yellow-700 text-xs items-center gap-2"
                        >
                          Soza Kwishyura
                        </button>
                      ) : exam.status === "complete" &&
                        exam.itemId?.type === "gukora" ? (
                        <button
                          onClick={() => handleDoExam(exam)}
                          className="text-blue-500 underline py-1 px-3 flex md:tex-md font-bold hover:text-yellow-700 text-xs items-center gap-2"
                        >
                          Kora Ikizamini
                        </button>
                      ) : exam.status === "complete" &&
                        exam.itemId?.type === "kwiga" ? (
                        <button
                          onClick={() => handlekwigaExam(exam)}
                          className="text-blue-500 underline py-1 px-3 flex md:tex-md font-bold hover:text-yellow-700 text-xs items-center gap-2"
                        >
                          Iga Ikizamini
                        </button>
                      ) : (
                        <button
                          className="text-blue-500 underline py-1 px-3"
                          disabled
                        >
                          Tegereza
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

      {/* Payment Popup */}
      {selectedExam && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-[999]">
          <div className="bg-white rounded-lg shadow-lg md:max-w-4xl w-full text-center relative">
            <button
              className="absolute top-1 right-1 text-xl bg-white text-red-700 border-2 border-white rounded-full w-8 h-8 flex justify-center"
              onClick={closePopup}
            >
              ✖
            </button>
            {paymentStep === "confirmation" ? (
              <></>
            ) : (
              <div className="flex md:flex-row flex-col md:gap-6 gap-1">
                <div className="text-left md:w-96">
                  <ul className="md:space-y-6 space-y-2 bg-gray-200 h-full p-4">
                    <li className="text-blue-900 font-bold">
                      <input type="radio" name="payment" checked readOnly /> MTN
                      Mobile Money
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col justify-center px-3 py-2">
                  <p className="text-start pr-4">
                    Kanda ino mibare kuri telefone yawe ukoreshe SIM kadi ya MTN
                    maze wishyure kuri:{" "}
                    <span className="text-md font-semibold text-yellow-700">
                      EXPERT TECHNICAL UNITY Limited.
                    </span>
                    <span className="ml-2">
                      Maze uhabwe kode ifungura ikizamini cyawe.
                    </span>
                  </p>
                  <p className="flex justify-center md:py-6 py-4 font-bold">
                    <img src={Mtn} alt="" className="w-10 h-6 pr-3" />
                    *182*8*1*
                    <span className="bg-green-400/20 border border-green-600">
                      072255
                    </span>
                    *{selectedExam.itemId.fees}#
                  </p>
                  <p className="text-md text-Total pt-4 font-semibold">
                    Tanga amakuru kunyemezabwishyu yawe
                  </p>
                  <p className="pb-4">
                    Ukeneye ubufasha hamagara:{" "}
                    <span className="text-md font-bold text-yellow-700">
                      0783905790
                    </span>
                  </p>
                  <div className="w-full text-start">
                    <label htmlFor="phone">Nimero wakoresheje wishyura</label>
                    <input
                      type="text"
                      placeholder="Urugero: 0786731449"
                      className="border border-gray-400 rounded px-2 py-1 w-full mt-2"
                      value={phoneUsed}
                      onChange={(e) => setPhoneUsed(e.target.value)}
                      required
                    />
                    <label htmlFor="phone">Amazina ibaruyeho</label>
                    <input
                      type="text"
                      placeholder="Urugero: Samuel NKOTANYI"
                      className="border border-gray-400 rounded px-2 py-1 w-full mt-2"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                    />
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mt-4 w-full"
                      onClick={handleNotify}
                    >
                      Menyesha Ko Wishyuye
                    </button>
                    <p className="text-start py-2 font-medium">
                      Nyuma yo kumenyekanisha ko wishyuye{" "}
                      <span className="text-Total text-md font-semibold">
                        muminota 5
                      </span>{" "}
                      urahabwa ubutumwa{" "}
                      <span className="text-Total text-md font-semibold">
                        kuri sisiteme hejuru
                      </span>{" "}
                      bukwemerera{" "}
                      <span className="text-Total text-md font-semibold">
                        {selectedExam.itemId.type}{" "}
                      </span>{" "}
                      ikizamini
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

export default StudentExams;
