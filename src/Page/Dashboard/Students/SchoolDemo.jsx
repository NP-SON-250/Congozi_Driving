import React, { useState, useEffect } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { BsCart } from "react-icons/bs";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import AccountCard from "../../../Components/Cards/AdminCards/AccountCard";
import CompanyPopup from "../../../Components/Cards/CompanyPopup";
import axios from "axios";
const SchoolDemo = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [accountsPerPage, setAccountsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [valid, setValid] = useState("");
  const [fees, setFees] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");

  const [account, setAccount] = useState({ data: [] });

  // Fetch all accounts
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://congozi-backend.onrender.com/api/v1/accounts",
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

  const accounts = account.data || [];

  useEffect(() => {
    const updateAccountsPerPage = () => {
      setAccountsPerPage(window.innerWidth >= 768 ? 6 : 2);
    };
    updateAccountsPerPage();
    window.addEventListener("resize", updateAccountsPerPage);
    return () => window.removeEventListener("resize", updateAccountsPerPage);
  }, []);

  const filteredAccounts = accounts.filter(
    (account) =>
      (valid === "" ||
        account.validIn.toLowerCase().includes(valid.toLowerCase())) &&
      (fees === "" || account.fees.toString().includes(fees)) &&
      (searchTerm === "" ||
        account.validIn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.fees.toString().includes(searchTerm) ||
        account.title.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
  const currentAccounts = filteredAccounts.slice(
    currentPage * accountsPerPage,
    (currentPage + 1) * accountsPerPage
  );

  const handlePurchaseClick = (account) => {
    setSelectedAccount(account);
    setPaymentStep("confirmation");
  };

  const closePopup = () => {
    setSelectedAccount(null);
    setPaymentStep("confirmation");
  };

  return (
    <div className="flex flex-col justify-center items-center md:px-5 gap-1 bg-white md:p-2 ">
      <WelcomeDear />

      {/* Filters */}
      <div className="grid md:grid-cols-3 grid-cols-2 justify-between items-center md:gap-32 gap-1 px-3 py-4">
        <input
          type="text"
          placeholder="---Select account valid time---"
          value={valid}
          onChange={(e) => setValid(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl cursor-pointer text-bold"
        />
        <input
          type="text"
          placeholder="---Filter account Fees---"
          value={fees}
          onChange={(e) => setFees(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl cursor-pointer"
        />
        <div className="w-full px-3 md:flex justify-center items-center hidden md:bloc">
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

      {/* account Cards */}
      {filteredAccounts.length === 0 ? (
        <p className=" py-4 text-red-500">Not data found</p>
      ) : (
        <div className="grid md:grid-cols-3 w-full gap-4 md:gap-3 py-1">
          {currentAccounts.map((account, index) => {
            const buttonColor =
              account.validIn >= 30 ? "bg-green-500" : "bg-yellow-500";
            return (
              <AccountCard
                key={index}
                {...account}
                onPurchase={() => handlePurchaseClick(account)}
                icon={<BsCart />}
                button={"Purchase"}
                buttonColor={buttonColor}
              />
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex absolute md:gap-[860px] gap-[250px] right-0 md:bottom-[15vh] bottom-[25vh]">
          <button
            className={`px-4 py-2 text-blue-900 rounded ${
              currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
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
      {selectedAccount && <CompanyPopup onClose={closePopup} />}
    </div>
  );
};

export default SchoolDemo;
