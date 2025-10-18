import Bg from "../assets/hero.jpg";
import Logo from "../assets/injourney-logo.png";

function loginPage() {
    return(
        <div className=" flex justify-center items-center">
            <div className="h-screen w-full">
                <img src={Bg} alt="Background" className=" h-screen rounded-r-2xl" />
            </div>
            <div className="h-screen w-full p-10 flex flex-col items-center justify-center">
                <div className=" flex items-start">
                    <img src={Logo} alt="" srcset="" className=" w-30"/>
                </div>
                <div className=" flex flex-col mb-10">
                    <h1 className=" font-bold text-3xl">Login Page</h1>
                    <p>ini halaman login ya</p>
                </div>
                <div className="input flex flex-col gap-3">
                    <input type="email" name="email" id="" className="bg-white rounded-xl p-2 shadow-md w-md" placeholder="Masukan Email Anda" />
                    <input type="password" name="password" id="" className="bg-white rounded-xl p-2 shadow-md" placeholder="Masukan Password Anda"/>
                    <button type="submit" className=" bg-blue-600 text-white rounded-2xl py-1">Login</button>
                </div>
            </div>
        </div>
    )
}

export default loginPage;