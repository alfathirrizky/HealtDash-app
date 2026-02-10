import Profile from '../assets/image.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function DashboardPage() {
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

    return (
        <div className='p-2 w-full'>
            <div className=' flex items-center gap-5 mb-10 bg-white p-5 rounded-lg shadow-sm w-full'>
                <img src={`http://localhost:5000/uploads/${user.image}`} alt="Profile" className=' w-24 h-24 object-cover rounded-full'/>
                <div>
                    <h1 className=' font-bold text-3xl'>Welcome, {user.name}</h1>
                    <p>Here's what's happening with your health today.</p>
                </div>
            </div>   
        </div>
    );
}

export default DashboardPage;