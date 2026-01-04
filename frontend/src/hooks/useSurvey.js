import { useEffect, useState } from "react";
import API from "@/api/api";
import { toast } from "sonner";

const initialForm = {
    title: "",
    caption: "",
    description: "",
    image: "",
    is_active: "1",
    newImage: null,
};

function useSurvey() {
    const [surveys, setSurveys] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(initialForm);

    const resetForm = () => {
        setForm(initialForm);
        setEditing(false);
        setOpen(false);
    };

    const fetchSurveys = async () => {
        try {
            const res = await API.get("/surveys");
            setSurveys(res.data);
        } catch (error) {
            console.error("Fetch Survey Error:", error);
        }
    };

    useEffect(() => {
        fetchSurveys();
    }, []);

    const openEditForm = (data) => {
        setForm({
        ...data,
        newImage: null,
        });
        setEditing(true);
        setOpen(true);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreate = async () => {
        try {
        await API.post("/surveys", {
            image: form.image,
            title: form.title,
            caption: form.caption,
            description: form.description,
            is_active: form.is_active ?? 1,
        });

        toast.success("Survey berhasil dibuat");
        fetchSurveys();
        resetForm();
        } catch (error) {
        console.error("Create Survey Error:", error);
        toast.error("Gagal membuat survey");
        }
    };

    const handleUpdate = async () => {
        try {
        const payload = {
            title: form.title,
            caption: form.caption,
            description: form.description,
            is_active: form.is_active ?? 1,
        };

        if (form.newImage) {
            payload.image = form.newImage;
        }

        await API.put(`/surveys/${form.id}`, payload);

        toast.success("Survey berhasil diperbarui");
        fetchSurveys();
        resetForm();
        } catch (error) {
        console.error("Update Survey Error:", error);
        toast.error("Gagal memperbarui survey");
        }
    };

    const handleDelete = async (id) => {
        try {
        await API.delete(`/surveys/${id}`);
        toast.success("Survey berhasil dihapus");
        fetchSurveys();
        } catch (error) {
        console.error("Delete Survey Error:", error);
        toast.error("Gagal menghapus survey");
        }
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