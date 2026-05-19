import { useOutlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { motion, AnimatePresence } from "framer-motion";

function HomeLayout() {
    const location = useLocation();
    const outlet = useOutlet();

    return(
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
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
            <Footer />
        </div>
    )
}

export default HomeLayout;
