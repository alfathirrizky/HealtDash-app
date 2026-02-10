import { useState, useEffect } from "react";
import API from "../api/api";
import { toast } from "sonner";

// FilePond
import { registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import "filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css";

// Register FilePond plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginImageEdit);


export default function useUser() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [files, setFiles] = useState([]);
  const resetForm = () => {
    setForm(initialForm);
    setEditing(false);
    setOpen(false);
  };
  const initialForm = {
    image: "",
    newImage: null,
    telepon: "",
    name: "",
    email: "",
    position: "",
    gender: "",
    password: "",
    role: "",
  };
  const [form, setForm] = useState(initialForm);

  const fetchUser = async () => {
    try {
      const res = await API.get("/users");
      console.log("API RESPONSE:", res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE
  const handleCreate = async () => {
    toast.success("User berhasil dibuat");
    await API.post("/users", {
      image: form.image,
      telepon: form.telepon,
      name: form.name,
      email: form.email,
      position: form.position,
      gender: form.gender,
      password: form.password,
      role: form.role,
    });
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      const payload = {
        telepon: form.telepon,
        name: form.name,
        email: form.email,
        position: form.position,
        gender: form.gender,
        password: form.password,
        role: form.role,
      };
      if (form.newImage) {
        payload.image = form.newImage;
      }
      await API.put(`/users/${form.id}`, payload);
      toast.success("User berhasil diperbarui ✅");
      fetchUser();
      resetForm();
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Gagal memperbarui user");
    }
  };

  const handleDelete = async (id) => {
    await API.delete(`/users/${id}`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.error("User berhasil dihapus.");
  };

  const openEditForm = (user) => {
    setEditing(user);
    setForm({
      image: user.image,
      telepon: user.telepon,
      name: user.name,
      email: user.email,
      position: user.position,
      gender: user.gender,
      password: "",
      role: user.role,
    });
    if (user.image) {
      setFiles([
        {
          source: user.image,
          options: { type: "local" },
        },
      ]);
    }
    setOpen(true);
  };

  const openCreateForm = () => {
    setEditing(null);
    resetForm();
    setOpen(true);
  };

  return {
    users,
    open,
    editing,
    form,
    setForm,
    files,
    setFiles,
    openEditForm,
    openCreateForm,
    handleChange,
    handleCreate,
    handleUpdate,
    handleDelete,
    setOpen,
  };
}