import API from "../api/api"
import { useMemo } from "react"
import useSurvey from "@/hooks/useSurvey"
import useQuestion from "../hooks/useQuestions"
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

function QuestionPage() {
    const {
        questions,
        open,
        form,
        editing,
        setOpen,
        handleCreate,
        handleChange,
        handleUpdate,
        handleDelete,
        openEditForm,
    } = useQuestion();
    const { surveys = [] } = useSurvey();
    const surveyMap = useMemo(() => {
        const map = {};
        surveys.forEach((s) => {
            map[String(s.id)] = s.title;
        });
        return map;
        }, [surveys]);
    return (
        <div className="space-y-4 p-5">
            <div className="flex flex-col gap-5 scrollbar-none scroll-smooth overflow-y-auto h-[89vh]">
                <div className=" flex w-full items-center justify-between gap-5">
                    <h1 className=" font-bold text-4xl">Question Dashboard</h1>
                    <div className=" flex gap-4 w-2xl justify-end">
                        <div className="w-full md:w-1/3">
                                <InputGroup>
                                <InputGroupInput placeholder="Search..." />
                                <InputGroupAddon>
                                    <Search/>
                                </InputGroupAddon>
                                </InputGroup>
                        </div>
                        <Link to="/question/create">
                            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                                Create Question
                            </Button>
                        </Link>
                    </div>
                </div>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/question">Question</Link>
                        </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </BreadcrumbList>
                </Breadcrumb>
                {/* TABLE */}
                <div className="border border-blue-200 rounded-xl p-3 bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-blue-50 border-b border-blue-100">
                                <TableHead className="text-blue-600 font-semibold">Question</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Survey Name</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Label</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Category</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Note</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questions.length > 0 ? (
                                questions.map((question) => (
                                    <TableRow
                                        key={question.question_id}
                                        className="hover:bg-blue-50 transition border-b border-gray-400"
                                    >
                                        <TableCell>{question.name}</TableCell>
                                        <TableCell>{surveyMap[String(question.survey_id)] || "-"}</TableCell>
                                        <TableCell>{question.label}</TableCell>
                                        <TableCell>{question.type}</TableCell>
                                        <TableCell>{question.note}</TableCell>
                                        <TableCell className="space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-blue-500 text-blue-600 hover:bg-blue-100"
                                                onClick={() => openEditForm(question)}
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
                                                    onClick={() => handleDelete(question.question_id)}
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
                <DialogContent className="bg-white border-blue-100 rounded-xl shadow-lg">
                    <DialogHeader>
                    <DialogTitle className="text-blue-500 font-bold text-2xl">
                        {editing ? "Edit Question" : "Create Question"}
                    </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <p className=" font-semibold">ID Question</p>
                            <Input
                                placeholder="Id"
                                name="question_id"
                                value={form.question_id}
                                onChange={handleChange}
                                className="border-blue-300 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className=" font-semibold">Survey ID</p>
                            <Input
                                placeholder="Survey_id"
                                name="survey_id"
                                value={form.survey_id}
                                onChange={handleChange}
                                className="border-blue-300 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className=" font-semibold">Name</p>
                            <Input
                                placeholder="Name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="border-blue-300 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className=" font-semibold">Label</p>
                            <Input
                                placeholder="Label"
                                name="label"
                                value={form.label}
                                onChange={handleChange}
                                className="border-blue-300 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className=" font-semibold">Note</p>
                            <Input
                                placeholder="Note"
                                name="note"
                                value={form.note}
                                onChange={handleChange}
                                className="border-blue-300 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className=" font-semibold">Type</p>
                            <Input
                                placeholder="Type"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="border-blue-300 focus:ring-blue-500"
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
    );
}
export default QuestionPage;