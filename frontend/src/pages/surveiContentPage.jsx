import SurveiCard from "../components/surveiCard";
import useQuestions from "../hooks/useQuestions";
import { useParams, useNavigate } from "react-router-dom";
import Load from "../components/load";
import { useState, useEffect, useRef } from "react";
import API from "../api/api";
import { toast } from "sonner";

export default function SurveiContentPage() {
    const { id } = useParams();
    const { questions } = useQuestions();
    const [answers, setAnswers] = useState({});
    const [checking, setChecking] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const hasCheckedId = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (hasCheckedId.current === id) return;
        hasCheckedId.current = id;

        const checkHistory = async () => {
            const storedUser = sessionStorage.getItem("user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                try {
                    const res = await API.get(`/answers/history/${user.id}`);
                    const historyIds = res.data.map(s => String(s.id));
                    if (historyIds.includes(String(id))) {
                        toast.error("Anda sudah mengisi survei ini sebelumnya.", { id: "survey-history" });
                        navigate("/survei");
                        return;
                    }
                } catch (err) {
                    console.error("Error checking history", err);
                }
            }
            setChecking(false);
        };
        checkHistory();
    }, [id, navigate]);

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
                toast.error("Silakan isi setidaknya satu pertanyaan sebelum mengirim survei.", { id: "empty-survey" });
                return;
            }

            setIsSubmitting(true);

            await API.post("/answers/submit", {
                survey_id: id,
                answers: formattedAnswers,
            });

            toast.success("Survei berhasil disubmit!", { id: "survey-success" });
            navigate("/profile");
        } catch (error) {
            console.error(error);
            toast.error("Gagal mengirim survei.", { id: "survey-error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (checking) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-6">
                <Load className="w-30 h-30" />
                <p className="text-blue-500 font-medium text-lg">Memeriksa status survei...</p>
            </div>
        );
    }

    return (
        <div className="mt-23 p-5 flex flex-col gap-5 h-full">
            <div className="p-5 rounded-2xl shadow-md flex flex-col gap-2">
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question) => (
                        <SurveiCard
                            key={question.id}
                            question={question.question}
                            onChange={handleChange}
                            question_id={question.id}
                        />
                    ))) : (
                    <div className="flex flex-col items-center justify-center py-20 gap-6">
                        <Load className="w-30 h-30 " />
                        <p className="text-blue-500 font-medium text-lg">No Questions Found</p>
                    </div>
                )}
                <button
                    className={`self-center mt-4 w-full px-10 py-2 text-white rounded-3xl shadow-md text-xl font-semibold transition-all ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Mengirim..." : "Submit"}
                </button>
            </div>
        </div>
    );
}
