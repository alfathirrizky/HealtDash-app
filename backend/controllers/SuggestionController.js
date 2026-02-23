import SuggestionService from "../services/SuggestionService.js";

class SuggestionController {
    static async getAll(req, res) {
        try {
        const data = await SuggestionService.getAllSuggestions();
        res.json(data);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async submit(req, res) {
        try {
        const { survey_id, answers } = req.body;
        const user_id = req.user.id;

        await SuggestionService.submitSuggestion(survey_id, user_id, answers);

        res.status(200).json({ message: "Survey submitted successfully" });
        } catch (error) {
        res.status(400).json({ message: error.message });
        }
    }
}

export default SuggestionController;
