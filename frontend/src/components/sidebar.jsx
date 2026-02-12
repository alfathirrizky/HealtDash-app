import Logo from '../assets/injourney-logo.png';
import { NavLink } from "react-router-dom";

function Sidebar() {
    const menu=[
        { name: "Dashboard", path: "/dashboard" },
        { name: "Identification", path: "/identification" },
        { name: "Gallery", path: "/galleryDash" },
        { name: "Question", path: "/question" },
        { name: "User", path: "/user" },
        { name: "Survei", path: "/surveiDash" },
        { name: "Suggestion", path: "/suggestion" },
    ];
    return(
        <div className=" flex flex-col bg-white shadow-md w-64 min-w-64 h-screen p-5">
            <div className='flex items-center justify-center'>
                <a href="/">
                    <img src={Logo} alt="InJourney Logo" className=' mb-8 w-52'/>
                </a>
            </div>
            <nav className=' flex flex-col gap-3'>
                {menu.map((item, index) => (
                <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) =>
                    isActive
                        ? "font-medium bg-blue-500 text-white rounded-3xl py-2 px-5 transition-all duration-300 transform scale-105"
                        : "font-medium text-gray-700 hover:bg-blue-500/75 hover:text-white rounded-3xl py-2 px-5 transition-all duration-300 transform scale-105"
                    }
                >
                    {item.name}
                </NavLink>
                ))}
            </nav>
        </div>
    )
}
export default Sidebar;