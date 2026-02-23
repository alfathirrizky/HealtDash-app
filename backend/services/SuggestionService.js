import Suggestion from "../models/Suggestions.js";

class SuggestionService {
    static async getAllSuggestions() {
        return await Suggestion.getAll();
    }

    static async submitSuggestion(survey_id, user_id, answers) {
        if (!survey_id || !answers || !Array.isArray(answers)) {
            throw new Error("Invalid data");
        }

    const values = Suggestions.map((item) => [
        survey_id,
        item.question_id,
        user_id,
        item.answer,
    ]);

    return await Suggestion.bulkInsert(values);
    }
}

export default SuggestionService;
