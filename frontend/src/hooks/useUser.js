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

  const [files, setFiles] = useState([]); // FilePond File State

  const [form, setForm] = useState({
    id: "",
    image: null,
    telepon: "",
    name: "",
    email: "",
    position: "",
    gender: "",
    password: "",
    role: "",
  });

  const fetchUser = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE
  const handleCreate = async () => {
    const data = { ...form, image: files[0]?.file || null };
    const res = await API.post("/users", data);
    setUsers((prev) => [res.data, ...prev]);
    toast.success("User berhasil dibuat");
    setOpen(false);
    resetForm();
  };

  // UPDATE
  const handleUpdate = async () => {
    const data = { ...form, image: files[0]?.file || form.image };

    const res = await API.put(`/users/${editing.id}`, data);
    setUsers((prev) => prev.map((u) => (u.id === editing.id ? res.data : u)));
    toast.success("User berhasil diupdate");

    setOpen(false);
    setEditing(null);
    resetForm();
  };

  const handleDelete = async (id) => {
    await API.delete(`/users/${id}`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.error("User berhasil dihapus.");
  };

  const openEditForm = (user) => {
    setEditing(user);
    setForm({
      id: user.id,
      image: user.image,
      telepon: user.telepon,
      name: user.name,
      email: user.email,
      position: user.position,
      gender: user.gender,
      password: user.password,
      role: user.role,
    });

    // Load existing image if exists
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

  const resetForm = () => {
    setForm({
      id: "",
      image: null,
      telepon: "",
      name: "",
      email: "",
      position: "",
      gender: "",
      password: "",
      role: "",
    });
    setFiles([]);
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