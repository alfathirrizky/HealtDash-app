import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Activity, Clock, Moon, ShieldAlert, ChevronDown, ChevronUp, FileText, Download } from "lucide-react";
import * as XLSX from "xlsx";

export default function AnswerPage() {
    const [employees, setEmployees] = useState([]);
    const [detailedAnswers, setDetailedAnswers] = useState({});
    const [allAnswers, setAllAnswers] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, ansRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/identified-employees"),
                    axios.get("http://localhost:5000/api/answers/detailed-answers")
                ]);
                setEmployees(empRes.data);
                
                // Group answers by employee_name
                const answersMap = {};
                ansRes.data.forEach(item => {
                    if (!answersMap[item.employee_name]) {
                        answersMap[item.employee_name] = [];
                    }
                    answersMap[item.employee_name].push(item);
                });
                setDetailedAnswers(answersMap);
                setAllAnswers(ansRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleRow = (employee_name) => {
        setExpandedRows(prev => ({
            ...prev,
            [employee_name]: !prev[employee_name]
        }));
    };

    const groupBySurvey = (answersList) => {
        if (!answersList) return {};
        return answersList.reduce((acc, curr) => {
            const title = curr.survey_title || 'Survei Tidak Diketahui';
            if (!acc[title]) acc[title] = [];
            acc[title].push(curr);
            return acc;
        }, {});
    };

    const handleExportExcel = () => {
        if (employees.length === 0) {
            alert("Tidak ada data untuk diexport");
            return;
        }

        const excelData = employees.map(emp => ({
            'Nama Karyawan': emp.employee_name || '',
            'Tingkat Stres': emp.stress_level || 0,
            'Jam Kerja': emp.work_hours || 0,
            'Kualitas Tidur': emp.sleep_quality || 0,
            'Skor Risiko': `${(emp.risk_score * 100).toFixed(1)}%`,
            'Tingkat Risiko': emp.risk_level || '',
            'Faktor Dominan': emp.dominant_factor || ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        
        // Sesuaikan lebar kolom
        const columnWidths = [
            { wch: 25 }, // Nama
            { wch: 15 }, // Tingkat Stres
            { wch: 15 }, // Jam Kerja
            { wch: 15 }, // Kualitas Tidur
            { wch: 15 }, // Skor Risiko
            { wch: 15 }, // Tingkat Risiko
            { wch: 40 }  // Faktor Dominan
        ];
        worksheet['!cols'] = columnWidths;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Survei");
        XLSX.writeFile(workbook, "Data_Hasil_Survei_Karyawan.xlsx");
    };

    return (
        <div className="p-5 max-w-7xl mx-auto font-sans h-[calc(100vh-2rem)] overflow-y-auto scrollbar-none scroll-smooth pr-2">
            <div className="mb-8 mt-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3 tracking-tight">
                        <Users className="w-8 h-8 text-blue-600" />
                        Data Hasil Survei Karyawan
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm">
                        Menampilkan daftar karyawan yang telah mengisi survei beserta skor evaluasi risiko burnout mereka.
                    </p>
                </div>
                <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold shadow-sm transition-all text-sm"
                >
                    <Download className="w-4 h-4" />
                    Export Excel
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-bold">Nama Karyawan</th>
                                <th className="px-6 py-4 font-bold text-center">Tingkat Stres</th>
                                <th className="px-6 py-4 font-bold text-center">Jam Kerja</th>
                                <th className="px-6 py-4 font-bold text-center">Kualitas Tidur</th>
                                <th className="px-6 py-4 font-bold text-center">Skor Risiko</th>
                                <th className="px-6 py-4 font-bold text-center">Tingkat Risiko</th>
                                <th className="px-6 py-4 font-bold text-center">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-2 text-slate-400">
                                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                            <span>Memuat data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : employees.length > 0 ? (
                                employees.map((emp, idx) => (
                                    <React.Fragment key={idx}>
                                        <tr className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-slate-800">
                                                {emp.employee_name}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">
                                                    <Activity className="w-3.5 h-3.5" /> {emp.stress_level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                                    <Clock className="w-3.5 h-3.5" /> {emp.work_hours}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 border border-sky-100">
                                                    <Moon className="w-3.5 h-3.5" /> {emp.sleep_quality}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    <span className="font-bold text-slate-800 text-xs">
                                                        {(emp.risk_score * 100).toFixed(1)}%
                                                    </span>
                                                    <div className="w-16 bg-slate-100 rounded-full h-1.5">
                                                        <div 
                                                            className={`h-1.5 rounded-full ${
                                                                emp.risk_level === "Tinggi" ? "bg-rose-500" :
                                                                emp.risk_level === "Sedang" ? "bg-orange-500" :
                                                                "bg-emerald-500"
                                                            }`}
                                                            style={{ width: `${Math.min(emp.risk_score * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                                                    emp.risk_level === 'Tinggi' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                    emp.risk_level === 'Sedang' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                    'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                }`}>
                                                    <ShieldAlert className="w-3.5 h-3.5" /> {emp.risk_level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => toggleRow(emp.employee_name)}
                                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors inline-flex justify-center items-center"
                                                >
                                                    {expandedRows[emp.employee_name] ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedRows[emp.employee_name] && (
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                <td colSpan="7" className="px-6 py-6">
                                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-left">
                                                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                            <FileText className="w-5 h-5 text-blue-500" />
                                                            Detail Jawaban Survei
                                                        </h4>
                                                        {detailedAnswers[emp.employee_name] && detailedAnswers[emp.employee_name].length > 0 ? (
                                                            <div className="space-y-4">
                                                                {Object.entries(groupBySurvey(detailedAnswers[emp.employee_name])).map(([surveyTitle, categoryAnswers]) => (
                                                                    <div key={surveyTitle} className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
                                                                        <div className="bg-indigo-50 border-b border-slate-200 px-4 py-3 font-semibold text-indigo-900 flex items-center gap-2">
                                                                            <span className="bg-indigo-200 text-indigo-800 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider">
                                                                                Nama Survei
                                                                            </span>
                                                                            {surveyTitle}
                                                                        </div>
                                                                        <table className="min-w-full table-auto text-left">
                                                                            <thead className="bg-white border-b border-slate-200 text-slate-500 text-xs uppercase">
                                                                                <tr>
                                                                                    <th className="px-4 py-2 font-bold border-r border-slate-200">Kategori</th>
                                                                                    <th className="px-4 py-2 font-bold border-r border-slate-200 w-1/2">Pertanyaan</th>
                                                                                    <th className="px-4 py-2 font-bold">Jawaban</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
                                                                                {categoryAnswers.map((ans, i) => (
                                                                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                                                        <td className="px-4 py-3 border-r border-slate-200 align-top">
                                                                                            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-md font-bold whitespace-nowrap">
                                                                                                {ans.survey_category || 'Umum'}
                                                                                            </span>
                                                                                        </td>
                                                                                        <td className="px-4 py-3 border-r border-slate-200 align-top">
                                                                                            {ans.question_label}
                                                                                        </td>
                                                                                        <td className="px-4 py-3 align-top">
                                                                                            <span className="text-sm font-medium text-slate-900 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg inline-block">
                                                                                                {ans.answer_text}
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-slate-500 italic">Tidak ada detail jawaban survei yang tersimpan untuk karyawan ini (Mungkin berasal dari Upload Excel).</p>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Users className="w-10 h-10 text-slate-300" />
                                            <span>Belum ada data survei yang diisi.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
