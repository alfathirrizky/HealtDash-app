import {
  Table, TableBody, TableCaption, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "@/components/ui/dialog"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import UseSurvey from "@/hooks/useSurvey";

registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageEdit,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
);
export default function surveiDashPage() {
    const {
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
    } = UseSurvey();
    return(
        <div className="space-y-4 p-5">
            <div className="flex flex-col gap-5 scrollbar-none scroll-smooth overflow-y-auto h-[89vh]">
                <div className=" flex w-full items-center justify-between gap-5">
                    <h1 className=" font-bold text-4xl">Survei Dashboard</h1>
                    <div className=" flex gap-4 w-2xl justify-end">
                        <div className="w-full md:w-1/3">
                                <InputGroup>
                                <InputGroupInput placeholder="Search..." />
                                <InputGroupAddon>
                                    <Search/>
                                </InputGroupAddon>
                                </InputGroup>
                        </div>
                        <Link to="/surveiDash/create">
                            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                                Create Survey
                            </Button>
                        </Link>
                    </div>
                </div>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/galleryDash">Survey</Link>
                        </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="border border-blue-200 rounded-xl p-3 bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-blue-50 border-b border-blue-100">
                                <TableHead className="text-blue-600 font-semibold">ID</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Image</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Title</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Caption</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Description</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Question</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Question</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Status</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {surveys.length > 0 ? (
                                surveys.map((survey) => (
                                    <TableRow
                                        key={survey.id}
                                        className="hover:bg-blue-50 transition border-b border-gray-400"
                                    >
                                        <TableCell>{survey.id}</TableCell>
                                        <TableCell>
                                            <img
                                                src={`http://localhost:5000/uploads/${survey.image}`}
                                                alt={survey.caption}
                                                className="w-40 h-24 object-cover rounded-md"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/no-image.png";
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{survey.title}</TableCell>
                                        <TableCell>{survey.caption}</TableCell>
                                        <TableCell>{survey.description}</TableCell>
                                        <TableCell>{survey.description}</TableCell>
                                        <TableCell>{survey.total_question}</TableCell>
                                        <TableCell>{survey.is_active === 1 ? "Aktif" : "Nonaktif"}</TableCell>
                                        <TableCell className="space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-blue-500 text-blue-600 hover:bg-blue-100"
                                                onClick={() => openEditForm(survey)}
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
                                                    Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat
                                                    dibatalkan.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="mt-6">
                                                    <AlertDialogCancel className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                                                    Batal
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                    className="bg-red-500 hover:bg-red-600 text-white"
                                                    onClick={() => handleDelete(survey.id)}
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
                                                No Questions Found
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
                <DialogContent className="bg-white border border-blue-200 shadow-xl rounded-xl w-2xl">
                    <DialogHeader>
                    <DialogTitle className="text-blue-700 font-semibold">
                        {editing ? "Edit Content" : "Create Content"}
                    </DialogTitle>
                    <DialogDescription>
                        Form untuk mengelola data survey
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-3 py-2">
                        <div>
                            <h2 className=" font-medium">ID</h2>
                            <Input
                                placeholder="Id"
                                name="id"
                                value={form.id}
                                onChange={handleChange}
                                className="border-blue-300 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <h2 className=" font-medium">Title</h2>
                            <Input
                                placeholder="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="border-blue-300 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <h2 className=" font-medium">Caption</h2>
                            <Input
                                placeholder="caption"
                                name="caption"
                                value={form.caption}
                                onChange={handleChange}
                                className="border-blue-300 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <h2 className=" font-medium">Description</h2>
                            <Input
                                placeholder="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="border-blue-300 focus:ring-blue-500"
                            />
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
                        <div>
                            <h2 className=" font-medium">Image</h2>
                            <FilePond
                                name="file"
                                allowMultiple={false}
                                acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
                                labelFileTypeNotAllowed="Hanya JPG / PNG / WEBP"
                                fileValidateTypeLabelExpectedTypes="Hanya JPG / PNG / WEBP"
                                server={{
                                    process: {
                                    url: "http://localhost:5000/api/surveys/upload",
                                    method: "POST",
                                    onload: (filename) => {
                                        setForm((prev) => ({
                                        ...prev,
                                        newImage: filename,
                                        }));
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
                    </div>
                    <div className="pt-4">
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                        onClick={editing ? handleUpdate : handleCreate}
                    >
                        {editing ? "Update" : "Create"}
                    </Button>
                    </div>
                </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}