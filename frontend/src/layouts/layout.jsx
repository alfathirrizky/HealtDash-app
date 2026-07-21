import Sidebar from "../components/sidebar";
import { useOutlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu } from "lucide-react";
import Logo from '../assets/injourney-logo.png';

function Layout() {
    const location = useLocation();
    const outlet = useOutlet();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden relative">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            <main className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden w-full h-full">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <Menu className="w-5 h-5 text-slate-700" />
                    </button>
                    <img src={Logo} alt="InJourney Logo" className="h-6 ml-4" />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {outlet}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}

export default Layout;
