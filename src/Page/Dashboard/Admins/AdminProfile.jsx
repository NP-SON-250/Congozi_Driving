import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState("umurerwa@gmail.com");
  const [fullName, setFullName] = useState("UMURERWA Anaise");
  const [address, setAddress] = useState("123 Kgt Street");
  const [telephone, setTelephone] = useState("+250 781 234 567");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Profile Updated:", {
      profileImage,
      email,
      fullName,
      address,
      telephone,
    });
    // Add your update logic here (API call, etc.)
  };

  return (
    <div className="flex items-top justify-center">
      <div className="bg-white shadow-md rounded-lg md:p-1 p-6 w-full max-w-xl text-center">
        <h2 className="text-xl font-bold text-blue-900 mb-1">Admin Profile</h2>

        {/* Profile Image Section */}
        <div className="relative w-24 h-24 mx-auto mb-1">
          <img
            src={
              profileImage ||
              "https://res.cloudinary.com/da12yf0am/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1740671685/SBS%20Images/file_limbge.webp"
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

        {/* Profile Info Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-1 px-4 text-left"
        >
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              value={email}
              className="w-full px-4 py-1 border rounded"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              value={fullName}
              className="w-full px-4 py-1 border rounded"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Address</label>
            <input
              type="text"
              value={address}
              className="w-full px-4 py-1 border rounded"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Telephone</label>
            <input
              type="text"
              value={telephone}
              className="w-full px-4 py-1 border rounded"
              onChange={(e) => setTelephone(e.target.value)}
            />
          </div>

          <div className="pt-4 flex md:flex-row flex-col md:gap-10 gap-0 items-center">
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
              Update password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
