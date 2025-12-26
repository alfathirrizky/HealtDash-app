import useContent from "@/hooks/useContent";


function ContentPage() {
    const contents = useContent();
    return(
        <div className="h-auto mt-24 p-5 flex flex-wrap gap-5 justify-center">
            {contents.map((content) => (
                <div key={content.id} className="bg-[url('./assets/image2.jpg')] flex h-70 w-2xl items-end justify-between p-5 rounded-2xl shadow-2xl bg-cover bg-center border-4 border-white">
                    <div className="text-white">
                        <h1 className="text-2xl font-bold">{content.caption}</h1>
                        <p className="">{content.description}</p>
                    </div>
                    <button className="bg-blue-500 text-white px-5 py-2 rounded-2xl font-semibold">View Details</button>
                </div>
            ))}
        </div>
    );
}

export default ContentPage;