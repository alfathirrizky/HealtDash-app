import Logo from "../assets/injourney-logo.png";
import Profile from "../assets/image.png";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className=" fixed top-0 right-0 left-0 bg-white text-gray-800 p-1 px-10 flex justify-between shadow-md items-center z-50">
            <div className="flex items-center">
            <img src={Logo} alt="Logo" className="h-20 cursor-pointer" onClick={() => navigate("/")} />
            <a href="/"></a>
            </div>
            <div className="profile">
                <img src={Profile} alt="Profile" className="h-12 w-12 rounded-full cursor-pointer object-cover" onClick={() => navigate("/profile")} />
            </div>
        </nav>
    );
}
export default Navbar;