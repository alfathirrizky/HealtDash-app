import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const uploadDir = path.resolve("uploads");

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async getAllUsers() {
    return await this.userModel.findAll();
  }

  async getUserById(id) {
    const rows = await this.userModel.findById(id);
    if (!rows.length) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return rows[0];
  }

  async createUser(userData) {
    const { image, telepon, name, email, position, gender, password, role } = userData;
    if (!image) {
      const error = new Error("Image required");
      error.statusCode = 400;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    
    await this.userModel.create({
      id, image, telepon, name, email, position, gender, hashedPassword, role
    });

    const rows = await this.userModel.findById(id);
    return rows[0];
  }

  async updateUser(id, userData) {
    const { image, telepon, name, email, position, gender, password, role } = userData;
    const rows = await this.userModel.findById(id);
    if (!rows.length) {
      const error = new Error("Data users not found");
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

    let finalPassword = rows[0].password;
    if (password && password !== "") {
      finalPassword = await bcrypt.hash(password, 10);
    }

    await this.userModel.update(id, {
      image: filename, telepon, name, email, position, gender, finalPassword, role
    });

    const updatedRows = await this.userModel.findById(id);
    return updatedRows[0];
  }

  async deleteUser(id) {
    const rows = await this.userModel.findById(id);
    if (!rows.length) {
      const error = new Error("Data users not found");
      error.statusCode = 404;
      throw error;
    }
    
    const filePath = path.join(uploadDir, rows[0].image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    
    await this.userModel.delete(id);
  }
}

export default UserService;
