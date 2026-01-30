import useContent from "@/hooks/useGallery";
import { useParams } from "react-router-dom";

export default function DetailContent() {
    const { contents } = useContent();
    const { id } = useParams();

    if (!contents || contents.length ===0 ) {
        return <div className="p-5 overflow-y-auto h-[96vh] scrollbar-none">Loading...</div>;
    }

    const content = contents.find((c)=> String(c.id) === String(id));

    if (!content) {
        return <p className="p-5">Content tidak ditemukan</p>;
    }

    return (
        <div className="p-5 h-screen">
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-sm mt-30">
                <img src={`http://localhost:5000/uploads/${content.image}`} alt="" srcSet="" className="rounded-lg mb-4 md:h-70 w-xl"/>
                <div className="w-full px-10">
                    <h2 className="font-semibold text-xl mb-1 text-start">{content.caption}</h2>
                    <p className=" text-slate-600 text-sm">{content.description}</p>
                </div>
            </div>
        </div>
    );
}