import useSurvey from '@/hooks/useSurvey';

export default function SurveiPage() {
    const {surveys} = useSurvey();
    return (
        <div className="mt-13 md:mt-20 p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            {surveys.map((survey)=>(
                <div key={survey.id} className="bg-white flex flex-col justify-center h-70 lg:w-2xl p-5 rounded-2xl shadow-sm border-4 border-white gap-2">
                    <img style={{backgroundImage: `url(http://localhost:5000/uploads/${survey.image})`,}} alt="" className='rounded-xl h-40 md:h-60 bg-cover bg-center' />
                    <div className='flex justify-between items-center'>
                        <div className="text-black">
                            <h1 className="text-lg md:text-2xl font-bold">{survey.title}</h1>
                            <p className="text-sm">{survey.caption}</p>
                        </div>
                        <button className="bg-blue-500 text-white px-5 py-2 rounded-2xl font-semibold cursor-pointer text-xs">Start Survey</button>
                    </div>
                </div>
            ))}
        </div>
    );
}