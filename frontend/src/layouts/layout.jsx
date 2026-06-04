import Sidebar from "../components/sidebar";
import { useOutlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Layout() {
    const location = useLocation();
    const outlet = useOutlet();

    return(
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden">
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
