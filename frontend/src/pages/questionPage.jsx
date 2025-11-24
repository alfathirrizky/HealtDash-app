function QuestionPage() {
    return (
        <div className=" shadow-md p-3">
            <form action="POST" className="flex flex-col gap-4">
                <div className="input flex flex-col gap-1">
                    <h1 className=" font-bold">Question Page</h1>
                    <input className=" w-xl border border-gray-400 rounded-md p-1" type="text" name="question_text" id="" placeholder="Masukan Pertanyaan"/>
                </div>
                <button type="submit" className=" bg-blue-500 text-white rounded-xl py-2 font-medium">Upload Question</button>
            </form>
        </div>
    );
}
export default QuestionPage;