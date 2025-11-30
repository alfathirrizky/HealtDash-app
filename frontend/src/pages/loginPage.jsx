import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import Bg from "../assets/hero.jpg";
import Logo from "../assets/injourney-logo.png";
import Api from "../api/api.js";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
    try {
        console.log("Mengirim request login...");
        const res = await Api.post("/auth/login", { email, password });
        console.log("Respons dari server:", res.data);
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                const role = res.data.user?.role;
                if (role === "admin") {
                    navigate("/dashboard");
                } else {
                    navigate("/home");
                }
                // navigate("/home");
            } else {
                setError("Login gagal: Token tidak ditemukan di respons server.");
            }
        } catch (err) {
            console.error("LOGIN ERROR:", err);
            setError(err.response?.data?.message || "Email atau password salah.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="hidden md:block h-screen w-full">
                <img src={Bg} alt="Background" className="h-screen w-full object-cover rounded-r-2xl" />
            </div>
            <div className="h-screen w-full p-10 flex flex-col">
                <div className="flex justify-end mb-25">
                    <img src={Logo} alt="Logo" className="w-32" />
                </div>
                <div className=" flex flex-col md:px-15">
                    <div className="flex flex-col mb-10 justify-center items-center">
                        <h1 className="font-bold text-2xl">Login Page</h1>
                        <p className="text-gray-600 text-lg text-center">Silakan login untuk melanjutkan</p>
                    </div>
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div className="relative">
                            <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white rounded-xl p-2 border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukan Email Anda"
                            />
                            <CiMail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
                        </div>
                        <div className="relative">
                            <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`rounded-2xl py-2 font-semibold transition-all flex justify-center items-center ${
                            loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                        >
                            {loading ? (
                            <div className="flex items-center gap-2">
                                <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                ></path>
                                </svg>
                                <span>Loading...</span>
                            </div>
                            ) : (
                            "Login"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
