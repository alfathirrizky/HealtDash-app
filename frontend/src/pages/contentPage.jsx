import useGallery from "@/hooks/useGallery";
import { useNavigate } from "react-router-dom";

function ContentPage() {
    const { contents = [] } = useGallery();
    const Navigate = useNavigate();

    return (
        <div className="mt-24 p-5 grid grid-cols-1 md:grid-cols-2 gap-5 place-items-center">
            {contents.map((content) => (
                <div
                key={content.id}
                style={{
                    backgroundImage: `url(http://localhost:5000/uploads/${content.image})`,
                }}
                className="flex w-sm h-70 lg:w-2xl items-end justify-between p-5 rounded-2xl shadow-md bg-cover bg-center border-4 border-white"
                >
                <div className="text-white drop-shadow-lg">
                    <h1 className="text-2xl font-bold">{content.caption}</h1>
                    <p>{content.description}</p>
                </div>
                <button className="bg-blue-500 text-white px-5 py-2 rounded-2xl font-semibold cursor-pointer" onClick={ () => Navigate(`/content/${content.id}`)}>
                    View Details
                </button>
                </div>
            ))}
        </div>
    );
}

export default ContentPage;
