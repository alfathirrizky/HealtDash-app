import { useEffect, useState } from "react";
import API from "@/api/api";

function useContent() {
  const [contents, setContents] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const initialForm = {
    caption: "",
    description: "",
    image: "",
  };
  const [form, setForm] = useState(initialForm);

  const fetchContent = async () => {
    try {
      const res = await API.get("/gallery");
      console.log("API RESPONSE:", res.data); // 🔥 cek di console
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
    await API.post("/gallery", {
      caption: form.caption,
      description: form.description,
      image: form.image, 
    });
  };


  const handleUpdate = async () => {
    await API.put(`/gallery/${form.id}`, form);
    fetchContent();
    setOpen(false);
  };

  const handleDelete = async (id) => {
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