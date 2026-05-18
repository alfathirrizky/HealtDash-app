import useSurvey from '@/hooks/useSurvey';
import { useNavigate } from 'react-router-dom';

export default function SurveiPage() {
    const { surveys } = useSurvey();
    const navigate = useNavigate();

    return (
        <div className="pt-24 md:pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto min-h-screen overflow-y-auto scrollbar-none">
            {/* Grid Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {surveys.map((survey) => (
                    <div 
                        key={survey.id} 
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
                    >
                        {/* Image Section */}
                        <div className="h-48 md:h-56 w-full overflow-hidden relative bg-slate-100">
                            <img 
                                src={`http://localhost:5000/uploads/${survey.image}`} 
                                alt={survey.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                                }}
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80"></div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 flex flex-col flex-grow">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 line-clamp-2">
                                {survey.title}
                            </h2>
                            <p className="text-sm text-slate-500 mb-6 line-clamp-3 flex-grow leading-relaxed">
                                {survey.caption}
                            </p>
                            
                            <div className="mt-auto pt-2">
                                <button 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-95"
                                    onClick={() => navigate(`/survei/${survey.id}`)}
                                >
                                    Mulai Survey
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
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