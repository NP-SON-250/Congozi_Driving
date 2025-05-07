import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const StudentAccount = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [address, setAddress] = useState("");
  const [telephone, setTelephone] = useState("");
  const [userId, setUserId] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser._id);
        setEmail(parsedUser.email || "");
        setFName(parsedUser.fName || "");
        setLName(parsedUser.lName || "");
        setAddress(parsedUser.address || "");
        setTelephone(parsedUser.phone || "");
        setProfileImage(parsedUser.profile || null);
        setOriginalData({
          profile: parsedUser.profile || null,
          email: parsedUser.email || "",
          fName: parsedUser.fName || "",
          lName: parsedUser.lName || "",
          address: parsedUser.address || "",
          phone: parsedUser.phone || "",
        });
      } catch (err) {
        console.error("Failed to parse stored user:", err);
      }
    }
  }, []);

  // Handle profile image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  // Save updated profile data
  const handleSave = async () => {
    const newData = new FormData();
    newData.append("profile", profileImage);
    newData.append("email", email);
    newData.append("fName", fName);
    newData.append("lName", lName);
    newData.append("address", address);
    newData.append("phone", telephone);

    try {
      const response = await axios.put(
        `http://localhost:4900/api/v1/users/${userId}`,
        newData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Profile updated successfully.");
      setMessageType("success");

      const updatedUser = response.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update state with new profile data
      setEmail(updatedUser.email || "");
      setFName(updatedUser.fName || "");
      setLName(updatedUser.lName || "");
      setAddress(updatedUser.address || "");
      setTelephone(updatedUser.phone || "");
      setProfileImage(updatedUser.profile || null);
      setOriginalData(updatedUser);
    } catch (error) {
      console.error("Update failed:", error);
      setMessage("Failed to update profile. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="flex items-top justify-center">
      <div className="bg-white shadow-md rounded-lg md:p-1 p-6 w-full max-w-xl text-center">
        <h2 className="md:text-xs text-md font-bold text-blue-900 mb-1">
          Your Profile
        </h2>

        {/* Message Display */}
        {message && (
          <div
            className={`text-sm mb-3 px-2 py-1 rounded ${
              messageType === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Profile Image */}
        <div className="relative w-24 h-24 mx-auto mb-1">
          <img
            src={
              profileImage instanceof File
                ? URL.createObjectURL(profileImage) // Generate URL only if profileImage is a file object
                : profileImage ||
                  "https://res.cloudinary.com/da12yf0am/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1740671685/SBS%20Images/file_limbge.webp" // Fallback if no image is selected
            }
            alt="Profile"
            className="w-full h-full object-cover rounded-full border border-gray-300"
          />
          <label className="absolute bottom-0 right-0 bg-white p-[6px] rounded-full shadow cursor-pointer">
            <FaCamera />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-1 px-4 text-left"
        >
          <div>
            <label className="block md:text-xs text-md font-medium">
              Email
            </label>
            <input
              type="email"
              value={email} // This should always be a string
              className="w-full px-4 md:text-xs text-md py-1 border rounded"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block md:text-xs text-md font-medium">
              First Name
            </label>
            <input
              type="text"
              value={fName} // This should always be a string
              className="w-full px-4 md:text-xs text-md py-1 border rounded"
              onChange={(e) => setFName(e.target.value)}
            />
          </div>

          <div>
            <label className="block md:text-xs text-md font-medium">
              Last Name
            </label>
            <input
              type="text"
              value={lName} // This should always be a string
              className="w-full px-4 md:text-xs text-md py-1 border rounded"
              onChange={(e) => setLName(e.target.value)}
            />
          </div>

          <div>
            <label className="block md:text-xs text-md font-medium">
              Address
            </label>
            <input
              type="text"
              value={address} // This should always be a string
              className="w-full px-4 md:text-xs text-md py-1 border rounded"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block md:text-xs text-md font-medium">
              Telephone
            </label>
            <input
              type="text"
              value={telephone} // This should always be a string
              className="w-full px-4 md:text-xs text-md py-1 border rounded"
              onChange={(e) => setTelephone(e.target.value)}
            />
          </div>

          <div className="pt-4 flex md:text-xs text-md md:flex-row flex-col md:gap-10 gap-0 items-center">
            <button
              type="submit"
              className="bg-blue-900 text-white px-6 py-1 rounded hover:bg-blue-800 mb-3"
            >
              Save Changes
            </button>

            <Link
              to="/change/password"
              className="text-blue-600 hover:text-yellow-600"
            >
              Change password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentAccount;
