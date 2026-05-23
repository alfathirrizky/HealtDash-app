import express from "express";
import multer from "multer";
import { 
    uploadExcel, 
    getIdentifiedEmployees, 
    deleteIdentifiedEmployee 
} from "../controllers/uploadControllers.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-excel", upload.single("file"), uploadExcel);
router.get("/identified-employees", getIdentifiedEmployees);
router.delete("/identified-employees/:id", deleteIdentifiedEmployee);

export default router;