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

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profile: file }));
      if (file) {
        const previewURL = URL.createObjectURL(file);
        setSelectedImage(previewURL);
      }
    } else if (name === "phone") {
      // Format phone number automatically
      const formattedPhone = value.replace(/\D/g, "").replace(/^0/, "");
      setFormData((prev) => ({ ...prev, [name]: formattedPhone }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateInputs = () => {
    let newErrors = {};

    // Required fields validation
    if (!formData.fName.trim()) {
      newErrors.fName = "Izina rya mbere rirakenewe";
    }

    if (!formData.lName.trim()) {
      newErrors.lName = "Izina rya kabiri rirakenewe";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Aho uherereye birakenewe";
    }

    // Phone validation (required and format)
    if (!formData.phone) {
      newErrors.phone = "Numero ya telefone irakenewe";
    } else if (!/^(72|73|78|79)\d{7}$/.test(formData.phone)) {
      newErrors.phone = "Numero ya telefone ntabwo ari yo";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Ijambobanga rirakenewe";
    } else if (formData.password.length < 6) {
      newErrors.password = "Ijambobanga rigomba kuba nibura imibare 6";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Ijambobanga ntirihuye";
    }

    // Email validation (only if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email ntabwo ari yo";
    }

    // ID Card validation (only if provided)
    if (formData.idCard && !/^\d{16}$/.test(formData.idCard)) {
      newErrors.idCard = "Irangamuntu igomba kuba imibare 16";
    }

    // Profile image validation (only if provided)
    if (formData.profile && !formData.profile.type.startsWith("image/")) {
      newErrors.profile = "Hitamo ifoto gusa";
    }

    if (!agreedToTerms) {
      newErrors.terms = "Ugomba kwemera amategeko n'amabwiriza";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const notifySuccess = (msg) =>
    toast.success(msg, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const notifyError = (msg) =>
    toast.error(msg, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      // Only append fields that have values (except confirmPassword)
      if (key !== "confirmPassword" && value !== "" && value !== null) {
        data.append(key, value);
      }
    });

    try {
      setIsLoading(true);
      const res = await axios.post(
        "https://congozi-backend.onrender.com/api/v1/users",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      notifySuccess(res.data.message);

      // Reset form and redirect after delay
      setTimeout(() => {
        setFormData({
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
        setSelectedImage(null);
        setAgreedToTerms(false);
        navigate("/kwinjira");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Habaye ikibazo mugukora konti";
      notifyError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileTrigger = () => {
    document.getElementById("file-upload").click();
  };

  return (
    <div className="pt-16">
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
            className="w-full py-10 flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <div className="flex md:flex-row flex-col gap-1 pt-1">
              <HalfInput
                label="Izina rya mbere"
                name="fName"
                value={formData.fName}
                onChange={handleInputChange}
                required
                error={errors.fName}
              />
              <HalfInput
                label="Izina rya kabiri"
                name="lName"
                value={formData.lName}
                onChange={handleInputChange}
                required
                error={errors.lName}
              />
            </div>
            <div className="flex md:flex-row flex-col gap-1">
              <HalfInput
                label="Aho uherereye"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                error={errors.address}
              />
              <HalfInput
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="078xxxxxx cg 072xxxxxx"
                required
                error={errors.phone}
              />
            </div>
            <div className="flex md:flex-row flex-col gap-1">
              <HalfInput
                label="Ijambobanga"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                error={errors.password}
              />
              <HalfInput
                label="Risubiremo"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                error={errors.confirmPassword}
              />
            </div>
            <div className="flex md:flex-row flex-col gap-1">
              <HalfInput
                label="Irangamuntu (Si Itegeko)"
                name="idCard"
                value={formData.idCard}
                onChange={handleInputChange}
                error={errors.idCard}
              />
              <HalfInput
                label="Email (Si Itegeko)"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                error={errors.email}
              />
            </div>
            <div>
              <label className="text-gray-700 font-medium px-4 md:w-[16%] w-full">
                Ifoto (Si Itegeko)
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
              {errors.profile && <ErrorMessage message={errors.profile} />}
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
                {errors.terms && <ErrorMessage message={errors.terms} />}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="text-white flex justify-center items-center gap-2 px-4 py-1 rounded-md bg-Total hover:bg-blue-800 disabled:bg-gray-400"
              >
                {isLoading ? (
                  <LoadingSpinner size={5} strokeWidth={2} />
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
  <span className="text-red-500 text-sm ml-2">{message}</span>
);

export default Register;
