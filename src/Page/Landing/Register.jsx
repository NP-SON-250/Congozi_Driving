import React, { useState } from "react";
import { GoPaperclip } from "react-icons/go";
import { ImUserPlus } from "react-icons/im";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Police from "../../assets/Policelogo.png";
import HalfInput from "../../Components/Inputs/Studentnputs/HalfInput";
import FullInput from "../../Components/Inputs/Studentnputs/FullInput";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Components/LoadingSpinner ";
const Register = () => {
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    idCard: "",
    profile: null,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navkwigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profile: file }));
      if (file) {
        const previewURL = URL.createObjectURL(file);
        setSelectedImage(previewURL);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateInputs = () => {
    let newErrors = {};

    if (!/^1\d{15}$/.test(formData.idCard)) {
      newErrors.idCard = <AiOutlineCloseCircle size={24} />;
    }

    if (!/^(072|073|078)\d{7}$/.test(formData.phone)) {
      newErrors.phone = <AiOutlineCloseCircle size={24} />;
    }

    // Only validate email if it's provided and invalid
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = <AiOutlineCloseCircle size={24} />;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = <AiOutlineCloseCircle size={24} />;
    }

    if (!agreedToTerms) {
      newErrors.terms = "Emera amategeko n'amabwiriza.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const notifySuccess = (msg) =>
    toast.success(msg, { position: "top-center", autoClose: 2000 });

  const notifyError = (msg) =>
    toast.error(msg, { position: "top-center", autoClose: 2000 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "confirmPassword") data.append(key, value);
    });

    try {
      setIsLoading(true);
      const res = await axios.post(
        "https://congozi-backend.onrender.com/api/v1/users",
        data
      );
      notifySuccess(res.data.message || "Kwiyandikisha byagenze neza!");
      navkwigate("/kwinjira");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Habayeho ikosa mu gihe cyo kohereza.";
      notifyError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileTrigger = () => {
    document.getElementById("file-upload").click();
  };
  return (
    <div className=" pt-16">
      <div className="bg-black/20 flex justify-center items-center p-1 rounded-sm">
        <h1 className="md:text-xl text-sm text-Total font-semibold font-Roboto">
          Fungura konti kuri Congozi Expert
        </h1>
      </div>
      <div className="flex md:flex-row flex-col">
        <div className="flex justify-center items-center bg-Total md:h-[75vh] md:w-[45%]">
          <img src={Police} alt="" className="h-[200px]" />
        </div>

        <div className="border border-b-blue-500 border-r-blue-500 rounded-t-md w-full">
          <div className="bg-Passed flex justify-center items-center gap-3 py-1 rounded-r-md">
            <div className="bg-white px-2 rounded-full">
              <p className="text-lg text-Passed">+</p>
            </div>
            <h4 className="text-white text-xl font-semibold">Kwiyandikisha</h4>
          </div>

          <form
            className="w-full pb-5 flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <div className="flex md:flex-row flex-col gap-1 pt-1">
              <HalfInput
                label="Izina rya mbere"
                name="fName"
                value={formData.fName}
                onChange={handleInputChange}
              />
              <HalfInput
                label="Izina rya kabiri"
                name="lName"
                value={formData.lName}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex md:flex-row flex-col gap-1">
              <HalfInput
                label="Aho uherereye"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
              <HalfInput
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <p
              className="absolute md:top-[195px] top-[594.5px] md:-right-[8px] -right-3 cursor-pointer text-red-500 px-4"
              title="Andika nimero ya telefone muri uburyo: 07..."
            >
              {errors.phone && <ErrorMessage message={errors.phone} />}
            </p>
            <div className="flex md:flex-row flex-col gap-1">
              <HalfInput
                label="Ijambobanga"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <HalfInput
                label="Risubiremo"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
            <p
              className="text-red-500 absolute md:top-[238.5px] top-[742.5px] md:-right-[8px] -right-3  md:text-base text-2xl cursor-pointer px-4"
              title="Ijambobanga ntirihuye"
            >
              {errors.confirmPassword && (
                <ErrorMessage message={errors.confirmPassword} />
              )}
            </p>
            <FullInput
              label="Irangamuntu"
              name="idCard"
              value={formData.idCard}
              onChange={handleInputChange}
            />
            <p
              className="absolute md:top-[282.5px] top-[830.5px] md:-right-[12px] -right-3  cursor-pointer md:text-base text-2xl text-red-500 px-4"
              title="Irangamuntu ntiyuzuye, igomba kuba ari imibare 16"
            >
              {errors.idCard && <ErrorMessage message={errors.idCard} />}
            </p>
            <FullInput
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              type="text"
            />
            <p
              className="absolute md:top-[326px]  top-[919px] md:-right-[12px] -right-3 md:text-base text-2xl cursor-pointer text-red-500 px-4"
              title="Emeri igomba kuba yanditse irimo @, akadomo (.com / .net nibindi)"
            >
              {errors.email && <ErrorMessage message={errors.email} />}
            </p>
            <div>
              <label className="text-gray-700 font-medium px-4 md:w-[16%] w-full">
                Ifoto
              </label>
              <div
                className="flex cursor-pointer lg:w-32 w-32 px-4 border-desired"
                onClick={handleFileTrigger}
              >
                <input
                  type="file"
                  id="file-upload"
                  name="profile"
                  className="hidden"
                  accept="image/*"
                  onChange={handleInputChange}
                />
                <GoPaperclip className="lg:w-6 lg:h-6 w-6 h-6 text-tblue mr-2" />
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Ifoto"
                    className="lg:w-6 lg:h-6 w-12 h-12 rounded-full object-cover ml-2"
                  />
                ) : (
                  <span className="text-pcolor text-sm lg:mt-0 mt-1 md:text-sm">
                    Hitamo..
                  </span>
                )}
              </div>
            </div>
            <div className="flex md:flex-row flex-col justify-center items-center md:mr-[150px] pt-6 md:gap-20 gap-6">
              <div className="flex items-center gap-2 px-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="md:w-3 md:h-3 w-4 h-4 rounded-full cursor-pointer"
                />

                <label
                  htmlFor="terms"
                  className="text-gray-700 font-medium cursor-pointer"
                >
                  Amategeko n'ambwiriza
                </label>
              </div>
              <p className="absolute md:top-[413px] md:right-[530px] top-[1030px] text-red-500 text-sm px-4">
                {errors.terms && <ErrorMessage message={errors.terms} />}
              </p>
              <button
                type="submit"
                className="text-white flex justify-center items-center gap-2 px-4 py-1 rounded-md bg-Total hover:bg-blue-800"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size={5} strokeWidth={2} />
                  </>
                ) : (
                  <>
                    <ImUserPlus className="text-white" />
                    Emeza Kwiyandikisha
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
const ErrorMessage = ({ message }) => (
  <p className="text-red-500 text-sm px-4 -mt-2">{message}</p>
);
export default Register;
