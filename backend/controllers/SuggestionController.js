import SuggestionService from "../services/SuggestionService.js";

class SuggestionController {
    static async getAll(req, res) {
        try {
        const data = await SuggestionService.getAllSuggestions();
        res.json(data);
        } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async getById(req, res) {
        try {
        const data = await SuggestionService.getSuggestionById(req.params.id);
        res.json(data);
        } catch (error) {
        res.status(404).json({ message: error.message });
        }
    }

    static async create(req, res) {
        try {
        const user_id = req.user.id;
        const { pesan } = req.body;

        const data = await SuggestionService.createSuggestion(user_id, pesan);

        res.status(201).json(data);
        } catch (error) {
        res.status(400).json({ message: error.message });
        }
    }

    static async delete(req, res) {
        try {
        await SuggestionService.deleteSuggestion(req.params.id);
        res.json({ message: "Suggestion deleted successfully" });
        } catch (error) {
        res.status(404).json({ message: error.message });
        }
    }
}

export default SuggestionController;