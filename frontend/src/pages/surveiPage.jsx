import useSurvey from '@/hooks/useSurvey';
import { useNavigate } from 'react-router-dom';

export default function SurveiPage() {
    const { surveys } = useSurvey();
    const navigate = useNavigate();
    return (
        <div className="pt-24 md:pt-32 pb-16 px-6 md:px-12 w-full min-h-screen overflow-y-auto scrollbar-none bg-[#f8f9fa]">
            {/* Grid Cards Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1400px] mx-auto">
                {surveys.map((survey) => (
                    <div 
                        key={survey.id} 
                        className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 flex flex-col gap-4 hover:shadow-md transition-shadow"
                    >
                        {/* Image Section */}
                        <div className="w-full h-56 md:h-64 lg:h-72 overflow-hidden rounded-2xl relative">
                            <img 
                                src={`http://localhost:5000/uploads/${survey.image}`} 
                                alt={survey.title} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/600x300?text=No+Image'
                                }}
                            />
                        </div>

                        {/* Content Section */}
                        <div className="flex justify-between items-center px-2 pb-2 pt-1">
                            <div className="flex flex-col">
                                <h2 className="text-xl font-extrabold text-slate-800">
                                    {survey.title}
                                </h2>
                                <p className="text-sm text-slate-500 mt-1 line-clamp-1 font-medium">
                                    {survey.caption}
                                </p>
                            </div>
                            <button 
                                className="bg-[#4880FF] hover:bg-blue-600 text-white px-8 py-2.5 rounded-full text-sm font-bold transition-colors flex-shrink-0 ml-4 shadow-sm"
                                onClick={() => navigate(`/survei/${survey.id}`)}
                            >
                                Isi Survei
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {/* Empty State */}
            {surveys.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-lg font-medium">Belum ada survey yang tersedia saat ini.</p>
                </div>
            )}
        </div>
    );
}