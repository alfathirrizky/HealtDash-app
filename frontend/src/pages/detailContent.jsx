import useContent from "@/hooks/useGallery";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function DetailContent() {
    const { contents } = useContent();
    const { id } = useParams();
    const navigate = useNavigate();

    // Loading State
    if (!contents || contents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen pt-20 bg-slate-50">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-medium">Memuat Edukasi...</p>
            </div>
        );
    }

    const content = contents.find((c) => String(c.id) === String(id));

    // Not Found State
    if (!content) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen pt-20 bg-slate-50">
                <p className="text-5xl mb-4">😕</p>
                <p className="text-slate-600 font-semibold text-lg">Konten edukasi tidak ditemukan.</p>
                <button 
                    onClick={() => navigate(-1)} 
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                    Kembali
                </button>
            </div>
        );
    }

    return (
        <div className="pt-24 md:pt-32 pb-16 px-5 md:px-8 max-w-4xl mx-auto min-h-screen">
            {/* Tombol Kembali */}
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold mb-8 transition-colors group w-fit"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1.5 transition-transform" />
                <span>Kembali</span>
            </button>

            {/* Container Utama */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                {/* Gambar Hero */}
                <div className="w-full h-56 sm:h-72 md:h-96 bg-slate-100 relative group">
                    <img 
                        src={`http://localhost:5000/uploads/${content.image}`} 
                        alt={content.caption} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/800x400?text=Gambar+Tidak+Tersedia';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Konten Artikel */}
                <div className="p-6 sm:p-10 md:p-14">
                    <h1 className="font-extrabold text-2xl md:text-3xl lg:text-4xl text-slate-800 mb-6 leading-tight">
                        {content.caption}
                    </h1>
                    
                    {/* Garis Aksen */}
                    <div className="w-16 h-1.5 bg-blue-600 rounded-full mb-8"></div>

                    {/* Teks Deskripsi */}
                    <div className="text-slate-600 leading-relaxed text-base md:text-lg whitespace-pre-wrap text-justify">
                        {content.description}
                    </div>
                </div>
            </div>
        </div>
    );
}
