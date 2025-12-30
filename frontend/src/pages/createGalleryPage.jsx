import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Link, useNavigate } from "react-router-dom"
import useGallery from "../hooks/useGallery"
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

export default function CreateGalleryPage() {
    const { form, handleChange, handleCreate, setForm } = useGallery()
    const navigate = useNavigate()
    const submit = async () => {
        await handleCreate()
        navigate("/galleryDash") // kembali ke halaman user setelah create
    }
    return(
    <div className="p-5 space-y-6">
        <div className=" gap-5 scrollbar-none scroll-smooth overflow-y-auto h-[91vh]">
            <h1 className=" font-bold text-4xl">Form Create Gallery</h1>
            <div className=" flex justify-between items-center">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/galleryDash">Gallery</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Create Gallery</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Link to="/galleryDash">
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
                                url: "http://localhost:5000/api/gallery/upload",
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
                            <h1 className="font-semibold">Caption</h1>
                            <Input name="caption" placeholder="Caption" value={form.caption} onChange={handleChange} className="border border-gray-400"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-semibold">Description</h1>
                            <Input type="textarea" name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border border-gray-400"/>
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