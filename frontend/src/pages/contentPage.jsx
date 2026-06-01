import useGallery from "@/hooks/useGallery";
import { useNavigate } from "react-router-dom";

function ContentPage() {
    const { contents = [] } = useGallery();
    const Navigate = useNavigate();

    return (
        <div className="mt-24 p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 w-full">
            {contents.map((content) => (
                <div
                    key={content.id}
                    className="relative flex w-full h-[320px] rounded-3xl shadow-md bg-cover bg-center overflow-hidden border-4 border-white"
                    style={{
                        backgroundImage: `url(http://localhost:5000/uploads/${content.image})`,
                    }}
                >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    
                    {/* Content Layer */}
                    <div className="relative z-10 p-8 flex justify-between items-end w-full">
                        <div className="text-white">
                            <h1 className="text-3xl font-bold mb-1 tracking-wide">{content.caption}</h1>
                            <p className="text-md text-gray-200">{content.description}</p>
                        </div>
                        <button 
                            className="bg-[#3b82f6] hover:bg-blue-600 transition-colors text-white px-8 py-2 rounded-full font-semibold cursor-pointer text-sm shadow-md whitespace-nowrap ml-4" 
                            onClick={() => Navigate(`/content/${content.id}`)}
                        >
                            See Detail
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ContentPage;
