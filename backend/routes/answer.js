import express from "express";
import verifyToken from "../middleware/auth.js";
import Answer from "../models/Answer.js";
import AnswerService from "../services/AnswerService.js";
import AnswerController from "../controllers/AnswerControllers.js";

const router = express.Router();

const answerModel = new Answer();
const answerService = new AnswerService(answerModel);
const answerController = new AnswerController(answerService);

router.get("/", answerController.getAllAnswers);
router.get("/survey-results", answerController.getSurveyResults);
router.get("/detailed-answers", answerController.getDetailedAnswers);
router.get("/history/:user_id", answerController.getHistory);
router.post("/submit", verifyToken, answerController.submitAnswers);

export default router;
