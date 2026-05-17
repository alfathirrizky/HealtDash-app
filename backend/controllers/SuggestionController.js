class SuggestionController {
  /**
   * @param {Object} suggestionService - Injected SuggestionService instance
   */
  constructor(suggestionService) {
    this.suggestionService = suggestionService;
    
    // Bind konteks 'this' agar metode dapat digunakan sebagai callback di Express Router
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  /**
   * Handler untuk mendapatkan semua saran
   */
  async getAll(req, res) {
    try {
      const data = await this.suggestionService.getAllSuggestions();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  /**
   * Handler untuk mendapatkan saran berdasarkan ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await this.suggestionService.getSuggestionById(id);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Handler untuk membuat saran baru
   */
  async create(req, res) {
    try {
      const userId = req.user.id;
      const { pesan } = req.body;

      const data = await this.suggestionService.createSuggestion(userId, pesan);
      res.status(201).json({
        success: true,
        message: "Suggestion created successfully",
        data,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Handler untuk menghapus saran
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.suggestionService.deleteSuggestion(id);
      res.status(200).json({
        success: true,
        message: "Suggestion deleted successfully",
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default SuggestionController;