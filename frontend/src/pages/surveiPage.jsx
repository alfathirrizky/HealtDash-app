import useSurvey from '@/hooks/useSurvey';
import foto from '../assets/image2.jpg';

export default function SurveiPage() {
    const surveys = useSurvey();
    return (
        <div className="h-auto mt-24 p-5 flex flex-wrap gap-5 justify-center">
            {surveys.map((survey)=>(
                <div key={survey.id} className="bg-white flex flex-col justify-center h-70 w-2xl p-5 rounded-2xl shadow-lg border-4 border-white gap-2">
                    <img src={foto} alt="" className='rounded-xl h-40 object-cover' />
                    <div className='flex justify-between items-center'>
                        <div className="text-black">
                            <h1 className="text-2xl font-bold">{survey.title}</h1>
                            <p className="">{survey.caption}</p>
                        </div>
                        <button className="bg-blue-500 text-white px-5 py-2 rounded-2xl font-semibold">View Details</button>
                    </div>
                </div>
            ))}
        </div>
    );
}