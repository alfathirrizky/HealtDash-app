import API from "@/api/api";
import { useState } from "react";

export default function useSuggestions() {
    const [suggestions, setSuggestions] = useState([]);
    const fetchSuggestions = async()=>{
        try {
            const res = await API.get("/suggestions");
            setSuggestions(res.data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    }
    return {
        suggestions,
        fetchSuggestions
    };
}