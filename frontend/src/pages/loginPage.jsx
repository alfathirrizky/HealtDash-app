import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import Bg from "../assets/hero.jpg";
import Logo from "../assets/injourney-logo.png";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="h-screen w-full">
        <img
          src={Bg}
          alt="Background"
          className="h-screen w-full object-cover rounded-r-2xl"
        />
      </div>
      <div className="h-screen w-full p-10 flex flex-col">
        <div className="flex justify-end mb-25">
          <img src={Logo} alt="Logo" className="w-32" />
        </div>
        <div className="flex flex-col mb-10 justify-center items-center">
          <h1 className="font-bold text-3xl">Login Page</h1>
          <p className="text-gray-600">Silakan login untuk melanjutkan</p>
        </div>
        <div className="flex flex-col gap-4 w-lg mx-auto">
          <div className="relative w-full">
            <input
              type="email"
              name="email"
              className="bg-white rounded-xl p-2 border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukan Email Anda"
            />
            <CiMail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="bg-white rounded-xl p-2 border border-gray-300 w-full pr-10"
              placeholder="Masukan Password Anda"
            />
            <span
              onClick={togglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span> 
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-2xl py-2 font-semibold hover:bg-blue-700 transition-all"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
