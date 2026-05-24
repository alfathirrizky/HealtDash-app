function SurveiCard({ label, note, type, onChange, question_id }) {
    const isScale10 = type === "stress_level" || type === "sleep_quality";
    const isWorkHours = type === "work_hours";

    return (
        <div className="p-6 sm:p-8 mb-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
            <div className="flex flex-col w-full">
                <h3 className="text-gray-800 font-semibold mb-2 text-lg md:text-xl leading-relaxed">
                    {label}
                </h3>
                {note && (
                    <p className="text-xs sm:text-sm text-slate-400 mb-5 font-medium italic">
                        {note}
                    </p>
                )}

                {isWorkHours ? (
                    <div className="w-full sm:w-1/2 md:w-1/3">
                        <input
                            type="number"
                            min="1"
                            max="24"
                            step="0.5"
                            placeholder="Masukkan jam kerja, misal: 8"
                            onChange={(e) => onChange(question_id, e.target.value)}
                            className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition-all text-gray-700 text-base font-bold shadow-inner"
                            required
                        />
                    </div>
                ) : isScale10 ? (
                    <div className="w-full lg:w-4/5">
                        <div className="flex justify-between text-xs font-semibold text-slate-400 mb-3 px-1">
                            <span>{type === "stress_level" ? "Sangat Rendah (1)" : "Sangat Buruk (1)"}</span>
                            <span>{type === "stress_level" ? "Sangat Tinggi (10)" : "Sangat Baik (10)"}</span>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                                <label
                                    key={val}
                                    className="relative flex items-center justify-center cursor-pointer group"
                                    title={`Pilih nilai ${val}`}
                                >
                                    <input
                                        type="radio"
                                        name={question_id}
                                        value={val}
                                        onChange={(e) => onChange(question_id, e.target.value)}
                                        className="peer sr-only"
                                        required
                                    />
                                    <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full border-2 border-slate-200 bg-slate-50 text-slate-500 font-bold text-sm sm:text-base transition-all duration-200 ease-in-out peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white peer-checked:shadow-md peer-checked:shadow-blue-500/30 peer-focus-visible:ring-4 peer-focus-visible:ring-blue-200 group-hover:border-blue-400 group-hover:bg-blue-50 group-active:scale-95">
                                        {val}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="w-full md:w-3/4 lg:w-1/2">
                        <div className="flex justify-between text-xs font-semibold text-slate-400 mb-3 px-1">
                            <span>Sangat Rendah (1)</span>
                            <span>Sangat Tinggi (5)</span>
                        </div>
                        <div className="flex flex-row justify-between sm:justify-start gap-2 sm:gap-6">
                            {[1, 2, 3, 4, 5].map((val) => (
                                <label
                                    key={val}
                                    className="relative flex items-center justify-center cursor-pointer group flex-1 sm:flex-none"
                                    title={`Pilih nilai ${val}`}
                                >
                                    <input
                                        type="radio"
                                        name={question_id}
                                        value={val}
                                        onChange={(e) => onChange(question_id, e.target.value)}
                                        className="peer sr-only"
                                        required
                                    />
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full border-2 border-slate-200 bg-slate-50 text-slate-500 font-bold text-lg transition-all duration-200 ease-in-out peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white peer-checked:shadow-md peer-checked:shadow-blue-500/30 peer-focus-visible:ring-4 peer-focus-visible:ring-blue-200 group-hover:border-blue-400 group-hover:bg-blue-50 group-active:scale-95">
                                        {val}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SurveiCard;
