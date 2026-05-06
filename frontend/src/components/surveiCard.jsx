function SurveiCard({ label, onChange, question_id }) {
    return (
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white transition-all hover:border-blue-300 hover:shadow-md">
            <div className="mb-2">
                <label className="block text-gray-800 font-bold mb-6 text-lg leading-relaxed">
                    {label}
                </label>

                <div className="flex flex-row gap-4">
                    {[1,2,3,4,5].map((val) => (
                        <label key={val} className="flex items-center gap-2 text-center">
                            <input
                                type="radio"
                                name={question_id}
                                value={val}
                                onChange={(e) => 
                                    onChange(question_id, e.target.value)
                                }
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