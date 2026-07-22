class AnswerController {
  constructor(answerService) {
    this.answerService = answerService;
  }

  getAllAnswers = async (req, res) => {
    try {
      const answers = await this.answerService.getAllAnswers();
      res.json(answers);
    } catch (error) {
      console.error("❌ Error fetching answers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  getSurveyResults = async (req, res) => {
    try {
      const results = await this.answerService.getSurveyResults();
      res.json(results);
    } catch (error) {
      console.error("❌ Error fetching survey results:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  getDetailedAnswers = async (req, res) => {
    try {
      const detailed = await this.answerService.getDetailedAnswers();
      res.json(detailed);
    } catch (error) {
      console.error("❌ Error fetching detailed answers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  getHistory = async (req, res) => {
    try {
      const { user_id } = req.params;
      const history = await this.answerService.getHistoryByUserId(user_id);
      res.json(history);
    } catch (error) {
      console.error("❌ Error fetching survey history:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  submitAnswers = async (req, res) => {
    try {
      const { survey_id, answers } = req.body;
      const user_id = req.user.id;
      
      const result = await this.answerService.submitAnswers(survey_id, answers, user_id);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      if (error.message === "Invalid data") {
        res.status(400).json({ message: "Invalid data" });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  };
}

export default AnswerController;
