function SurveiCard({ name, label }) {
    return (
        <div className="p-5 rounded-2xl shadow-md bg-white">
            <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-5 text-md">
                {label}
            </label>
            <div className="flex flex-row gap-4">
                {[1,2,3,4,5].map((val) => (
                <label key={val} className="flex items-center gap-2 text-center">
                    <input
                    type="radio"
                    name={name}
                    value={val}
                    className="text-blue-500 focus:ring-blue-400"
                    />
                    <span className="text-sm mt-1">{val}</span>
                </label>
                ))}
            </div>
            </div>
        </div>
    );
}
export default SurveiCard;