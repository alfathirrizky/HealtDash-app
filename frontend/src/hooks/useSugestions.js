import API from "@/api/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function useSuggestions() {
    const initialForm = {
        user_id: "",
        pesan: "",
    };
    const [ form ] = useState(initialForm);
    const [suggestions, setSuggestions] = useState([]);
    const fetchSuggestions = async()=>{
        try {
            const res = await API.get("/suggestions");
            setSuggestions(res.data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    }
    useEffect(()=>{
        fetchSuggestions();
    }, []);

    const handleCreate = async () => {
        try {
        await API.post("/surveys", {
            image: form.image,
            title: form.title,
            caption: form.caption,
            description: form.description,
            is_active: form.is_active ?? 1,
        });

        toast.success("Suggestion berhasil dibuat");
        fetchSuggestions();
        } catch (error) {
        console.error("Create Suggestion Error:", error);
        toast.error("Gagal membuat suggestion");
        }
    };
    return {
        suggestions,
        fetchSuggestions,
        handleCreate,
    };
}