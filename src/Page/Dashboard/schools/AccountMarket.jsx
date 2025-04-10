import React, { useState, useEffect } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { BsCart } from "react-icons/bs";
import Irembo from "../../../assets/irembopay.png";
import Mtn from "../../../assets/MTN.jpg";
import { accountData } from "../../../Data/morkData";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import ExamsCard from "../../../Components/Cards/ExamsCard";
import AccountCard from "../../../Components/Cards/AdminCards/AccountCard";

const SchoolDemo = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [accountsPerPage, setAccountsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [valid, setValid] = useState("");
  const [fees, setFees] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");

  const accounts = accountData;

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
      (valid === "" || account.valid.toLowerCase().includes(valid.toLowerCase())) &&
      (fees === "" || account.fees.toString().includes(fees)) &&
      (searchTerm === "" ||
        account.valid.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleProceedToPayment = () => {
    setPaymentStep("payment");
  };

  const closePopup = () => {
    setSelectedAccount(null);
    setPaymentStep("confirmation");
  };

  return (
    <div className="flex flex-col justify-center items-start md:px-5 gap-1 bg-white">
      <WelcomeDear/>

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
        <p className="text-center py-4 text-red-500">No data found</p>
      ) : (
        <div className="grid md:grid-cols-3 w-full gap-4 md:gap-3 py-1">
          {currentAccounts.map((account, index) => {
            const isLearn = account.valid.toLowerCase().includes("days");
            const buttonColor = account.fees > 20000 ? "bg-green-500" : "bg-yellow-500";
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
        <div className="flex absolute md:gap-[860px] gap-[250px] right-0 md:bottom-[9vh] bottom-[16vh]">
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
      {selectedAccount && (
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
                <p className="mt-2 text-start  px-48 text-blue-900">
                  Your account {selectedAccount.title} which is valid in {selectedAccount.valid} has
                  been successfully purchased! Please make payment for your bill
                  ({selectedAccount.fees} RWF) to get account access code.
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
                    <button className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full">
                      Ishyura {selectedAccount.fees} RWF
                    </button>
                    <p className="text-start py-2 font-medium">
                      Nyuma yo kwemeza kwishyura unyuze kuri Ishyura{" "}
                      {selectedAccount.fees}, Uragabwa SMS <br />
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

export default SchoolDemo;
