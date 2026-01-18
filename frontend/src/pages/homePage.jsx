import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import Img3 from "../assets/image3.jpg";
import "aos/dist/aos.css";

function HomePage() {
    const navigate = useNavigate();
    useEffect(() => {
        AOS.init({
            duration: 1000
        });
    }, []);

    return (
        <div className="scroll-smooth overflow-y-hidden">
            <section className="hero h-screen flex flex-col items-center justify-center bg-[url('./assets/hero.jpg')] bg-cover bg-center text-white">
                <h1 className="text-2xl mb-3 text-center md:text-4xl font-bold lg:mb-4">A Company Facility to Support Employee Mental Wellbeing</h1>
                <p className="text-sm text-center md:text-lg lg:text-2xl">An internal platform provided by the company to help employees manage work-related stress, maintain mental wellbeing, and stay productive.</p>
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-2xl transition duration-300 hover:bg-blue-600 cursor-pointer" onClick={() => navigate("/survei")}>Get Started</button>
            </section>
            <section className="flex flex-col md:flex-row items-center justify-center">
                <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
                    <h1 className="text-xl md:text-3xl font-bold mb-2">About This Mental Health Facility</h1>
                    <p className="text-center text-xs">A company-provided facility to support employee mental wellbeing and reduce work-related stress.</p>
                </div>
            </section>
            <section className="flex flex-col md:flex-row items-center justify-center">
                <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
                    <h1 className="text-xl md:text-3xl font-bold mb-4 text-center">Why Mental Health Matters at Work?</h1>
                </div>
            </section>
            <section className="features flex flex-col md:flex-row items-center justify-center">
                <div className="container flex flex-col justify-center items-center mx-auto px-4 py-8">
                    <h1 className="text-xl md:text-3xl font-bold mb-2">Features</h1>
                    <p className="text-center text-xs">Our mental health facility offers a range of features to support employee wellbeing:</p>
                </div>
            </section>
        </div>
    )
}

export default HomePage;