import useSurvey from '@/hooks/useSurvey';
import { useNavigate } from 'react-router-dom';

export default function SurveiPage() {
    const {surveys} = useSurvey();
    const navigate = useNavigate();
    return (
        <div className="mt-13 md:mt-25 p-5 grid grid-cols-1 md:grid-cols-2 gap-10 place-items-center">
            {surveys.map((survey)=>(
                <div key={survey.id} className="w-sm bg-white flex flex-col justify-center h-70 lg:w-4xl p-5 rounded-2xl shadow-sm border-4 border-white gap-3">
                    <img style={{backgroundImage: `url(http://localhost:5000/uploads/${survey.image})`,}} alt="" className='rounded-xl h-40 md:h-60 bg-cover bg-center' />
                    <div className='flex justify-between items-center'>
                        <div className="text-black">
                            <h1 className="text-md md:text-2xl font-bold">{survey.title}</h1>
                            <p className="text-sm">{survey.caption}</p>
                        </div>
                        <button className="bg-blue-500 text-white px-5 py-2 rounded-2xl font-semibold cursor-pointer text-xs" onClick={() => navigate(`/survei/${survey.id}`)}>Start Survey</button>
                    </div>
                </div>
            ))}
        </div>
    );
}