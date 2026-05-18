import { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../assets/injourney-logo.png";
import ProfileFallback from "../assets/image.png";

function Navbar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const menuRef = useRef(null);

    // Menutup menu mobile ketika melakukan klik di luar navbar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/");
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    if (!user) return <div className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white shadow-sm z-50"></div>;

    const navClass = ({ isActive }) => 
        isActive 
            ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1 transition-all" 
            : "text-slate-600 hover:text-blue-600 font-medium transition-all";
            
    const mobileNavClass = ({ isActive }) => 
        isActive 
            ? "block text-blue-600 font-bold bg-blue-50 px-4 py-3 rounded-xl transition-all" 
            : "block text-slate-600 hover:text-blue-600 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium transition-all";

    const userImageUrl = user.image ? `http://localhost:5000/uploads/${user.image}` : ProfileFallback;

    return (
        <nav ref={menuRef} className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-slate-100 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    
                    {/* Bagian Kiri: Logo */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer transition-transform hover:scale-105" onClick={() => navigate("/home")}>
                        <img src={Logo} alt="InJourney Logo" className="h-9 md:h-12 w-auto object-contain" />
                    </div>

                    {/* Bagian Tengah: Menu Desktop */}
                    <ul className="hidden md:flex space-x-10 items-center">
                        <li>
                            <NavLink to="/home" className={navClass}>Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/survei" className={navClass}>Survei</NavLink>
                        </li>
                        <li>
                            <NavLink to="/content" className={navClass}>Edukasi</NavLink>
                        </li>
                    </ul>

                    {/* Bagian Kanan: Profil Desktop */}
                    <div className="hidden md:flex items-center">
                        <div 
                            className="flex items-center gap-3 cursor-pointer group rounded-full p-1.5 hover:bg-slate-50 transition-colors"
                            onClick={() => navigate("/profile")}
                        >
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 hidden lg:block text-right">
                                {user.name?.split(' ')[0] || 'Profil'}
                            </span>
                            <img 
                                src={userImageUrl} 
                                alt="Profile" 
                                className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-blue-200 transition-all shadow-sm" 
                                onError={(e) => { e.target.src = ProfileFallback }}
                            />
                        </div>
                    </div>

                    {/* Tombol Hamburger Mobile */}
                    <div className="flex items-center md:hidden">
                        <button 
                            className="text-slate-600 hover:text-blue-600 p-2 focus:outline-none transition-colors"
                            onClick={() => setOpen(!open)}
                            aria-label="Toggle Menu"
                        >
                            {open ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Dropdown Menu Mobile */}
            <div 
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    open ? "max-h-96 border-b border-slate-100 shadow-lg" : "max-h-0"
                }`}
            >
                <div className="px-4 pt-2 pb-5 space-y-2 bg-white">
                    <NavLink to="/home" onClick={() => setOpen(false)} className={mobileNavClass}>Home</NavLink>
                    <NavLink to="/survei" onClick={() => setOpen(false)} className={mobileNavClass}>Survei</NavLink>
                    <NavLink to="/content" onClick={() => setOpen(false)} className={mobileNavClass}>Edukasi</NavLink>
                    
                    {/* Profil di Menu Mobile */}
                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <div 
                            className="flex items-center gap-4 px-4 py-3 cursor-pointer rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100" 
                            onClick={() => {
                                setOpen(false);
                                navigate("/profile");
                            }}
                        >
                            <img 
                                src={userImageUrl} 
                                alt="Profile" 
                                className="h-11 w-11 object-cover rounded-full ring-2 ring-white shadow-sm" 
                                onError={(e) => { e.target.src = ProfileFallback }}
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-800 line-clamp-1">{user.name || 'User Profile'}</span>
                                <span className="text-xs font-semibold text-blue-600">Lihat Profil</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
