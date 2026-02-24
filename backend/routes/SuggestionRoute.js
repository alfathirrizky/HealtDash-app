import express from "express";
import SuggestionController from "../controllers/SuggestionController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/", SuggestionController.getAll);
router.get("/:id", SuggestionController.getById);
router.post("/", verifyToken, SuggestionController.create);
router.delete("/:id", SuggestionController.delete);

export default router;