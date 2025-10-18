import Profile from '../assets/image.png';

function DashboardPage() {
    return (
        <div className='p-2 w-full'>
            <div className=' flex items-center gap-5 mb-10 bg-white p-5 rounded-lg shadow-sm w-full'>
                <img src={Profile} alt="Profile" className=' w-24 h-24 object-cover rounded-3xl'/>
                <div>
                    <h1 className=' font-bold text-3xl'>Welcome, Raisa</h1>
                    <p>Here's what's happening with your health today.</p>
                </div>
            </div>   
        </div>
    );
}

export default DashboardPage;