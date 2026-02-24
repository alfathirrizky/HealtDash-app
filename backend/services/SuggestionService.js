import { v4 as uuidv4 } from "uuid";
import Suggestion from "../models/Suggestion.js";

class SuggestionService {
    static async getAllSuggestions() {
        return await Suggestion.findAll();
    }

    static async getSuggestionById(id) {
        const suggestion = await Suggestion.findById(id);
        if (!suggestion) {
        throw new Error("Suggestion not found");
        }
        return suggestion;
    }

    static async createSuggestion(user_id, pesan) {
        if (!pesan) {
        throw new Error("Pesan is required");
        }

        const data = {
        sugestion_id: uuidv4(),
        user_id,
        pesan,
        };

        return await Suggestion.create(data);
    }

    static async deleteSuggestion(id) {
        const suggestion = await Suggestion.findById(id);
        if (!suggestion) {
        throw new Error("Suggestion not found");
        }

        await Suggestion.delete(id);
        return true;
    }
}

export default SuggestionService;
