import express from "express";
import SuggestionController from "../controllers/SuggestionController.js";
import SuggestionService from "../services/SuggestionService.js";
import SuggestionModel from "../models/Suggestions.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// 1. Instansiasi Model
const suggestionModel = new SuggestionModel();

// 2. Instansiasi Service (Dependency Injection dari Model)
const suggestionService = new SuggestionService(suggestionModel);

// 3. Instansiasi Controller (Dependency Injection dari Service)
const suggestionController = new SuggestionController(suggestionService);

// 4. Mendaftarkan Route
router.get("/", suggestionController.getAll);
router.get("/:id", suggestionController.getById);
router.post("/", verifyToken, suggestionController.create);
router.delete("/:id", suggestionController.delete);

export default router;