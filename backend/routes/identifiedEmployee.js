import express from "express";
import { 
    getIdentifiedEmployees, 
    deleteIdentifiedEmployee,
    getStressFactors,
    getStressFactorsBySurvey
} from "../controllers/identifiedEmployeeController.js";

const router = express.Router();

router.get("/", getIdentifiedEmployees);
router.delete("/:id", deleteIdentifiedEmployee);
router.get("/stress-factors", getStressFactors);
router.get("/stress-factors-by-survey", getStressFactorsBySurvey);

export default router;
