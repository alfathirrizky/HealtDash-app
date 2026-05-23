import SurveiCard from "../components/surveiCard";
import useQuestions from "../hooks/useQuestions";
import { useParams, useNavigate } from "react-router-dom";
import Load from "../components/load";
import { useState } from "react";
import API from "../api/api";
import { toast } from "sonner";

export default function SurveiContentPage() {
    const { id } = useParams();
    const { questions } = useQuestions();
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();

    const filteredQuestions = Array.isArray(questions) ? questions.filter((q) => String(q.survey_id) === String(id)) : [];

    const handleChange = (question_id, answer) => {
        setAnswers(prev => ({
            ...prev,
            [question_id]: answer
        }));
    };

    const handleSubmit = async () => {
        try {
            const formattedAnswers = Object.keys(answers).map((key) => ({
                question_id: key,
                answer: answers[key],
            }));

            if (formattedAnswers.length === 0) {
                toast.error("Silakan isi setidaknya satu pertanyaan sebelum mengirim survei.");
                return;
            }

            await API.post("/answers/submit", {
                survey_id: id,
                answers: formattedAnswers,
            });

            toast.success("Survei berhasil disubmit!");
            navigate("/profile");
        } catch (error) {
            console.error(error);
            toast.error("Gagal mengirim survei.");
        }
    };

    return (
        <div className="mt-23 p-5 flex flex-col gap-5 h-full">
            <div className="p-5 rounded-2xl shadow-md flex flex-col gap-2">
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question) => (
                        <SurveiCard key={question.question_id} name={question.name} label={question.label} onChange={handleChange} question_id={question.question_id} />
                    ))) : (
                    <div className="flex flex-col items-center justify-center py-20 gap-6">
                        <Load className="w-30 h-30 " />
                        <p className="text-blue-500 font-medium text-lg">No Questions Found</p>
                    </div>
                )}
                <button className="self-center mt-4 w-full px-10 py-2 bg-blue-600 text-white rounded-3xl shadow-md hover:bg-blue-700 text-xl font-semibold" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
}
