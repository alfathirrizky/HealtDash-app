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
      const res = await API.get("/educations");
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
    try {
      const storedUser = sessionStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const user_id = user?.id || null;

      await API.post("/educations", {
        caption: form.caption,
        description: form.description,
        image: form.image, 
        user_id: user_id
      });
      toast.success("Gallery berhasil dibuat");
    } catch (err) {
      console.error(err);
      toast.error("Gagal membuat gallery");
      throw err; // throw error so the caller can know it failed
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        caption: form.caption,
        description: form.description,
      };
      if (form.newImage) {
        payload.image = form.newImage;
      }
      await API.put(`/educations/${form.id}`, payload);
      toast.success("Content berhasil diperbarui");
      fetchContent();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui content");
    }
  };

  const handleDelete = async (id) => {
    toast.success("Gallery berhasil dihapus.");
    await API.delete(`/educations/${id}`);
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
