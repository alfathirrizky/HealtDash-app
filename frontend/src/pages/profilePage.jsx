import Profile from "../assets/image.png";

function ProfilePage() {
    return(
        <div className="p-5 mt-20 rounded-lg shadow-xl">
            <div className=" bg-white shadow-md p-6 rounded-lg flex flex-col h-screen">
                <div className="profile flex flex-row gap-4 items-center border-b-2 pb-4 border-gray-200 mb-5">
                    <img src={Profile} alt="Profile" className="w-20 h-20 object-cover rounded-full" />
                    <div>
                        <h1 className="font-bold text-3xl">Raisa</h1>
                        <p className="text-gray-600 font-medium">Customer Service Manager</p>
                    </div>
                </div>
                <div className="PersonalInfo border-b-2 pb-4 border-gray-200">
                    <h1 className="font-bold text-2xl mb-5">Personal Detail</h1>
                    <div className="data grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold text-lg mb-1">First Name</p>
                            <p className="text-gray-800 border-1 border-gray-200 rounded-md p-2 text-lg">Raisa</p>
                        </div>
                        <div>
                            <p className="font-semibold text-lg mb-1">Last Name</p>
                            <p className="text-gray-800 border-1 border-gray-200 rounded-md p-2 text-lg">Andraini</p>
                        </div>
                        <div>
                            <p className="font-semibold text-lg mb-1">Phone Number</p>
                            <p className="text-gray-800 border-1 border-gray-200 rounded-md p-2 text-lg">08123456789</p>
                        </div>
                        <div>
                            <p className="font-semibold text-lg mb-1">Email</p>
                            <p className="text-gray-800 border-1 border-gray-200 rounded-md p-2 text-lg">Raisa@gmail.com</p>
                        </div>
                        <div>
                            <p className="font-semibold text-lg mb-1">Position</p>
                            <p className="text-gray-800 border-1 border-gray-200 rounded-md p-2 text-lg">Customer Service Manager</p>
                        </div>
                        <div>
                            <p className="font-semibold text-lg mb-1">Gender</p>
                            <p className="text-gray-800 border-1 border-gray-200 rounded-md p-2 text-lg">Male</p>
                        </div>
                            <div>
                                <p className="font-semibold text-lg mb-1">Gender</p>
                                <p className="text-gray-800 border-1 border-gray-200 rounded-md p-2 text-lg">Male</p>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;