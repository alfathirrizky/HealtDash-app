import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import axios from "axios";
import "aos/dist/aos.css";
import CardSwap, { Card } from "../components/CardSwap"
import SpotlightCard from '../components/SpotlightCard';
import Stepper, { Step } from '../components/Stepper';
import imgComponent from "../assets/image-sugestion.png";

function HomePage() {
    const navigate = useNavigate();
    const [pesan, setPesan] =  useState("");
    const submit = async () => {
        try {
            const token = sessionStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/api/suggestions",
        { pesan },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        );
        alert("Saran berhasil dikirim!");
        setPesan("");
        } catch (error) {
            console.error("Error submitting suggestion:", error);
        }
    }
    useEffect(() => {
        AOS.init({
            duration: 1000
        });
    }, []);

    return (
        <div className="scroll-smooth overflow-x-hidden">
            <section className="hero min-h-screen flex flex-col items-center justify-center bg-[url('./assets/hero.jpg')] bg-cover bg-center text-white px-4 py-10 relative">
                <div className="absolute inset-0 bg-black/40 z-0"></div>
                <div className="z-10 flex flex-col items-center justify-center">
                    <h1 className="text-3xl mb-4 text-center md:text-5xl lg:text-6xl font-bold leading-tight max-w-5xl drop-shadow-md">A Company Facility to Support Employee Mental Wellbeing</h1>
                    <p className="text-base text-center md:text-xl max-w-3xl mt-4 drop-shadow-sm font-light">An internal platform provided by the company to help employees manage work-related stress, maintain mental wellbeing, and stay productive.</p>
                    <button className="mt-8 bg-blue-500 text-white px-8 py-3 rounded-full font-semibold transition duration-300 hover:bg-blue-600 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg" onClick={() => navigate("/survei")}>Get Started</button>
                </div>
            </section>
            
            <section className="flex flex-col items-center justify-center m-5 md:m-10 mt-16 md:mt-24">
                <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
                    <h2 className="text-2xl text-center md:text-3xl lg:text-4xl font-bold mb-4 text-gray-900">About This Mental Health Facility</h2>
                    <p className="text-center text-sm md:text-base text-slate-600 max-w-2xl">A company-provided facility to support employee mental wellbeing and reduce work-related stress.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl px-4 mt-4">
                    <div className="h-auto md:h-72 w-full md:w-1/3 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex flex-col justify-start items-center gap-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 border border-slate-50">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-sm">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                        </div>
                        <h3 className="font-bold text-xl text-center text-gray-800">Who Can Use This Facility</h3>
                        <p className="text-sm text-center text-slate-500 leading-relaxed">This facility is available to all active employees as part of the company’s internal wellbeing support.</p>
                    </div>
                    <div className="h-auto md:h-72 w-full md:w-1/3 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex flex-col justify-start items-center gap-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 border border-slate-50">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-sm">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="font-bold text-xl text-center text-gray-800">When and How It Can Be Used</h3>
                        <p className="text-sm text-center text-slate-500 leading-relaxed">Employees can access the platform anytime during their employment and use it independently based on personal needs.</p>
                    </div>
                    <div className="h-auto md:h-72 w-full md:w-1/3 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex flex-col justify-start items-center gap-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 border border-slate-50">
                        <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                        </div>
                        <h3 className="font-bold text-xl text-center text-gray-800">Separation from Performance</h3>
                        <p className="text-sm text-center text-slate-500 leading-relaxed">Information and results from this platform are not linked to performance reviews, promotions, or disciplinary actions.</p>
                    </div>
                </div>
            </section>
            
            <section className="flex flex-col lg:flex-row items-center justify-between px-5 md:px-10 lg:px-16 xl:px-20 mt-24 w-full">
                <div className="w-full lg:w-[48%]">
                    <h2 className="text-2xl text-center lg:text-left md:text-3xl lg:text-4xl font-bold mb-6 text-gray-900 leading-tight">Why Mental Health Matters at Work?</h2>
                    <p className="text-center lg:text-left text-slate-600 text-base md:text-lg mb-8 leading-relaxed">Mental health directly affects focus, motivation, and work performance. By supporting employee wellbeing, the company helps create a healthier and more productive work environment.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="bg-white font-medium text-slate-700 text-sm shadow-[0_4px_20px_rgb(0,0,0,0.05)] rounded-2xl p-6 border-l-4 border-blue-500 transition-all hover:shadow-md">Tekanan kerja dapat memengaruhi kondisi mental dan emosional karyawan</div>
                        <div className="bg-white font-medium text-slate-700 text-sm shadow-[0_4px_20px_rgb(0,0,0,0.05)] rounded-2xl p-6 border-l-4 border-rose-500 transition-all hover:shadow-md">Stres berkepanjangan dapat menurunkan fokus, motivasi, dan kinerja</div>
                        <div className="bg-white font-medium text-slate-700 text-sm shadow-[0_4px_20px_rgb(0,0,0,0.05)] rounded-2xl p-6 border-l-4 border-emerald-500 transition-all hover:shadow-md">Kesejahteraan individu berkontribusi langsung pada lingkungan kerja yang positif</div>
                        <div className="bg-white font-medium text-slate-700 text-sm shadow-[0_4px_20px_rgb(0,0,0,0.05)] rounded-2xl p-6 border-l-4 border-amber-500 transition-all hover:shadow-md">Dukungan perusahaan membantu mencegah kelelahan kerja (burnout)</div>
                    </div>
                </div>
                <div className="relative h-[350px] md:h-[500px] w-full lg:w-[48%] mt-10 lg:mt-0 rounded-[2rem] z-10 flex items-center justify-end">
                    <CardSwap
                        cardDistance={60}
                        verticalDistance={70}
                        delay={4000}
                        pauseOnHover={true}
                    >
                        <Card className="bg-[url('./assets/hero.jpg')] bg-cover bg-center rounded-3xl shadow-xl border border-white/20">
                        </Card>
                        <Card className="bg-[url('./assets/hero.jpg')] bg-cover bg-center rounded-3xl shadow-xl border border-white/20">
                        </Card>
                        <Card className="bg-[url('./assets/hero.jpg')] bg-cover bg-center rounded-3xl shadow-xl border border-white/20">
                        </Card>
                    </CardSwap>
                </div>
            </section>
            
            <section className="benefit flex flex-col items-center justify-center mt-24 lg:mt-32 px-5">
                <div className="container flex flex-col justify-center items-center mx-auto px-4 py-8 mb-4">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-center text-gray-900">Benefits of Using This Facility</h2>
                    <p className="text-center text-sm md:text-base text-slate-600 max-w-2xl">Supporting mental wellbeing benefits not only employees, but also the company as a whole. A healthy mind helps create a healthier workplace.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
                    <SpotlightCard className="custom-spotlight-card bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] w-full md:w-1/2 p-8 md:p-10 border border-slate-100" spotlightColor="rgba(59, 130, 246, 0.1)">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                            <span className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                            </span>
                            For Employees
                        </h3>
                        <ul className="space-y-5 text-gray-600 text-sm md:text-base font-medium">
                            <li className="flex items-start gap-4"><svg className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span>Better awareness of personal mental wellbeing</span></li>
                            <li className="flex items-start gap-4"><svg className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span>Improved stress management at work</span></li>
                            <li className="flex items-start gap-4"><svg className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span>Increased focus and emotional balance</span></li>
                            <li className="flex items-start gap-4"><svg className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span>Healthier work-life balance</span></li>
                            <li className="flex items-start gap-4"><svg className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span>Stronger sense of support from the company</span></li>
                        </ul>
                    </SpotlightCard>
                    <SpotlightCard className="custom-spotlight-card bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] w-full md:w-1/2 p-8 md:p-10 border border-slate-100" spotlightColor="rgba(168, 85, 247, 0.1)">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                            <span className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                            </span>
                            For the Management
                        </h3>
                        <ul className="space-y-5 text-gray-600 text-sm md:text-base font-medium">
                            <li className="flex items-start gap-4"><svg className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span>More emotionally stable workforce</span></li>
                            <li className="flex items-start gap-4"><svg className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span>Improved productivity and work quality</span></li>
                            <li className="flex items-start gap-4"><svg className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span>Healthier and more supportive work culture</span></li>
                            <li className="flex items-start gap-4"><svg className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span>Reduced burnout and absenteeism risk</span></li>
                            <li className="flex items-start gap-4"><svg className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span>Stronger employee engagement and retention</span></li>
                        </ul>
                    </SpotlightCard>
                </div>
            </section>
            
            <section className="features flex flex-col items-center justify-center gap-5 mt-24 px-5 mb-10">
                <div className="container flex flex-col justify-center items-center mx-auto px-4 py-8 mb-4">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-center text-gray-900">Features</h2>
                    <p className="text-center text-sm md:text-base text-slate-600 max-w-2xl">Our mental health facility offers a range of features to support employee wellbeing:</p>
                </div>
                <div className="w-full max-w-2xl px-4">
                    <Stepper
                    initialStep={1}
                    onStepChange={(step) => {
                        console.log(step);
                    }}
                    onFinalStepCompleted={() => console.log("All steps completed!")}
                    backButtonText="Previous"
                    nextButtonText="Next"
                    >
                        <Step>
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Welcome to the Platform!</h3>
                            <p className="text-slate-600 leading-relaxed">Explore the features designed to support your mental wellbeing.</p>
                        </Step>
                        <Step>
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Daily Check-ins</h3>
                            <img className="h-48 w-full object-cover rounded-2xl shadow-sm my-4" src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1000&auto=format&fit=crop" alt="Daily Check-ins" />
                            <p className="text-slate-600 leading-relaxed">Track your mood and stress levels on a daily basis to identify patterns.</p>
                        </Step>
                        <Step>
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Resources & Guides</h3>
                            <p className="text-slate-600 leading-relaxed">Access a library of articles, videos, and exercises to help you manage stress.</p>
                        </Step>
                        <Step>
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Ready to Start?</h3>
                            <p className="text-slate-600 leading-relaxed">You are all set to begin your journey towards better mental wellbeing.</p>
                        </Step>
                    </Stepper>
                </div>
            </section>
            
            <section className="p-5 md:p-10 lg:p-20 mt-10 mb-20">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.06)] max-w-6xl mx-auto border border-slate-50">
                    <img src={imgComponent} alt="Saran dan Masukan" className="w-full max-w-xs md:max-w-sm lg:max-w-md object-cover rounded-3xl shadow-sm" />
                    <div className="flex flex-col w-full lg:w-1/2 gap-6">
                        <div className="space-y-4 text-center lg:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Saran & Masukan</h2>
                            <p className="text-base md:text-lg text-slate-500 leading-relaxed">Bantu kami menciptakan lingkungan kerja yang lebih sehat. Gunakan kolom ini untuk menyampaikan aspirasi atau kondisi mental Anda sebagai bahan evaluasi rutin manajemen.</p>
                        </div>
                        <div className="flex flex-col gap-4 w-full mt-2">
                            <textarea 
                                value={pesan} 
                                onChange={(e) => setPesan(e.target.value)} 
                                rows="4"
                                placeholder="Isi Saran dan masukanmu di sini..." 
                                className="w-full p-5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition-all resize-none text-gray-700 text-base shadow-inner"
                            ></textarea>
                            <button 
                                type="button" 
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full md:w-auto md:self-end px-10 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 text-lg" 
                                onClick={submit}
                            >
                                Kirim Saran
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage;
