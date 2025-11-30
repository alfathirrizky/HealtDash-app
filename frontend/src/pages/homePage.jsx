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
            <section className="h-screen flex flex-col items-center justify-center bg-[url('./assets/hero.jpg')] bg-cover bg-center text-white">
                <h1 className="text-7xl font-bold mb-4">Welcome to the Home Page</h1>
                <p className="text-xl">This is the home page of the application.</p>
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-2xl transition duration-300 hover:bg-blue-600" onClick={() => navigate("/survei")}>Get Started</button>
            </section>
            <div className="h-screen flex flex-col items-center justify-center text-white gap-5 px-10">
                <div className=" mb-5">
                    <h1 className=" text-black font-bold text-2xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, sit.</h1>
                </div>
                <div className="flex gap-5">
                    <div className=" bg-[url('./assets/image2.jpg')] flex flex-col justify-end rounded-2xl h-96 w-sm p-3 shadow-2xl" data-aos="fade-up" data-aos-anchor-placement="center-center" data-aos-delay="100" data-aos-duration="700">
                        <div className="bg-white/20 rounded-xl p-5 backdrop-blur-sm h-32 transition-all duration-700 delay-300 ease-in-out hover:h-full">
                            <h1 className=" font-bold text-2xl">Text 1</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, possimus.</p>
                        </div>
                    </div>
                    <div className=" bg-[url('./assets/image2.jpg')] flex flex-col justify-end rounded-2xl h-96 w-sm p-3 shadow-2xl" data-aos="fade-up" data-aos-anchor-placement="center-center" data-aos-delay="200" data-aos-duration="700">
                        <div className="bg-white/20 rounded-xl p-5 backdrop-blur-sm h-32 transition-all duration-700 delay-300 ease-in-out hover:h-full">
                            <h1 className=" font-bold text-2xl">Text 1</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, possimus.</p>
                        </div>
                    </div>
                    <div className=" bg-[url('./assets/image2.jpg')] flex flex-col justify-end rounded-2xl h-96 w-sm p-3 shadow-2xl" data-aos="fade-up" data-aos-anchor-placement="center-center" data-aos-delay="300" data-aos-duration="700">
                        <div className="bg-white/20 rounded-xl p-5 backdrop-blur-sm h-32 transition-all duration-700 delay-300 ease-in-out hover:h-full">
                            <h1 className=" font-bold text-2xl group-hover:hidden">Text 1</h1>
                            <p className=" line-clamp-3 group-hover:block">Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, possimus. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis repellendus maiores perferendis aut quos quas cumque consequatur modi consectetur, quaerat laboriosam. Ipsam repudiandae natus ad recusandae fugiat placeat ipsum doloremque blanditiis voluptatum enim, expedita nam, itaque minima delectus nihil a cum, similique sequi! Suscipit, consequatur inventore veritatis voluptatibus maiores optio? </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-screen flex flex-row gap-10 items-center justify-center">
                <div className="gallery flex gap-5 flex-wrap justify-center items-center">
                    <div className="bg-[url('./assets/image2.jpg')] rounded-xl p-3 justify-between flex flex-col backdrop-blur-xs h-80 w-70" data-aos="fade-up" data-aos-delay="100">1</div>
                    <div className="bg-[url('./assets/image2.jpg')] rounded-xl p-3 justify-between flex flex-col backdrop-blur-xs h-100 w-70" data-aos="fade-up" data-aos-delay="200">1</div>
                    <div className="bg-[url('./assets/image2.jpg')] rounded-xl p-3 justify-between flex flex-col backdrop-blur-xs h-120 w-70" data-aos="fade-up" data-aos-delay="300">1</div>
                </div>
                <div className="text flex flex-col gap-5 max-w-lg items-start">
                    <h1 className="font-bold text-5xl">Gallery</h1>
                    <p className=" text-lg max-w-2xl text-justify line-clamp-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, quas! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur, repudiandae!</p>
                    <button onClick={()=>navigate("/gallery")} className="text-blue-500 hover:underline cursor-pointer">View All</button>
                </div>
            </div>
            <div className=" h-screen flex justify-between p-10">
            </div>
        </div>
    )
}

export default HomePage;