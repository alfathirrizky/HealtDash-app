import Logo from "../assets/injourney-logo.png";
import Profile from "../assets/image.png";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className=" fixed top-0 right-0 left-0 bg-white text-gray-800 py-2 px-5 flex justify-between shadow-md items-center z-50">
            <div className="flex items-center">
            <img src={Logo} alt="Logo" className="h-10 md:h-20 cursor-pointer" onClick={() => navigate("/home")} />
            </div>
            <div className="profile">
                <img src={Profile} alt="Profile" className="h-10 w-10 md:h-12 md:w-12 rounded-full cursor-pointer object-cover" onClick={() => navigate("/profile")} />
            </div>
        </nav>
    );
}
export default Navbar;