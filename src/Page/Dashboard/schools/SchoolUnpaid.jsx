import React, { useState, useEffect } from "react";
import AccountCard from "../../../Components/Cards/AdminCards/AccountCard";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SchoolUnpaid = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [accountsPerPage, setAccountsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [validIn, setvalidIn] = useState("");
  const [fees, setFees] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");

  const [account, setAccount] = useState({ data: [] });
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(`${user.companyName}`);
    }
  }, []);
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://congozi-backend.onrender.com/api/v1/purchases/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAccount(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const updateaccountsPerPage = () => {
      setAccountsPerPage(window.innerWidth >= 768 ? 6 : 2);
    };
    updateaccountsPerPage();
    window.addEventListener("resize", updateaccountsPerPage);
    return () => window.removeEventListener("resize", updateaccountsPerPage);
  }, []);

  const filteredAccounts = account.data.filter(
    (item) =>
      (validIn === "" ||
        item.itemId.validIn?.toLowerCase().includes(validIn.toLowerCase())) &&
      (fees === "" || item.itemId.fees?.toString().includes(fees)) &&
      (searchTerm === "" ||
        item.itemId.validIn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemId.fees?.toString().includes(searchTerm) ||
        item.itemId.title?.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
  const currentAccounts = filteredAccounts.slice(
    currentPage * accountsPerPage,
    (currentPage + 1) * accountsPerPage
  );
  const makePayment = (invoiceNumber, account) => {
    IremboPay.initiate({
      publicKey: "pk_live_111e50f65489462684098ebea001da06",
      invoiceNumber: invoiceNumber,
      locale: IremboPay.locale.RW,
      callback: async (err, resp) => {
        if (!err) {
          setSelectedAccount(account);
          try {
            const token = localStorage.getItem("token");
            const purchaseId = account._id;

            const response = await axios.put(
              `https://congozi-backend.onrender.com/api/v1/purchases/${purchaseId}`,
              { status: "complete" },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            toast.success("Kwishyura byakunze.");
            closePopup();
            fetchData();
            navigate(`/schools/accounts`);
          } catch (error) {
            console.error("Ikibazo:", error);
          }
        } else {
          console.error("Payment error:", err);
        }
      },
    });
  };

  const closePopup = () => {
    setSelectedAccount(null);
    setPaymentStep("confirmation");
  };

  return (
    <div className="flex flex-col justify-center items-center md:px-5 gap-1 bg-white md:p-2">
      <WelcomeDear />

      <div className="grid md:grid-cols-3 grid-cols-2 justify-between items-center md:gap-12 gap-1 px-3 py-4">
        <input
          type="text"
          placeholder="---Select account validIn---"
          value={validIn}
          onChange={(e) => setvalidIn(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl cursor-pointer"
        />
        <input
          type="text"
          placeholder="---Filter account Fees---"
          value={fees}
          onChange={(e) => setFees(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl cursor-pointer"
        />
        <div className="w-full px-3 md:flex justify-center items-center hidden">
          <input
            type="search"
            placeholder="Search Everything"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-blue-500 p-2 rounded-xl w-full"
          />
        </div>
      </div>

      <div className="w-full px-3 pb-3 flex justify-center items-center md:hidden">
        <input
          type="search"
          placeholder="Search Everything"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl w-full"
        />
      </div>

      {filteredAccounts.length === 0 ? (
        <p className="text-center py-4 text-red-500">No data found</p>
      ) : (
        <div className="grid md:grid-cols-3 w-full gap-4 md:gap-3 py-1">
          {currentAccounts.map((account, index) => {
            const accounts = account.itemId;
            const buttonColor =
              accounts.validIn >= 30 ? "bg-green-500" : "bg-yellow-500";
            return (
              <AccountCard
                key={index}
                title={`Account ${currentPage * accountsPerPage + index + 1}: ${
                  accounts.title
                }`}
                fees={accounts.fees}
                validIn={accounts.validIn}
                onPurchase={() => {
                  setSelectedAccount(account);
                  makePayment(account.invoiceNumber, account);
                }}
                icon={<FaHandHoldingDollar />}
                button={"Proceed Payment"}
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
                currentPage === 0 ? "opacity-50" : ""
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              <FaArrowAltCircleLeft size={24} /> Izibanza
            </button>
          </div>
          <div>
            <button
              className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
                currentPage === totalPages - 1 ? "opacity-50" : ""
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage === totalPages - 1}
            >
              Izikurira
              <FaArrowAltCircleRight size={24} />
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default SchoolUnpaid;
