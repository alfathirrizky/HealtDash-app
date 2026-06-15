import { useEffect, useState } from "react";
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

export default function useQuestions() {
  const [questions, setQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    id:"",
    survey_id:"",
    question:""
  });

  // fetch questions
  const fetchQuestions = async () => {
    const res = await API.get("/questions");
    setQuestions(res.data);
  };
  useEffect(()=>{
    fetchQuestions();
  }, []);

  const handleChange = (e)=>{
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //reset form
  const resetForm = () => {
    setForm({
      id: "",
      survey_id: "",
      question: ""
    });
    setFiles([]);
    };

  //create question
  const handleCreate = async()=>{
    const data = { ...form };
    const res = await API.post("/questions", data);
    setQuestions((prev) => [res.data, ...prev]);
    toast.success("Question berhasil dibuat");
    setOpen(false);
    resetForm();
  };

  //update question
  const handleUpdate = async () => {
    const data = { ...form  };
    const res = await API.put(`/questions/${form.id}`, data);
    setQuestions((prev) => prev.map((q) => (q.id === form.id ? res.data : q)));
    toast.success("Question berhasil diupdate");
    setOpen(false);
    setEditing(null);
    resetForm();
  };
  //delete question
  const handleDelete = async (id) => {
    await API.delete(`/questions/${id}`);
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    toast.error("Question berhasil dihapus.");
  };

  const openEditForm = (question) => {
    setEditing(question);
    setForm({
      id: question.id,
      survey_id: question.survey_id,
      question: question.question
    });
    setOpen(true);
  };

  const openCreateForm = ()=>{
    setEditing(null);
    resetForm();
    setOpen(true);
  };

  return{
    questions,
    open,
    form,
    editing,
    setEditing,
    files,
    setFiles,
    setForm,
    setOpen,
    handleCreate,
    handleChange,
    handleUpdate,
    handleDelete,
    openEditForm,
    openCreateForm,
  }
}
