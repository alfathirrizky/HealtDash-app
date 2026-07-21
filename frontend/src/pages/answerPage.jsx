import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Activity, Clock, Moon, ShieldAlert, ChevronDown, ChevronUp, FileText, Download, Zap, ShieldCheck, AlertCircle, CheckCircle, Printer, Search } from "lucide-react";
import * as XLSX from "xlsx";

// Helper untuk menghasilkan rekomendasi tindakan preventif berdasarkan risk level dan faktor dominan
const getProactiveRecommendations = (riskLevel, dominantFactor) => {
    if (!dominantFactor) return ["Data faktor dominan tidak tersedia untuk memberikan rekomendasi spesifik."];
    const text = dominantFactor.toLowerCase();

    if (riskLevel === "Tinggi") {
        if (text.includes("stres") || text.includes("stress")) {
            return [
                "Tindakan Darurat: Berikan cuti mental wajib selama 2-3 hari kerja.",
                "Lakukan konseling/konsultasi psikologis secara privat yang difasilitasi perusahaan.",
                "Intervensi Manajemen: Pindahkan sebagian tanggung jawab proyek kritis ke rekan kerja lain.",
                "Jadwalkan pertemuan empat mata (1-on-1) segera untuk mendengarkan hambatan kerja mereka."
            ];
        } else if (text.includes("jam kerja") || text.includes("overwork") || text.includes("work hours")) {
            return [
                "Tindakan Darurat: Hentikan akses lembur atau pekerjaan luar jam kantor segera.",
                "Delegasikan ulang tugas mendesak untuk mengurangi beban kerja hingga 30%.",
                "Wajibkan karyawan mengambil cuti pemulihan dalam minggu ini.",
                "Lakukan audit beban kerja bulanan untuk menganalisis mengapa terjadi overwork."
            ];
        } else {
            return [
                "Tindakan Darurat: Berikan dispensasi keterlambatan mulai kerja atau opsi Work From Home (WFH).",
                "Batasi penugasan shift malam atau rapat di pagi hari.",
                "Kurangi target output harian agar karyawan memiliki waktu istirahat yang cukup.",
                "Sarankan pemeriksaan kesehatan/medical check-up gratis."
            ];
        }
    } else if (riskLevel === "Sedang") {
        if (text.includes("stres") || text.includes("stress")) {
            return [
                "Proaktif: Berikan sesi coaching manajemen stres & prioritas tugas.",
                "Evaluasi keselarasan target kinerja (KPI) agar lebih realistis.",
                "Ajak berpartisipasi dalam program kebugaran mental (mindfulness/wellness) kantor.",
                "Diskusikan potensi pembagian tugas jika beban dirasa mulai berat."
            ];
        } else if (text.includes("jam kerja") || text.includes("overwork") || text.includes("work hours")) {
            return [
                "Proaktif: Terapkan kebijakan 'Right to Disconnect' setelah jam kerja.",
                "Bantu karyawan membuat prioritas harian untuk menghindari penumpukan pekerjaan.",
                "Batasi waktu lembur maksimal 5 jam per minggu.",
                "Pastikan hak istirahat makan siang dan rehat pendek dimanfaatkan penuh."
            ];
        } else {
            return [
                "Proaktif: Edukasi 'sleep hygiene' dan pentingnya mematikan gadget sebelum tidur.",
                "Kurangi pengiriman pesan kerja (chat/email) di luar jam operasional.",
                "Sediakan suplemen vitamin atau fasilitas istirahat (nap room) jika memungkinkan.",
                "Tawarkan fleksibilitas jam kerja agar ritme istirahat membaik."
            ];
        }
    } else {
        if (text.includes("stres") || text.includes("stress")) {
            return [
                "Wellness: Pertahankan target kerja yang sehat saat ini.",
                "Apresiasi pencapaian dan kinerja karyawan untuk menjaga motivasi.",
                "Sarankan untuk ikut serta dalam aktivitas sosial tim (gathering/outing)."
            ];
        } else if (text.includes("jam kerja") || text.includes("overwork") || text.includes("work hours")) {
            return [
                "Wellness: Berikan apresiasi atas manajemen waktu yang baik.",
                "Dorong untuk konsisten menjaga pola kerja saat ini.",
                "Pastikan karyawan terus menjaga keseimbangan kehidupan kerja (work-life balance)."
            ];
        } else {
            return [
                "Wellness: Edukasi berkelanjutan mengenai gaya hidup sehat.",
                "Dukung program olahraga bersama atau keanggotaan gym dari kantor.",
                "Jaga lingkungan kerja yang kondusif untuk produktivitas yang sehat."
            ];
        }
    }
};

