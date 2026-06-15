import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const uploadDir = path.resolve("uploads");

class GalleryService {
  constructor(galleryModel) {
    this.galleryModel = galleryModel;
  }

  async getAllEducations() {
    return await this.galleryModel.findAll();
  }

  async getEducationById(id) {
    const rows = await this.galleryModel.findById(id);
    if (!rows.length) {
      const error = new Error("Data not found");
      error.statusCode = 404;
      throw error;
    }
    return rows[0];
  }

  async createEducation(educationData) {
    const { user_id, caption, description, image } = educationData;
    if (!image) {
      const error = new Error("Image required");
      error.statusCode = 400;
      throw error;
    }
    
    const id = uuidv4();
    await this.galleryModel.create({ id, user_id, image, caption, description });

    const rows = await this.galleryModel.findById(id);
    return rows[0];
  }

  async updateEducation(id, educationData) {
    const { caption, description, image } = educationData;
    const rows = await this.galleryModel.findById(id);
    if (!rows.length) {
      const error = new Error("Data not found");
      error.statusCode = 404;
      throw error;
    }
    
    let filename = rows[0].image;
    // ganti image hanya jika dikirim
    if (image) {
      const oldPath = path.join(uploadDir, filename);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      filename = image;
    }

    await this.galleryModel.update(id, { image: filename, caption, description });

    const updatedRows = await this.galleryModel.findById(id);
    return updatedRows[0];
  }

  async deleteEducation(id) {
    const rows = await this.galleryModel.findById(id);
    if (!rows.length) {
      const error = new Error("Data not found");
      error.statusCode = 404;
      throw error;
    }
    
    const filePath = path.join(uploadDir, rows[0].image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    
    await this.galleryModel.delete(id);
  }
}

export default GalleryService;
