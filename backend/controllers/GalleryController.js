class GalleryController {
  constructor(galleryService) {
    this.galleryService = galleryService;
    
    // Bind konteks 'this'
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getAll(req, res) {
    try {
      const albums = await this.galleryService.getAllAlbums();
      res.json(albums);
    } catch (error) {
      console.error("Error fetching albums:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getById(req, res) {
    try {
      const album = await this.galleryService.getAlbumById(req.params.id);
      res.json(album);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message || "Database error" });
    }
  }

  async create(req, res) {
    try {
      const album = await this.galleryService.createAlbum(req.body);
      res.status(201).json(album);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message || "Create failed" });
    }
  }

  async update(req, res) {
    try {
      const album = await this.galleryService.updateAlbum(req.params.id, req.body);
      res.json(album);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message || "Update failed" });
    }
  }

  async delete(req, res) {
    try {
      await this.galleryService.deleteAlbum(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message || "Delete failed" });
    }
  }
}

export default GalleryController;
