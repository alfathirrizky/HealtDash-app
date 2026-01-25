import useSurvey from "@/hooks/useSurvey";
import { useParams } from "react-router-dom";

export default function DetailSurvey() {
    const { surveys } = useSurvey();
    const { id } = useParams();

    if (!surveys || surveys.length === 0) {
        return <p className="p-5">Loading data...</p>;
    }

    const survey = surveys.find((s) => String(s.id) === String(id));

    if (!survey) {
        return <p className="p-5">Survey tidak ditemukan</p>;
    }

    return (
        <div className="p-5 overflow-y-auto h-[96vh] scrollbar-none">
            <h1 className="font-bold text-4xl mb-6">Survey Detail</h1>
            <div className="flex flex-col gap-4 p-6 bg-white rounded-2xl shadow-sm">
                <div>
                    <h2 className="font-semibold">ID</h2>
                    <p>{survey.id}</p>
                </div>
                <div>
                    <h2 className="font-semibold">Image</h2>
                    <img
                        src={`http://localhost:5000/uploads/${survey.image}`}
                        alt={survey.caption}
                        className="h-64 max-w-md rounded-xl mt-2"
                    />
                </div>
                <div>
                    <h2 className="font-semibold">Title</h2>
                    <p>{survey.title}</p>
                </div>
                <div>
                    <h2 className="font-semibold">Caption</h2>
                    <p>{survey.caption}</p>
                </div>
                <div>
                    <h2 className="font-semibold">Description</h2>
                    <p>{survey.description}</p>
                </div>
                <div>
                    <h2 className="font-semibold">Status</h2>
                    <p>{survey.is_active === 1 ? "Aktif" : "Nonaktif"}</p>
                </div>
            </div>
        </div>
    );
}