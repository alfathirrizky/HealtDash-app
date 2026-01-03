import { useEffect, useState } from "react";
import API from "@/api/api";
import { toast } from "sonner";

function useSurvey() {
    const [surveys, setSurveys] = useState([]);
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

    const fetchSurveys = async () => {
        try {
        const res = await API.get("/surveys");
        console.log("API RESPONSE:", res.data);
        setSurveys(res.data);
        } catch (err) {
        console.error(err);
        }
    };

    useEffect(() => {
        fetchSurveys();
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
        toast.success("Survey berhasil dibuat");
        await API.post("/surveys", {
            image: form.image,
            title: form.title,
            caption: form.caption,
            description: form.description,
        });
    };

    const handleUpdate = async () => {
        try {
        const payload = {
            title: form.title,
            caption: form.caption,
            description: form.description,
        };

        if (form.newImage) {
            payload.image = form.newImage;
        }

        await API.put(`/surveys/${form.id}`, payload);

        toast.success("Survey berhasil diperbarui");
        fetchSurveys();
        resetForm();
        } catch (err) {
        console.error(err);
        toast.error("Gagal memperbarui content");
        }
    };

    const handleDelete = async (id) => {
        toast.error("Survey berhasil dihapus.");
        await API.delete(`/surveys/${id}`);
        fetchSurveys();
    };

    return {
        surveys,
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

export default useSurvey;