const getFactorIcon = (factor) => {
    if (!factor) return <Zap className="w-3.5 h-3.5 text-slate-400" />;
    const text = factor.toLowerCase();
    if (text.includes("stres") || text.includes("stress")) {
        return <Activity className="w-3.5 h-3.5 text-violet-500" />;
    } else if (text.includes("jam kerja") || text.includes("overwork") || text.includes("work hours")) {
        return <Clock className="w-3.5 h-3.5 text-amber-500" />;
    } else {
        return <Moon className="w-3.5 h-3.5 text-sky-500" />;
    }
};

const getFactorStyle = (factor) => {
    if (!factor) return "bg-slate-50 text-slate-500 border-slate-200";
    const text = factor.toLowerCase();
    if (text.includes("stres") || text.includes("stress")) {
        return "bg-violet-50 text-violet-700 border-violet-100";
    } else if (text.includes("jam kerja") || text.includes("overwork") || text.includes("work hours")) {
        return "bg-amber-50 text-amber-700 border-amber-100";
    } else {
        return "bg-sky-50 text-sky-700 border-sky-100";
    }
};

export default function AnswerPage() {
    const [employees, setEmployees] = useState([]);
    const [detailedAnswers, setDetailedAnswers] = useState({});
    const [allAnswers, setAllAnswers] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [expandedActionRows, setExpandedActionRows] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredEmployees = employees.filter(emp =>
        (emp.employee_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.risk_level || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.dominant_factor || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    // State khusus untuk cetak laporan per karyawan
    const [printEmployee, setPrintEmployee] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, ansRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/answers/survey-results"),
                    axios.get("http://localhost:5000/api/answers/detailed-answers")
                ]);
                // Group answers by employee_name
                const answersMap = {};
                ansRes.data.forEach(item => {
                    if (!answersMap[item.employee_name]) {
                        answersMap[item.employee_name] = [];
                    }
                    answersMap[item.employee_name].push(item);
                });
                
                setEmployees(empRes.data);
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

    // Listen event setelah print selesai agar state printEmployee kembali bersih
    useEffect(() => {
        const handleAfterPrint = () => {
            setPrintEmployee(null);
        };
        window.addEventListener("afterprint", handleAfterPrint);
        return () => {
            window.removeEventListener("afterprint", handleAfterPrint);
        };
    }, []);

    const toggleRow = (employee_name) => {
        setExpandedRows(prev => ({
            ...prev,
            [employee_name]: !prev[employee_name]
        }));
    };

    const toggleActionRow = (employee_name) => {
        setExpandedActionRows(prev => ({
            ...prev,
            [employee_name]: !prev[employee_name]
        }));
    };

    // Memicu dialog cetak browser untuk laporan karyawan tertentu
    const handlePrint = (employee) => {
        setPrintEmployee(employee);
        // Beri sedikit delay untuk memastikan render DOM komponen cetak selesai
        setTimeout(() => {
            window.print();
        }, 150);
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
        <>
        <div className="p-5 max-w-7xl mx-auto font-sans h-[calc(100vh-2rem)] overflow-y-auto scrollbar-none scroll-smooth pr-2 print:hidden">
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
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari karyawan atau risiko..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
                        />
                    </div>
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold shadow-sm transition-all text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export Excel
                    </button>
                </div>
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
                                <th className="px-6 py-4 font-bold text-center">Faktor Dominan</th>
                                <th className="px-6 py-4 font-bold text-center">Tindakan</th>
                                <th className="px-6 py-4 font-bold text-center">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-2 text-slate-400">
                                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                            <span>Memuat data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredEmployees.length > 0 ? (
                                filteredEmployees.map((emp, idx) => {
                                    const isActionExpanded = expandedActionRows[emp.employee_name];
                                    const recommendations = getProactiveRecommendations(emp.risk_level, emp.dominant_factor);
                                    return (
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
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border max-w-[220px] ${getFactorStyle(emp.dominant_factor)}`}>
                                                    {getFactorIcon(emp.dominant_factor)}
                                                    <span className="truncate">{emp.dominant_factor || 'N/A'}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => toggleActionRow(emp.employee_name)}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-2.5 py-1.5 rounded-lg transition-colors duration-200"
                                                >
                                                    {isActionExpanded ? (
                                                        <>Tutup <ChevronUp className="w-3.5 h-3.5" /></>
                                                    ) : (
                                                        <>Tindakan <ChevronDown className="w-3.5 h-3.5" /></>
                                                    )}
                                                </button>
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

                                        {/* Expanded Action/Recommendations Row */}
                                        {isActionExpanded && (
                                            <tr className="bg-slate-50/30 border-b border-slate-100">
                                                <td colSpan="9" className="px-6 py-5">
                                                    <div className="space-y-3">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-2">
                                                            <div className="flex items-center gap-2 text-xs font-bold text-blue-800 bg-blue-50/80 w-max px-2.5 py-1 rounded-md">
                                                                <ShieldCheck className="w-4 h-4 text-blue-600" />
                                                                <span>Langkah Pencegahan &amp; Intervensi Proaktif (Rekomendasi HRD):</span>
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handlePrint(emp);
                                                                }}
                                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors duration-200 shadow-sm self-start md:self-auto"
                                                            >
                                                                <Printer className="w-3.5 h-3.5 text-blue-600" />
                                                                Cetak Laporan
                                                            </button>
                                                        </div>
                                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1">
                                                            {recommendations.map((s, i) => {
                                                                const isUrgent = s.startsWith("Tindakan Darurat:") || s.startsWith("Proaktif:");
                                                                return (
                                                                    <li 
                                                                        key={i} 
                                                                        className={`flex items-start gap-2.5 p-3 rounded-xl border bg-white ${
                                                                            isUrgent ? "border-rose-100 bg-rose-50/10" : "border-slate-100"
                                                                        }`}
                                                                    >
                                                                        {isUrgent ? (
                                                                            <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                                                                        ) : (
                                                                            <CheckCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                                                        )}
                                                                        <span className="text-xs text-slate-600 leading-relaxed font-medium">
                                                                            {s}
                                                                        </span>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                        {/* Expanded Detail Jawaban Survei Row */}
                                        {expandedRows[emp.employee_name] && (
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                <td colSpan="9" className="px-6 py-6">
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
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center text-slate-500">
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

        {/* ==================== PRINTABLE SECTION: HANYA TAMPIL SAAT PROSES CETAK ==================== */}
        {printEmployee && (
            <div className="hidden print:block p-8 bg-white text-slate-800 font-sans min-h-screen text-sm leading-relaxed">
                {/* Header Laporan */}
                <div className="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-wide uppercase">HealthDash Proactive Analytics</h1>
                        <p className="text-xs text-slate-500">Sistem Deteksi Dini &amp; Pencegahan Burnout Karyawan</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-md border border-slate-300">
                            DOKUMEN RAHASIA
                        </span>
                    </div>
                </div>

                {/* Judul Dokumen */}
                <div className="text-center mb-8">
                    <h2 className="text-lg font-black text-slate-900 tracking-wider uppercase">LAPORAN REKOMENDASI TINDAK LANJUT KARYAWAN</h2>
                    <p className="text-xs text-slate-600 mt-1">Dicetak pada: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>

                {/* Info Identitas Karyawan */}
                <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                        <span className="text-xs font-bold text-slate-400 block uppercase">Nama Karyawan</span>
                        <span className="text-base font-bold text-slate-800">{printEmployee.employee_name}</span>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 block uppercase">Tanggal Survei</span>
                        <span className="text-sm font-semibold text-slate-700">
                            {new Date(printEmployee.created_at || new Date()).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 block uppercase">Posisi</span>
                        <span className="text-sm font-semibold text-slate-700">{printEmployee.user_position || '-'}</span>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 block uppercase">Status Risiko</span>
                        <span className={`text-xs font-black uppercase ${
                            printEmployee.risk_level === "Tinggi" ? "text-rose-600" :
                            printEmployee.risk_level === "Sedang" ? "text-amber-600" :
                            "text-emerald-600"
                        }`}>
                            {printEmployee.risk_level} Risk (Probabilitas Burnout: {(printEmployee.risk_score * 100).toFixed(1)}%)
                        </span>
                    </div>
                </div>

                {/* Parameter Kesehatan */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-300 pb-1.5 mb-3 uppercase tracking-wider">I. Hasil Penilaian Parameter Kesehatan</h3>
                    <table className="w-full text-left border-collapse border border-slate-200">
                        <thead>
                            <tr className="bg-slate-100 text-xs font-bold text-slate-700">
                                <th className="border border-slate-200 p-2.5">Parameter</th>
                                <th className="border border-slate-200 p-2.5 text-center">Nilai Terukur</th>
                                <th className="border border-slate-200 p-2.5">Status Batas Kepatuhan Kerja Sehat</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs text-slate-700">
                            <tr>
                                <td className="border border-slate-200 p-2.5 font-bold">Tingkat Stres Kerja (Stress Level)</td>
                                <td className="border border-slate-200 p-2.5 text-center font-bold text-violet-600">{printEmployee.stress_level}/10</td>
                                <td className="border border-slate-200 p-2.5">
                                    {printEmployee.stress_level >= 7 ? "Kritis - Butuh penanganan tingkat stres segera" :
                                     printEmployee.stress_level >= 4 ? "Waspada - Tingkat stres sedang" : "Normal - Tingkat stres dapat dikelola dengan baik"}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-slate-200 p-2.5 font-bold">Durasi Jam Kerja Harian (Work Hours)</td>
                                <td className="border border-slate-200 p-2.5 text-center font-bold text-amber-600">{printEmployee.work_hours} Jam / Hari</td>
                                <td className="border border-slate-200 p-2.5">
                                    {printEmployee.work_hours > 9 ? "Kritis - Jam kerja berlebih (Overwork kronis)" :
                                     printEmployee.work_hours > 8 ? "Waspada - Jam kerja mendekati batas maksimal" : "Normal - Keseimbangan jam kerja yang sehat"}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-slate-200 p-2.5 font-bold">Kualitas Tidur &amp; Istirahat (Sleep Quality)</td>
                                <td className="border border-slate-200 p-2.5 text-center font-bold text-sky-600">{printEmployee.sleep_quality}/10</td>
                                <td className="border border-slate-200 p-2.5">
                                    {printEmployee.sleep_quality <= 4 ? "Kritis - Kualitas istirahat sangat buruk" :
                                     printEmployee.sleep_quality <= 6 ? "Waspada - Kualitas istirahat tidak optimal" : "Normal - Kualitas istirahat tercukupi"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="mt-3 text-xs text-slate-650">
                        * Faktor Pemicu Utama Burnout Karyawan: <span className="font-bold text-slate-800 uppercase">{printEmployee.dominant_factor}</span>
                    </div>
                </div>

                {/* Rencana Tindak Lanjut & Intervensi */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-300 pb-1.5 mb-3 uppercase tracking-wider">II. Rencana Tindak Lanjut &amp; Intervensi (Rekomendasi HRD)</h3>
                    <p className="text-xs text-slate-600 mb-3">
                        Berdasarkan klasifikasi model Decision Tree, rekomendasi tindakan pencegahan burnout di bawah ini disarankan untuk dijalankan segera demi memulihkan keseimbangan kerja karyawan:
                    </p>
                    <ul className="space-y-2">
                        {getProactiveRecommendations(printEmployee.risk_level, printEmployee.dominant_factor).map((rec, i) => (
                            <li key={i} className="flex gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <span className="font-bold text-slate-500 shrink-0">{i + 1}.</span>
                                <span className="leading-relaxed font-semibold">{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Kolom Tanda Tangan */}
                <div className="mt-16 grid grid-cols-2 gap-8 text-center text-xs">
                    <div>
                        <p className="font-bold text-slate-700 mb-16">Karyawan Bersangkutan,</p>
                        <div className="w-40 border-b border-slate-400 mx-auto mb-1"></div>
                        <p className="text-slate-500">{printEmployee.employee_name}</p>
                    </div>
                    <div>
                        <p className="font-bold text-slate-700 mb-16">HRD Manager,</p>
                        <div className="w-40 border-b border-slate-400 mx-auto mb-1"></div>
                        <p className="text-slate-500">Tim Kesehatan &amp; Kesejahteraan Karyawan</p>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
