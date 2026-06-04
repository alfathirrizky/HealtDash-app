import React, { useState } from 'react';
import Logo from '../assets/injourney-logo.png';
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";

function Sidebar() {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        sessionStorage.clear();
        localStorage.clear();
        setShowLogoutModal(false);
        toast.success("Berhasil logout dari dashboard!");
        navigate("/");
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };
    const menu = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Identification", path: "/identification" },
        { name: "Education", path: "/galleryDash" },
        { name: "Question", path: "/question" },
        { name: "Survei", path: "/surveiDash" },
        { name: "Suggestion", path: "/suggestion" },
        { name: "Answer", path: "/answer" },
        { name: "Manajemen User", path: "/user" },
    ];
    return (
        <div className="sticky top-0 z-10 flex flex-col bg-white shadow-md w-64 min-w-64 h-screen p-5 print:hidden">
            <div className='flex items-center justify-center'>
                <a href="/">
                    <img src={Logo} alt="InJourney Logo" className=' mb-8 w-52' />
                </a>
            </div>
            <nav className='flex flex-col gap-2 flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pr-1 pb-4'>
                {menu.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive
                                ? "font-semibold bg-blue-500 text-white rounded-xl py-2.5 px-4 transition-all duration-300 shadow-sm shadow-blue-500/30"
                                : "font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl py-2.5 px-4 transition-all duration-200"
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-5 border-t border-gray-100">
                <button
                    onClick={handleLogoutClick}
                    className="flex items-center justify-center gap-2 w-full font-medium text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl py-2.5 px-4 transition-all duration-300 shadow-sm border border-transparent hover:border-rose-100"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>

            {/* Modal Konfirmasi Logout */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogOut className="w-8 h-8 text-rose-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Konfirmasi Logout</h3>
                            <p className="text-sm text-slate-500">
                                Apakah Anda yakin ingin keluar dari dashboard? Anda harus login kembali untuk mengakses data.
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 flex items-center gap-3 border-t border-slate-100">
                            <button
                                onClick={cancelLogout}
                                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm shadow-rose-600/20"
                            >
                                Ya, Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Sidebar;
