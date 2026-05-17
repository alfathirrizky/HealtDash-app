import { v4 as uuidv4 } from "uuid";

class SuggestionService {
  /**
   * @param {Object} suggestionModel - Injected SuggestionModel instance
   */
  constructor(suggestionModel) {
    this.suggestionModel = suggestionModel;
  }

  /**
   * Mendapatkan semua saran
   * @returns {Promise<Array>}
   */
  async getAllSuggestions() {
    return await this.suggestionModel.findAll();
  }

  /**
   * Mendapatkan saran berdasarkan ID dengan penanganan error
   * @param {string} id 
   * @returns {Promise<Object>}
   */
  async getSuggestionById(id) {
    const suggestion = await this.suggestionModel.findById(id);
    if (!suggestion) {
      const error = new Error("Suggestion not found");
      error.statusCode = 404;
      throw error;
    }
    return suggestion;
  }

  /**
   * Membuat saran baru
   * @param {string} userId 
   * @param {string} pesan 
   * @returns {Promise<Object>}
   */
  async createSuggestion(userId, pesan) {
    if (!pesan) {
      const error = new Error("Pesan is required");
      error.statusCode = 400;
      throw error;
    }

    const data = {
      id: uuidv4(),
      user_id: userId,
      pesan,
    };

    return await this.suggestionModel.create(data);
  }

  /**
   * Menghapus saran berdasarkan ID
   * @param {string} id 
   * @returns {Promise<boolean>}
   */
  async deleteSuggestion(id) {
    // Memastikan data ada sebelum dihapus
    await this.getSuggestionById(id);
    
    await this.suggestionModel.delete(id);
    return true;
  }
}

export default SuggestionService;
