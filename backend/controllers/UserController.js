class UserController {
  constructor(userService) {
    this.userService = userService;
    
    // Bind konteks 'this'
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getAll(req, res) {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getById(req, res) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ error: error.message || "Database error" });
    }
  }

  async create(req, res) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message || "Create failed" });
    }
  }

  async update(req, res) {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message || "Update failed" });
    }
  }

  async delete(req, res) {
    try {
      await this.userService.deleteUser(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message || "Delete failed" });
    }
  }
}

export default UserController;
