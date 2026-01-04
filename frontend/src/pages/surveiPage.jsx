import useSurvey from '@/hooks/useSurvey';

export default function SurveiPage() {
    const {surveys} = useSurvey();
    return (
        <div className="h-auto mt-24 p-5 flex gap-5 justify-center">
            {surveys.map((survey)=>(
                <div key={survey.id} className="bg-white flex flex-col justify-center h-70 w-2xl p-5 rounded-2xl shadow-lg border-4 border-white gap-2">
                    <img style={{backgroundImage: `url(http://localhost:5000/uploads/${survey.image})`,}} alt="" className='rounded-xl h-40 object-cover' />
                    <div className='flex justify-between items-center'>
                        <div className="text-black">
                            <h1 className="text-2xl font-bold">{survey.title}</h1>
                            <p className="">{survey.caption}</p>
                        </div>
                        <button className="bg-blue-500 text-white px-5 py-2 rounded-2xl font-semibold cursor-pointer">Start Survey</button>
                    </div>
                </div>
            ))}
        </div>
    );
}