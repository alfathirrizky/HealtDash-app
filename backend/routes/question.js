import express from "express";

import Question from "../models/Question.js";
import QuestionService from "../services/QuestionService.js";
import QuestionController from "../controllers/QuestionController.js";

const router = express.Router();

// OOP Instantiation
const questionModel = new Question();
const questionService = new QuestionService(questionModel);
const questionController = new QuestionController(questionService);

// Routes
router.get("/", questionController.getAll);
router.get("/:id", questionController.getById);
router.get("/survey/:surveyId", questionController.getBySurveyId);
router.post("/", questionController.create);
router.put("/:id", questionController.update);
router.delete("/:id", questionController.delete);

export default router;
