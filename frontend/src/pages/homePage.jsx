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
                <h1 className="text-3xl lg:text-7xl font-bold lg:mb-4">Welcome to the Home Page</h1>
                <p className="text-lg lg:text-xl">This is the home page of the application.</p>
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-2xl transition duration-300 hover:bg-blue-600" onClick={() => navigate("/survei")}>Get Started</button>
            </section>
            <section className="flex flex-col items-center text-white gap-5 px-3 mt-10 w-full">
                <h1 className="text-black font-bold text-xl md:text-2xl text-center">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, sit.
                </h1>
                <div className="flex justify-start w-full overflow-x-auto scrollbar-hide snap-x pb-5 md:justify-center">
                    <div className="flex gap-5">
                        <div className="snap-center min-w-[320px] h-96 bg-[url('./assets/image2.jpg')] bg-cover bg-center flex flex-col justify-end rounded-2xl p-3">
                            <div className="bg-white/20 rounded-xl p-5 backdrop-blur-sm h-32 transition-all duration-700 hover:h-full">
                                <h1 className="font-bold text-2xl">Text 1</h1>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                            </div>
                        </div>
                        <div className="snap-center min-w-[320px] h-96 bg-[url('./assets/image2.jpg')] bg-cover bg-center flex flex-col justify-end rounded-2xl p-3">
                            <div className="bg-white/20 rounded-xl p-5 backdrop-blur-sm h-32 transition-all duration-700 hover:h-full">
                                <h1 className="font-bold text-2xl">Text 2</h1>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                            </div>
                        </div>
                        <div className="snap-center min-w-[320px] h-96 bg-[url('./assets/image2.jpg')] bg-cover bg-center flex flex-col justify-end rounded-2xl p-3">
                            <div className="bg-white/20 rounded-xl p-5 backdrop-blur-sm h-32 transition-all duration-700 hover:h-full">
                                <h1 className="font-bold text-2xl">Text 3</h1>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className=" h-screen flex justify-between p-10">
                <h1>hai</h1>
            </div>  
        </div>
    )
}

export default HomePage;