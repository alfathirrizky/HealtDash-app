import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import CardSwap, { Card } from "../components/CardSwap"
import SpotlightCard from '../components/SpotlightCard';

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
                    <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2">About This Mental Health Facility</h1>
                    <p className="text-center text-xs">A company-provided facility to support employee mental wellbeing and reduce work-related stress.</p>
                </div>
            </section>
            <section className="flex items-center justify-between px-78">
                <div className="w-2xl">
                    <h1 className="text-xl md:text-3xl font-bold mb-4">Why Mental Health Matters at Work?</h1>
                    <p>This platform is an official internal facility provided by the company to support the mental wellbeing of employees.It is not an external service and not a commercial offering.</p>
                </div>
                <div style={{ height: '500px', position: 'relative' }}>
                    <CardSwap
                        cardDistance={60}
                        verticalDistance={70}
                        delay={4000}
                        pauseOnHover={true}
                    >
                        <Card className="bg-[url('./assets/hero.jpg')] bg-cover bg-center">
                        </Card>
                        <Card className="bg-[url('./assets/hero.jpg')] bg-cover bg-center">
                        </Card>
                        <Card className="bg-[url('./assets/hero.jpg')] bg-cover bg-center">
                        </Card>
                    </CardSwap>
                </div>
            </section>
            <section className="benefit flex flex-col items-center justify-center mt-85">
                <div className="container flex flex-col justify-center items-center mx-auto px-4 py-8">
                    <h2 className="text-xl md:text-3xl lg:text-5xl font-bold mb-2">Benefits of Using This Facility</h2>
                    <p className="text-center text-xs">Using this facility can help employees manage stress, improve focus, and maintain a healthy work-life balance.</p>
                </div>
                <div className="flex flex-row gap-5">
                    <SpotlightCard className="custom-spotlight-card bg-slate-50 w-2xl" spotlightColor="rgba(0, 229, 255, 0.2)">
                        <h1>hai</h1>
                        <h3 className=" font-medium">For Employees</h3>
                        <p>isi benefit</p>
                    </SpotlightCard>
                    <SpotlightCard className="custom-spotlight-card bg-slate-50 w-2xl" spotlightColor="rgba(0, 229, 255, 0.2)">
                        <h1>hai</h1>
                        <h3 className=" font-medium">For Management</h3>
                        <p>isi benefit</p>
                    </SpotlightCard>
                </div>
            </section>
            <section className="features flex flex-col md:flex-row items-center justify-center mt-55">
                <div className="container flex flex-col justify-center items-center mx-auto px-4 py-8">
                    <h1 className="text-xl md:text-3xl lg:text-5xl font-bold mb-2">Features</h1>
                    <p className="text-center text-xs">Our mental health facility offers a range of features to support employee wellbeing:</p>
                </div>
            </section>
        </div>
    )
}

export default HomePage;