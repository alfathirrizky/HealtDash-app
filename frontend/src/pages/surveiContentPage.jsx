import SurveiCard from "../components/surveiCard";
import useQuestions from "../hooks/useQuestions";
import { useParams } from "react-router-dom";
import Load from "../components/load"
import { useState } from "react";
import axios from "axios";

export default function SurveiContentPage() {
    const { id } = useParams();
    const { questions } = useQuestions();
    const [answers, setAnswers] = useState({});
    const filteredQuestions = Array.isArray(questions) ? questions.filter((q) => String(q.survey_id) === String(id)) : [];
    const handleChange = (question_id, answer) => {
        setAnswers(prev => ({
            ...prev,
            [question_id]: answer
        }));
    };

const handleSubmit = async () => {
    try {
        const token = localStorage.getItem("token");

        const formattedAnswers = Object.keys(answers).map((key) => ({
            question_id: key,
            answer: answers[key],
        }));

        await axios.post(
            "http://localhost:5000/api/answers/submit",
            {
                survey_id: id,
                answers: formattedAnswers,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        alert("Survey submitted successfully!");
    } catch (error) {
        console.error(error);
        alert("Failed to submit survey");
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
