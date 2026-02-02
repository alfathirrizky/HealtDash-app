import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Link, useNavigate } from "react-router-dom"
import useQuestions from "../hooks/useQuestions"
import useSurvey from "@/hooks/useSurvey"
import { FilePond } from "react-filepond";
export default function CreateQuestionPage() {
    const { form, handleChange, handleCreate } = useQuestions()
    const { surveys = [] } = useSurvey();
    const navigate = useNavigate()
    const submit = async () => {
        await handleCreate()
        navigate("/question") // kembali ke halaman user setelah create
    }
    return(
    <div className="p-5 space-y-6">
        <div className=" gap-5 scrollbar-none scroll-smooth overflow-y-auto h-[91vh]">
            <h1 className=" font-bold text-4xl">Form Create Question</h1>
            <div className=" flex justify-between items-center">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/question">Question</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Create Question</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Link to="/question">
                    <button className=" bg-red-600 text-white font-medium py-1 px-5 rounded-lg cursor-pointer">Batal</button>
                </Link>
            </div>
            <div className="bg-white w-full">
                    <div className="grid grid-cols-2 gap-3 py-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="font-semibold">Survey</h1>
                            <select
                                name="survey_id"
                                value={form.survey_id || ""}
                                onChange={handleChange}
                                className="border border-gray-400 rounded-md p-2"
                            >
                                <option value="">-- Pilih Survey --</option>
                                {Array.isArray(surveys) &&
                                surveys.map((survey) => (
                                    <option key={survey.id} value={survey.id}>
                                    {survey.title} {/* atau survey.name */}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-semibold">Question</h1>
                            <Input name="question" placeholder="Masukan Question" value={form.question} onChange={handleChange} className="border border-gray-400"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-semibold">Name</h1>
                            <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border border-gray-400"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-semibold">Label</h1>
                            <Input name="label" placeholder="Label" value={form.label} onChange={handleChange} className="border border-gray-400"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-semibold">Note</h1>
                            <Input name="note" placeholder="Note" value={form.note} onChange={handleChange} className="border border-gray-400"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-semibold">Type</h1>
                            <Input type="select" name="type" placeholder="Type" value={form.type} onChange={handleChange} className="border border-gray-400"/>
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