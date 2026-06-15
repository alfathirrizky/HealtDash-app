import { v4 as uuidv4 } from "uuid";

class QuestionService {
  constructor(questionModel) {
    this.questionModel = questionModel;
  }

  async getAllQuestions() {
    return await this.questionModel.findAll();
  }

  async getQuestionById(id) {
    const rows = await this.questionModel.findById(id);
    if (!rows.length) {
      const error = new Error("Data not found");
      error.statusCode = 404;
      throw error;
    }
    return rows[0];
  }

  async getQuestionsBySurveyId(surveyId) {
    return await this.questionModel.findBySurveyId(surveyId);
  }

  async createQuestion(questionData) {
    const { survey_id, question } = questionData;
    
    const id = uuidv4();
    await this.questionModel.create({ id, survey_id, question });

    const rows = await this.questionModel.findById(id);
    return rows[0];
  }

  async updateQuestion(id, questionData) {
    const { survey_id, question } = questionData;
    const rows = await this.questionModel.findById(id);
    if (!rows.length) {
      const error = new Error("Data not found");
      error.statusCode = 404;
      throw error;
    }
    
    await this.questionModel.update(id, { survey_id, question });

    const updatedRows = await this.questionModel.findById(id);
    return updatedRows[0];
  }

  async deleteQuestion(id) {
    const rows = await this.questionModel.findById(id);
    if (!rows.length) {
      const error = new Error("Data not found");
      error.statusCode = 404;
      throw error;
    }
    
    await this.questionModel.delete(id);
  }
}

export default QuestionService;
