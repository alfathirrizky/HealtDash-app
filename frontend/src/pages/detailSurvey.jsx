export default function DetailSurvey() {
    return(
        <div className="p-5">
            <h1 className=" font-bold text-4xl">Survey Detail</h1>
            <div className=" mt-10 flex flex-col gap-5 p-5 bg-white rounded-2xl shadow-sm">
                <div>
                    <h2 className="font-semibold">Image</h2>
                    <img src="" alt="" srcset="" />
                </div>
                <div>
                    <h2 className=" font-semibold">ID</h2>
                    <input type="text" name="id" id="" placeholder="ini id" className="w-2xl border border-slate-300 rounded-2xl p-2" />
                </div>
                <div>
                    <h2 className=" font-semibold">Title</h2>
                    <input type="text" name="title" id="" placeholder="ini title" className="w-2xl border border-slate-300 rounded-2xl p-2" />
                </div>
                <div>
                    <h2 className=" font-semibold">Caption</h2>
                    <input type="text" name="caption" id="" placeholder="ini caption" className="w-2xl border border-slate-300 rounded-2xl p-2" />
                </div>
                <div>
                    <h2 className=" font-semibold">Description</h2>
                    <input type="text" name="description" id="" placeholder="ini description" className="w-2xl border border-slate-300 rounded-2xl p-2" />
                </div>
                <div>
                    <h2 className=" font-semibold">Question List</h2>
                    <input type="text" name="id" id="" placeholder="ini id" className="w-2xl border border-slate-300 rounded-2xl p-2" />
                </div>
            </div>
        </div>
    )
}