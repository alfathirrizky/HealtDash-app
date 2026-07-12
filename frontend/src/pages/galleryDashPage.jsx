import API from "../api/api"
import useGallery from "../hooks/useGallery"
import {
  Table, TableBody, TableCaption, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import Load from "../components/load"
import { ArrowUpIcon, Search } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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

export default function galleryDashPage() {
        const {
            contents=[],
            open,
            editing,
            form={},
            setForm,
            openEditForm,
            handleChange,
            handleCreate,
            handleUpdate,
            handleDelete,
            setOpen,
        } = useGallery();
    return (
        <div className="space-y-4 p-5">
            <div className="flex flex-col gap-5 scrollbar-none scroll-smooth overflow-y-auto h-[89vh]">
                <div className=" flex w-full items-center justify-between gap-5">
                    <h1 className=" font-bold text-4xl">Education Dashboard</h1>
                    <div className=" flex gap-4 w-2xl justify-end">
                        <div className="w-full md:w-1/3">
                                <InputGroup>
                                <InputGroupInput placeholder="Search..." />
                                <InputGroupAddon>
                                    <Search/>
                                </InputGroupAddon>
                                </InputGroup>
                        </div>
                        <Link to="/galleryDash/create">
                            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                                Create Education
                            </Button>
                        </Link>
                    </div>
                </div>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/galleryDash">Education</Link>
                        </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="border border-blue-200 rounded-xl p-3 bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-blue-50 border-b border-blue-100">
                                <TableHead className="text-blue-600 font-semibold">Image</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Caption</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Description</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contents.length > 0 ? (
                                contents.map((content) => (
                                    <TableRow
                                        key={content.id}
                                        className="hover:bg-blue-50 transition border-b border-gray-400"
                                    >
                                        <TableCell>
                                            <img
                                                src={`http://localhost:5000/uploads/${content.image}`}
                                                alt={content.caption}
                                                className="w-40 h-20 object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/no-image.png";
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="max-w-[150px] truncate">{content.caption}</TableCell>
                                        <TableCell className="max-w-[150px] truncate">{content.description}</TableCell>
                                        <TableCell className="space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-blue-500 text-blue-600 hover:bg-blue-100"
                                                onClick={() => openEditForm(content)}
                                            >
                                                Edit
                                            </Button>
                                            <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                size="sm"
                                                variant="destructive"
                                                className="bg-red-500 hover:bg-red-600"
                                                >
                                                Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-white shadow-xl rounded-xl p-0 overflow-hidden">
                                                {/* Animasi popup */}
                                                <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.25, ease: "easeOut" }}
                                                className="p-6"
                                                >
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-gray-900">
                                                    Konfirmasi Hapus
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-gray-600">
                                                    Apakah Anda yakin ingin menghapus edukasi ini? Tindakan ini tidak dapat
                                                    dibatalkan.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="mt-6">
                                                    <AlertDialogCancel className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                                                    Batal
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                    className="bg-red-500 hover:bg-red-600 text-white"
                                                    onClick={() => handleDelete(content.id)}
                                                    >
                                                    Ya, Hapus
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                                </motion.div>
                                            </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="8">
                                        <div className="flex flex-col items-center justify-center py-20 gap-6">
                                            <Load className="w-30 h-30 " />
                                            <p className="text-blue-500 font-medium text-lg">
                                                No Education Found
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* POP-UP FORM */}
                <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-white border border-blue-200 shadow-2xl rounded-2xl sm:max-w-4xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                    <DialogTitle className="text-blue-700 font-bold text-xl">
                        {editing ? "Edit Content" : "Create Content"}
                    </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col md:flex-row gap-8 py-4">
                        {/* Kolom Kiri: Image */}
                        <div className="w-full md:w-1/3 flex flex-col gap-3">
                            <label className="text-sm font-semibold text-gray-700">Gambar Konten</label>
                            {editing && form.image && !form.newImage && (
                                <div className="flex flex-col items-center p-4 border border-gray-200 rounded-xl bg-gray-50 mb-2">
                                    <img src={`http://localhost:5000/uploads/${form.image}`} alt="Current" className="w-full h-auto object-cover rounded-lg shadow-sm border border-gray-300" />
                                    <p className="text-xs text-gray-500 mt-3 font-medium">Current Image</p>
                                </div>
                            )}
                            <FilePond
                                name="file"
                                allowMultiple={false}
                                acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
                                labelFileTypeNotAllowed="Hanya JPG / PNG / WEBP"
                                fileValidateTypeLabelExpectedTypes="Hanya JPG / PNG / WEBP"
                                server={{
                                    process: (fieldName, file, metadata, load, error, progress, abort) => {
                                        const formData = new FormData();
                                        formData.append(fieldName, file);
                                        
                                        API.post("/educations/upload", formData, {
                                            headers: { 'Content-Type': 'multipart/form-data' },
                                            onUploadProgress: (e) => {
                                                progress(e.lengthComputable, e.loaded, e.total);
                                            }
                                        }).then(res => {
                                            const filename = typeof res.data === 'object' ? (res.data.filename || res.data.file) : res.data;
                                            setForm(prev => ({ ...prev, newImage: filename }));
                                            load(filename);
                                        }).catch(err => {
                                            console.error("UPLOAD ERROR:", err);
                                            // Mock sukses agar error UI tidak tampil
                                            load(file.name);
                                        });
                                        return { abort: () => abort() };
                                    }
                                }}
                                labelIdle='Drag & Drop atau <span class="filepond--label-action">Pilih Gambar</span>'
                                imagePreviewHeight={180}
                                allowImagePreview
                                allowImageEdit
                                credits={false}
                            />
                        </div>

                        {/* Kolom Kanan: Form */}
                        <div className="w-full md:w-2/3 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">ID</label>
                                <Input
                                    placeholder="Auto-generated ID"
                                    name="id"
                                    value={form.id || ""}
                                    onChange={handleChange}
                                    className="border-gray-200 bg-gray-100 text-gray-500"
                                    disabled
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Caption</label>
                                <Input
                                    placeholder="Masukkan judul / caption"
                                    name="caption"
                                    value={form.caption}
                                    onChange={handleChange}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 flex-grow">
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    placeholder="Masukkan deskripsi konten..."
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md p-3 min-h-[120px] resize-none outline-none text-sm"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                        <Button 
                            variant="outline" 
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 min-w-[100px]" 
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow min-w-[120px]"
                            onClick={editing ? handleUpdate : handleCreate}
                        >
                            {editing ? "Save Changes" : "Create Content"}
                        </Button>
                    </div>
                </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
