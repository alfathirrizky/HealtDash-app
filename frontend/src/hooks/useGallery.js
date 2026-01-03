import { useEffect, useState } from "react";
import API from "@/api/api";
import { toast } from "sonner";

function useContent() {
  const [contents, setContents] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const resetForm = () => {
    setForm(initialForm);
    setEditing(false);
    setOpen(false);
  };
  const initialForm = {
    caption: "",
    description: "",
    image: "",
    newImage: null,
  };
  const [form, setForm] = useState(initialForm);

  const fetchContent = async () => {
    try {
      const res = await API.get("/gallery");
      console.log("API RESPONSE:", res.data);
      setContents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const openEditForm = (data) => {
    setForm(data);
    setEditing(true);
    setOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    toast.success("User berhasil dibuat");
    await API.post("/gallery", {
      caption: form.caption,
      description: form.description,
      image: form.image, 
    });
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        caption: form.caption,
        description: form.description,
      };

      // ⬇️ hanya kirim jika user upload gambar baru
      if (form.newImage) {
        payload.image = form.newImage;
      }

      await API.put(`/gallery/${form.id}`, payload);

      toast.success("Content berhasil diperbarui ✅");
      fetchContent();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui content");
    }
  };

  const handleDelete = async (id) => {
    toast.error("User berhasil dihapus.");
    await API.delete(`/gallery/${id}`);
    fetchContent();
  };

  return {
    contents,
    open,
    editing,
    form,
    setForm,
    openEditForm,
    handleChange,
    handleCreate,
    handleUpdate,
    handleDelete,
    setOpen,
  };
}

export default useContent;