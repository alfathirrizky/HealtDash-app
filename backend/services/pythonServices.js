import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { PYTHON_API_URL } from "../config/index.js";

export const sendFileToPython = async (filePath) => {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const response = await axios.post(
        `${PYTHON_API_URL}/upload-excel/`,
        formData,
        {
        headers: formData.getHeaders(),
        }
    );

    // Hapus file setelah dikirim ke Python
    fs.unlinkSync(filePath);

    return response.data;
};
