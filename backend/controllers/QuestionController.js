class QuestionController {
  constructor(questionService) {
    this.questionService = questionService;
    
    // Bind context 'this'
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.getBySurveyId = this.getBySurveyId.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getAll(req, res) {
    try {
      const questions = await this.questionService.getAllQuestions();
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getById(req, res) {
    try {
      const question = await this.questionService.getQuestionById(req.params.id);
      res.json(question);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message || "Database error" });
    }
  }

  async getBySurveyId(req, res) {
    try {
      const questions = await this.questionService.getQuestionsBySurveyId(req.params.surveyId);
      res.json(questions);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message || "Database error" });
    }
  }

  async create(req, res) {
    try {
      const question = await this.questionService.createQuestion(req.body);
      res.status(201).json(question);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message || "Create failed" });
    }
  }

  async update(req, res) {
    try {
      const question = await this.questionService.updateQuestion(req.params.id, req.body);
      res.json(question);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message || "Update failed" });
    }
  }

  async delete(req, res) {
    try {
      await this.questionService.deleteQuestion(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message || "Delete failed" });
    }
  }
}

export default QuestionController;
