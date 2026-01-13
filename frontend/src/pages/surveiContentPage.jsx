import SurveiCard from "../components/surveiCard";
import useQuestions from "../hooks/useQuestions";

export default function SurveiContentPage() {
    const questions = useQuestions();
    return (
        <div className=" mt-23 p-5 flex flex-col gap-5 h-full">
            <div className=" p-5 rounded-2xl shadow-md flex flex-col gap-2">
                {questions.map((question) => (
                    <SurveiCard key={question.id} name={question.name} label={question.label} />
                ))}
                <button className="self-center mt-4 w-full px-10 py-2 bg-blue-600 text-white rounded-3xl shadow-md hover:bg-blue-700 text-xl font-semibold">Submit</button>
            </div>
        </div>
    )
}