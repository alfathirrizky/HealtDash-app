import { useEffect, useState } from "react";
import Profile from "../assets/image.png";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../assets/injourney-logo.png";

function Navbar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
        useEffect(() => {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                navigate("/");
            } else {
                setUser(JSON.parse(storedUser));
            }
        }, [navigate]);
        if (!user) return <p className="p-5 text-lg">Loading user data...</p>;
    const navClass = ({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600";

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white text-gray-800 font-semibold px-5 py-2 flex justify-between items-center shadow-md z-50">
            <img src={Logo} alt="Logo" className="h-15 md:h-20 cursor-pointer" onClick={() => navigate("/home")}/>
            <ul className="hidden md:flex gap-6">
                <li>
                    <NavLink to="/home" className={navClass}>Home</NavLink>
                </li>
                <li>
                    <NavLink to="/survei" className={navClass}>Survei</NavLink>
                </li>
                <li>
                    <NavLink to="/content" className={navClass}>Content</NavLink>
                </li>
            </ul>
            <img src={`http://localhost:5000/uploads/${user.image}`} alt="Profile" className="hidden md:block h-13 w-13 rounded-full cursor-pointer object-cover" onClick={() => navigate("/profile")} />
            <button className="md:hidden" onClick={() => setOpen(!open)}>
                {open ? <X size={28} /> : <Menu size={28} />}
            </button>
            {open && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-md md:hidden">
                    <ul className="flex flex-col gap-4 p-5">
                        <li>
                            <NavLink to="/home" onClick={() => setOpen(false)} className={navClass}>Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/survei" onClick={() => setOpen(false)} className={navClass}>Survei</NavLink>
                        </li>
                        <li>
                            <NavLink to="/content" onClick={() => setOpen(false)} className={navClass}>Education</NavLink>
                        </li>
                        <li className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/profile")}>
                            <img src={Profile} className="h-10 w-10 object-cover rounded-full" />
                            <span>Profile</span>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
