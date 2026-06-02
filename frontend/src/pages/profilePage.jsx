import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "@/api/api";

function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) {
            navigate("/");
        } else {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchHistory(parsedUser.id);
        }
    }, [navigate]);

    const fetchHistory = async (userId) => {
        try {
            const res = await API.get(`/answers/history/${userId}`);
            setHistory(res.data);
        } catch (error) {
            console.error("Error fetching survey history:", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    if (!user) return <p className="p-5 text-lg">Loading user data...</p>;
    const handleLogout = () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        navigate("/");                  
    };

    return(
        <>
            <div className="bg-gray-50 min-h-screen p-6 flex flex-col pt-20">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8 profile flex flex-row gap-6 items-center">
                    <img src={`http://localhost:5000/uploads/${user.image}`} alt="Profile" className="w-24 h-24 object-cover rounded-full shadow-sm border-2 border-white" />
                    <div>
                        <h1 className="font-bold text-3xl text-gray-800">Hai, {user.name}!</h1>
                        <p className="text-gray-500 mt-1 font-medium">{user.position} • {user.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Kolom Kiri: Personal Detail */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6 flex flex-col justify-between">
                        <div>
                            <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-3">Personal Detail</h2>
                            <div className="flex flex-col gap-5">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1">Name</p>
                                    <p className="font-semibold text-gray-800 text-lg">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1">Phone Number</p>
                                    <p className="font-semibold text-gray-800 text-lg">{user.telepon}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1">Email</p>
                                    <p className="font-semibold text-gray-800 text-lg">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1">Position</p>
                                    <p className="font-semibold text-gray-800 text-lg">{user.position}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1">Gender</p>
                                    <p className="font-semibold text-gray-800 text-lg">{user.gender}</p>
                                </div>
                            </div>
                        </div>
                        <button className="mt-8 w-full py-3 bg-red-500 hover:bg-red-600 transition-colors text-white rounded-xl shadow-sm text-lg font-semibold" onClick={handleLogout}>Logout</button>
                    </div>

                    {/* Kolom Kanan: Riwayat Survei */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-3">Riwayat Survei</h2>
                        {loadingHistory ? (
                            <div className="animate-pulse flex space-x-4">
                                <div className="flex-1 space-y-4 py-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    </div>
                                </div>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 text-lg mb-4 font-medium">Belum ada survei yang Anda ikuti.</p>
                                <Link to="/survei" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm">
                                    Ikuti Survei Sekarang
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {history.map((item) => (
                                    <div key={item.id} className="border border-gray-100 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="h-40 overflow-hidden bg-gray-200">
                                            <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-4 bg-white">
                                            <h3 className="font-bold text-lg text-gray-800 mb-2 truncate">{item.title}</h3>
                                            <p className="text-gray-500 text-sm line-clamp-2">{item.caption}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfilePage;
