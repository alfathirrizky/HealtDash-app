import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom"
import useSurvey from "../hooks/useSurvey"
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";

registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageEdit,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
);

export default function CreateSurveyPage() {
    const { form, handleChange, handleCreate, setForm } = useSurvey()
    const navigate = useNavigate()
    const submit = async () => {
        await handleCreate()
        navigate("/surveiDash")
    }
    return(
    <div className="">
        <div className=" gap-5 scrollbar-none scroll-smooth overflow-y-auto h-[95vh]">
            <h1 className=" font-bold text-4xl">Form Create Survey</h1>
            <div className=" flex justify-between items-center">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/surveiDash">Survey</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Create Survey</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Link to="/surveiDash">
                    <button className=" bg-red-600 text-white font-medium py-1 px-5 rounded-lg cursor-pointer">Batal</button>
                </Link>
            </div>
            <div className="bg-white w-full">
                    <div className="flex flex-col gap-3 py-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="font-semibold mb-2">Image</h1>
                            <FilePond
                            name="file"
                            allowMultiple={false}
                            acceptedFileTypes={["image/jpeg", "image/png"]}
                            labelFileTypeNotAllowed="Hanya JPG dan PNG"
                            fileValidateTypeLabelExpectedTypes="Hanya JPG / PNG"
                            server={{
                                process: {
                                url: "http://localhost:5000/api/surveys/upload",
                                method: "POST",
                                onload: (filename) => {
                                    setForm(prev => ({ ...prev, image: filename }));
                                    return filename;
                                },
                                onerror: (err) => {
                                    console.error("UPLOAD ERROR:", err);
                                    return err;
                                },
                                },
                            }}

                            labelIdle='Drag & Drop atau <span class="filepond--label-action">Pilih Gambar</span>'
                            imagePreviewHeight={180}
                            allowImagePreview
                            allowImageEdit
                            credits={false}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-semibold">Title</h1>
                            <Input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border border-gray-400"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-semibold">Caption</h1>
                            <Input type="text" name="caption" placeholder="Caption" value={form.caption} onChange={handleChange} className="border border-gray-400"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-semibold">Description</h1>
                            <Input type="textarea" name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border border-gray-400"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-semibold">Total Question</h1>
                            <Input type="textarea" name="total_question" placeholder="Total Question" value={form.total_question} onChange={handleChange} className="border border-gray-400"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-semibold">Status</h1>
                            <Select
                                value={String(form.is_active)} onValueChange={(value) =>setForm({ ...form, is_active: value })}>
                                <SelectTrigger className="bg-white w-full">
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="1" className="bg-white">Aktif</SelectItem>
                                    <SelectItem value="0" className="bg-white">Nonaktif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={submit}>
                    Create
                    </Button>
            </div>
        </div>
    </div>
    )
}