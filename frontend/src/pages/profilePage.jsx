import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ProfilePage() {
    const navigate = useNavigate();
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
    return(
        <>
            <div className=" bg-white p-6 flex flex-col mt-20">
                <div className="profile flex flex-row gap-4 items-center pb-4 border-gray-200 mb-5">
                    <img src={`http://localhost:5000/uploads/${user.image}`} alt="Profile" className="w-20 h-20 object-cover rounded-full" />
                    <h1 className="font-bold text-3xl">Hai, {user.name} !</h1>
                </div>
                <div className="PersonalInfo border-b-2 pb-4 border-gray-200">
                    <h1 className="font-bold text-2xl mb-5">Personal Detail</h1>
                    <div className="data grid grid-cols md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold text-lg mb-1">Name</p>
                            <p className="text-gray-800 border-1 border-gray-200 rounded-md p-2 text-lg">{user.name}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-lg mb-1">Phone Number</p>
                            <p className="text-gray-800 border-1 border-gray-200 rounded-md p-2 text-lg">{user.telepon}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-lg mb-1">Email</p>
                            <p className="text-gray-800 border-1 border-gray-200 rounded-md p-2 text-lg">{user.email}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-lg mb-1">Position</p>
                            <p className="text-gray-800 border-1 border-gray-200 rounded-md p-2 text-lg">{user.position}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-lg mb-1">Gender</p>
                            <p className="text-gray-800 border-1 border-gray-200 rounded-md p-2 text-lg">{user.gender}</p>
                        </div>
                    </div>
                <button className="mt-4 w-full px-10 py-2 bg-blue-600 text-white rounded-3xl shadow-md hover:bg-blue-700 text-xl font-semibold" onClick={() => navigate("/")}>Logout</button>
                </div>
            </div>
        </>
    );
}

export default ProfilePage;