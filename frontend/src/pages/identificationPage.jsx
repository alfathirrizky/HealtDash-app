import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { 
  Upload, 
  FileSpreadsheet, 
  Search, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  Activity, 
  Users,
  Percent,
  Sliders,
  ShieldCheck,
  RefreshCw,
  Clock,
  Moon,
  Zap,
  Trash2,
  History,
  Calendar,
  Sparkles,
  Database,
  RefreshCcw,
  Printer
} from "lucide-react";

// Helper untuk menghasilkan rekomendasi tindakan preventif di sisi klien untuk data riwayat
const getProactiveRecommendations = (riskLevel, dominantFactor) => {
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
    } else { // Sleep Quality / Tidur
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
    } else { // Sleep Quality / Tidur
      return [
        "Proaktif: Edukasi 'sleep hygiene' dan pentingnya mematikan gadget sebelum tidur.",
        "Kurangi pengiriman pesan kerja (chat/email) di luar jam operasional.",
        "Sediakan suplemen vitamin atau fasilitas istirahat (nap room) jika memungkinkan.",
        "Tawarkan fleksibilitas jam kerja agar ritme istirahat membaik."
      ];
    }
  } else { // Rendah
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
    } else { // Sleep Quality / Tidur
      return [
        "Wellness: Edukasi berkelanjutan mengenai gaya hidup sehat.",
        "Dukung program olahraga bersama atau keanggotaan gym dari kantor.",
        "Jaga lingkungan kerja yang kondusif untuk produktivitas yang sehat."
      ];
    }
  }
};

export default function UploadExcel() {
  // State untuk unggah berkas dan analisis aktif
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("Semua");
  const [expandedRows, setExpandedRows] = useState({});

  // State untuk manajemen tab & data riwayat teridentifikasi dari DB
  const [activeTab, setActiveTab] = useState("upload");
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearchTerm, setHistorySearchTerm] = useState("");
  const [historyRiskFilter, setHistoryRiskFilter] = useState("Semua");
  const [expandedHistoryRows, setExpandedHistoryRows] = useState({});

  // State khusus untuk cetak laporan per karyawan
  const [printEmployee, setPrintEmployee] = useState(null);

  // Muat data riwayat saat komponen dipasang
  useEffect(() => {
    fetchHistory();
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

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await axios.get("http://localhost:5000/api/identified-employees");
      setHistoryData(res.data);
    } catch (err) {
      console.error("Gagal memuat riwayat identifikasi:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Silakan pilih file Excel terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      // Upload ke Node.js server (Port 5000) agar disimpan secara otomatis ke database MySQL
      const res = await axios.post("http://localhost:5000/api/upload-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      // Reset filter dan baris terekspansi analisis aktif
      setSearchTerm("");
      setRiskFilter("Semua");
      setExpandedRows({});
      // Pindahkan fokus ke tab analisis aktif
      setActiveTab("upload");
      // Perbarui daftar riwayat dari database
      fetchHistory();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Gagal memproses file. Pastikan server Express (Port 5000) dan Python FastAPI (Port 8000) berjalan!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data identifikasi karyawan ini dari database?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/identified-employees/${id}`);
      // Perbarui local state riwayat
      setHistoryData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Gagal menghapus data identifikasi karyawan:", err);
      alert("Gagal menghapus data karyawan.");
    }
  };

  const toggleRow = (idx) => {
    setExpandedRows(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const toggleHistoryRow = (id) => {
    setExpandedHistoryRows(prev => ({
      ...prev,
      [id]: !prev[id]
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

  // Export data ke Excel sesuai dengan format yang diminta
  const exportToExcel = () => {
    if (!result || !result.hr_recommendations) return;

    const dataToExport = result.hr_recommendations.map((rec) => ({
      "Nama Karyawan": rec.employee_name,
      "Tingkat Stres": rec.stress_level,
      "Jam Kerja": rec.work_hours,
      "Kualitas Tidur": rec.sleep_quality,
      "Skor Risiko": `${(rec.risk_score * 100).toFixed(1)}%`,
      "Tingkat Risiko": rec.risk_level,
      "Faktor Dominan": rec.dominant_factor
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil Analisis Burnout");

    XLSX.writeFile(workbook, "Hasil_Analisis_Burnout.xlsx");
  };

  // Helper untuk render badge risiko
  const getRiskBadge = (level) => {
    switch (level) {
      case "Tinggi":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Risiko Tinggi
          </span>
        );
      case "Sedang":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            Risiko Sedang
          </span>
        );
      case "Rendah":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Risiko Rendah
          </span>
        );
    }
  };

  // Helper untuk ikon faktor dominan
  const getFactorIcon = (factor) => {
    const text = factor.toLowerCase();
    if (text.includes("stres") || text.includes("stress")) {
      return <Activity className="w-4 h-4 text-violet-500" />;
    } else if (text.includes("jam kerja") || text.includes("overwork") || text.includes("work hours")) {
      return <Clock className="w-4 h-4 text-amber-500" />;
    } else {
      return <Moon className="w-4 h-4 text-sky-500" />;
    }
  };

  // Filter data karyawan analisis aktif
  const filteredRecommendations = result?.hr_recommendations?.filter((rec) => {
    const matchesSearch = rec.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.dominant_factor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === "Semua" || rec.risk_level === riskFilter;

    return matchesSearch && matchesRisk;
  }) || [];

  // Filter data karyawan dari database (riwayat)
  const filteredHistory = historyData.filter((item) => {
    const matchesSearch = item.employee_name.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
      item.dominant_factor.toLowerCase().includes(historySearchTerm.toLowerCase());

    const matchesRisk = historyRiskFilter === "Semua" || item.risk_level === historyRiskFilter;

    return matchesSearch && matchesRisk;
  });

  return (
    <>
      {/* Container utama dashboard: disembunyikan saat melakukan print */}
      <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 scrollbar-none scroll-smooth overflow-y-auto h-[90vh] pr-1">
          
          {/* Header Dashboard */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                <Zap className="w-7 h-7 text-blue-600 fill-blue-600/10" />
                Proactive Burnout Analytics
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Optimalkan kesehatan tim dengan identifikasi dini risiko burnout karyawan berbasis Decision Tree.
              </p>
            </div>
            
            {/* File Upload Section */}
            <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-200/80">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 border border-slate-200">
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                <span>{file ? file.name : "Pilih Excel (.xlsx, .xls)"}</span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold text-sm transition-all duration-200 flex items-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-sm shadow-blue-500/10 hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Mulai Analisis
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tab Navigator */}
          <div className="flex border-b border-slate-200 gap-2">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition-all duration-200 ${
                activeTab === "upload"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Analisis Berkas Excel
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition-all duration-200 ${
                activeTab === "history"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <History className="w-4 h-4" />
              Data Karyawan Teridentifikasi ({historyData.length})
            </button>
          </div>

          {/* ==================== TAB CONTENT: UPLOAD & ACTIVE ANALYSIS ==================== */}
          {activeTab === "upload" && (
            <>
              {/* ==================== DASHBOARD INSIGHTS ==================== */}
              {result && result.global_insights && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
                  {/* Card 1: Total Karyawan */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Karyawan</span>
                      <h3 className="text-2xl font-black text-slate-800">{result.global_insights.total_analyzed}</h3>
                      <p className="text-xs text-slate-400">Terdaftar dalam dataset</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>

                  {/* Card 2: Tingkat Burnout */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Burnout Rate</span>
                      <h3 className="text-2xl font-black text-rose-600">
                        {(result.global_insights.predicted_burnout_rate * 100).toFixed(1)}%
                      </h3>
                      <p className="text-xs text-slate-400">
                        Akurasi Model: {(result.accuracy * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-xl">
                      <Percent className="w-6 h-6 text-rose-600" />
                    </div>
                  </div>

                  {/* Card 3: Risiko Tinggi */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Risiko Tinggi (Kritis)</span>
                      <h3 className="text-2xl font-black text-amber-600">
                        {result.global_insights.risk_distribution.Tinggi} <span className="text-sm font-normal text-slate-500">karyawan</span>
                      </h3>
                      <p className="text-xs text-slate-400">Butuh intervensi segera</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl">
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>

                  {/* Card 4: Pemicu Utama */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faktor Kontributor</span>
                      <h3 className="text-lg font-bold text-slate-800 leading-tight">
                        {result.global_insights.primary_driver}
                      </h3>
                      <p className="text-xs text-slate-400">Pengaruh terbesar burnout global</p>
                    </div>
                    <div className="p-3 bg-violet-50 rounded-xl">
                      <Sliders className="w-6 h-6 text-violet-600" />
                    </div>
                  </div>
                </div>
              )}

              {result && result.global_insights && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Feature Importance & Company-wide Insight Card */}
                  <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        Analisis Pendorong Utama Burnout Perusahaan (Feature Importance)
                      </h2>
                      <p className="text-xs text-slate-400">
                        Faktor-faktor di bawah diurutkan berdasarkan seberapa kuat mereka memicu burnout tim Anda secara sistemik.
                      </p>
                    </div>

                    <div className="space-y-3.5 py-2">
                      {Object.entries(result.global_insights.feature_importance)
                        .sort((a, b) => b[1] - a[1])
                        .map(([key, val]) => {
                          const labelMap = {
                            stress_level: { text: "Tingkat Stres Kerja", color: "bg-violet-500", rawColor: "violet" },
                            work_hours: { text: "Jam Kerja Berlebih (Overwork)", color: "bg-amber-500", rawColor: "amber" },
                            sleep_quality: { text: "Kualitas Istirahat / Tidur", color: "bg-sky-500", rawColor: "sky" }
                          };
                          const item = labelMap[key] || { text: key, color: "bg-slate-400", rawColor: "slate" };
                          return (
                            <div key={key} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-slate-700 flex items-center gap-1.5">
                                  <span className={`w-2 h-2 rounded-full ${item.color}`} />
                                  {item.text}
                                </span>
                                <span className="text-slate-500">{(val * 100).toFixed(1)}% kontribusi</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${item.color} transition-all duration-1000`} 
                                  style={{ width: `${Math.max(val * 100, 3)}%` }} 
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    <div className="bg-blue-50/50 rounded-xl p-3.5 border border-blue-100/50 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <div className="text-xs text-slate-600 leading-relaxed">
                        <span className="font-bold text-slate-800">Saran Proaktif Perusahaan:</span> Kebijakan perusahaan harus diprioritaskan untuk mengendalikan <span className="font-bold text-blue-700">{result.global_insights.primary_driver}</span>, karena faktor ini memiliki korelasi tertinggi terhadap kelelahan karyawan.
                      </div>
                    </div>
                  </div>

                  {/* Risk Distribution Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        Distribusi Kategori Risiko
                      </h2>
                      <p className="text-xs text-slate-400">
                        Pembagian karyawan berdasarkan skor probabilitas risiko burnout.
                      </p>
                    </div>

                    <div className="space-y-4 py-2">
                      {[
                        { label: "Tinggi", labelText: "Risiko Tinggi", count: result.global_insights.risk_distribution.Tinggi, color: "bg-rose-500", text: "text-rose-700" },
                        { label: "Sedang", labelText: "Risiko Sedang", count: result.global_insights.risk_distribution.Sedang, color: "bg-amber-500", text: "text-amber-700" },
                        { label: "Rendah", labelText: "Risiko Rendah", count: result.global_insights.risk_distribution.Rendah, color: "bg-emerald-500", text: "text-emerald-700" }
                      ].map((item) => {
                        const percent = (item.count / result.global_insights.total_analyzed) * 100;
                        return (
                          <div key={item.label} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className={`${item.text}`}>{item.labelText}</span>
                              <span className="text-slate-700">{item.count} Karyawan ({percent.toFixed(0)}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${item.color} transition-all duration-1000`} 
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-xs text-slate-400 text-center italic border-t border-slate-100 pt-3">
                      Identifikasi dini memotong risiko berkembang menjadi burnout klinis hingga 60%.
                    </div>
                  </div>

                </div>
              )}

              {/* ==================== DETAIL TABLE & PROACTIVE PLANS ==================== */}
              {result && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fadeIn">
                  {/* Table Header / Toolbar */}
                  <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/40">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">📋 Hasil Penilaian Proaktif Karyawan</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Daftar analisis risiko detail dan rekomendasi pencegahan burnout per individu.</p>
                    </div>

                    {/* Search, Filter & Export */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        Export Excel
                      </button>
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Cari karyawan..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-52 bg-white"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl">
                        <span>Risiko:</span>
                        <select
                          value={riskFilter}
                          onChange={(e) => setRiskFilter(e.target.value)}
                          className="font-semibold text-slate-700 outline-none bg-transparent cursor-pointer"
                        >
                          <option value="Semua">Semua Tingkat</option>
                          <option value="Tinggi">Tinggi</option>
                          <option value="Sedang">Sedang</option>
                          <option value="Rendah">Rendah</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Employee List Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold border-b border-slate-100">
                          <th className="px-6 py-4 text-left w-12">#</th>
                          <th className="px-6 py-4 text-left">Karyawan</th>
                          <th className="px-6 py-4 text-center">Skor Risiko</th>
                          <th className="px-6 py-4 text-center">Tingkat Risiko</th>
                          <th className="px-6 py-4 text-left">Faktor Dominan</th>
                          <th className="px-6 py-4 text-center w-32">Rekomendasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                        {filteredRecommendations.length > 0 ? (
                          filteredRecommendations.map((rec) => {
                            const isExpanded = expandedRows[rec.row_index];
                            return (
                              <tr key={rec.row_index} className="contents">
                                <tr 
                                  className={`hover:bg-slate-50/40 transition-colors duration-150 cursor-pointer ${isExpanded ? "bg-blue-50/20" : ""}`}
                                  onClick={() => toggleRow(rec.row_index)}
                                >
                                  <td className="px-6 py-4 font-medium text-slate-400 text-xs">
                                    {rec.row_index + 1}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="font-semibold text-slate-800">{rec.employee_name}</div>
                                    <div className="text-slate-400 text-xs">ID Pegawai #{1000 + rec.row_index}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                      <span className="font-bold text-slate-800 text-xs">{(rec.risk_score * 100).toFixed(1)}%</span>
                                      <div className="w-16 bg-slate-100 rounded-full h-1.5">
                                        <div 
                                          className={`h-1.5 rounded-full ${
                                            rec.risk_level === "Tinggi" ? "bg-rose-500" :
                                            rec.risk_level === "Sedang" ? "bg-amber-500" :
                                            "bg-emerald-500"
                                          }`}
                                          style={{ width: `${rec.risk_score * 100}%` }}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    {getRiskBadge(rec.risk_level)}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                      {getFactorIcon(rec.dominant_factor)}
                                      {rec.dominant_factor}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleRow(rec.row_index);
                                      }}
                                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-2.5 py-1.5 rounded-lg transition-colors duration-200"
                                    >
                                      {isExpanded ? (
                                        <>Tutup <ChevronUp className="w-3.5 h-3.5" /></>
                                      ) : (
                                        <>Tindakan <ChevronDown className="w-3.5 h-3.5" /></>
                                      )}
                                    </button>
                                  </td>
                                </tr>
                                {/* Expanded Recommendations Row */}
                                {isExpanded && (
                                  <tr className="bg-slate-50/30 border-l-2 border-blue-500 animate-slideDown">
                                    <td colSpan="6" className="px-6 py-5">
                                      <div className="space-y-3">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-2">
                                          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 bg-blue-50/80 w-max px-2.5 py-1 rounded-md">
                                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                                            <span>Langkah Pencegahan &amp; Intervensi Proaktif (Rekomendasi HRD):</span>
                                          </div>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handlePrint(rec);
                                            }}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors duration-200 shadow-sm self-start md:self-auto"
                                          >
                                            <Printer className="w-3.5 h-3.5 text-blue-600" />
                                            Cetak Laporan
                                          </button>
                                        </div>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1">
                                          {rec.recommendations.map((s, i) => {
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
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                              <span className="text-sm font-semibold">Karyawan tidak ditemukan</span>
                              <p className="text-xs mt-1">Gunakan kata kunci atau filter tingkat risiko lain.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================== DECISION TREE VISUALIZATION ==================== */}
              {result?.tree_image_url && (
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-fadeIn space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-blue-600" />
                      Visualisasi Alur Klasifikasi Pohon Keputusan (Decision Tree)
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Diagram ini menjelaskan secara matematis bagaimana algoritma melatih data untuk memutuskan tingkat risiko burnout (max depth dioptimasi untuk interpretasi).
                    </p>
                  </div>
                  
                  <div className="border border-slate-150 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                    <img
                      src={`${result.tree_image_url}?t=${new Date().getTime()}`}
                      alt="Decision Tree"
                      className="max-h-[500px] object-contain hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
                    />
                  </div>
                  <div className="text-center text-xs text-slate-400 font-medium">
                    💡 Klik kanan gambar untuk mengunduh diagram pohon dalam resolusi penuh.
                  </div>
                </div>
              )}

              {/* ==================== INTRO / GUIDE STATE ==================== */}
              {!result && (
                <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 border border-blue-100 animate-pulse">
                    <FileSpreadsheet className="w-10 h-10 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Mulai Analisis Proaktif Burnout</h2>
                  <p className="text-slate-500 text-sm max-w-md mx-auto mt-2 leading-relaxed">
                    Unggah file data Excel kesehatan karyawan Anda untuk melatih model klasifikasi Decision Tree dan memperoleh wawasan preventif instan.
                  </p>
                  
                  <div className="mt-8 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 max-w-xl text-left space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-blue-600" />
                      Format Kolom Excel yang Dibutuhkan:
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100 font-semibold text-slate-700">
                        <code className="text-blue-600 font-bold block mb-1">Tingkat Stres</code>
                        Skor stres (1-10)
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100 font-semibold text-slate-700">
                        <code className="text-blue-600 font-bold block mb-1">Jam Kerja</code>
                        Jam kerja / hari
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100 font-semibold text-slate-700">
                        <code className="text-blue-600 font-bold block mb-1">Kualitas Tidur</code>
                        Kualitas tidur (1-10)
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100 font-semibold text-slate-700">
                        <code className="text-rose-600 font-bold block mb-1">Nama Karyawan</code>
                        Nama Pegawai
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                      <span>Opsional: Tambahkan kolom <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700 text-[10px]">Burnout</code> (0 atau 1) untuk melatih ulang model kecerdasan buatan.</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ==================== TAB CONTENT: HISTORICAL IDENTIFIED EMPLOYEES ==================== */}
          {activeTab === "history" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fadeIn flex flex-col">
              
              {/* Toolbar Histori */}
              <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/40">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    Database Karyawan Teridentifikasi
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Daftar riwayat seluruh karyawan yang pernah diidentifikasi risikonya dan tersimpan di database.
                  </p>
                </div>

                {/* Kontrol Pencarian & Filter */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama karyawan..."
                      value={historySearchTerm}
                      onChange={(e) => setHistorySearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-52 bg-white"
                    />
                  </div>

                  {/* Filter Risiko */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl">
                    <span>Risiko:</span>
                    <select
                      value={historyRiskFilter}
                      onChange={(e) => setHistoryRiskFilter(e.target.value)}
                      className="font-semibold text-slate-700 outline-none bg-transparent cursor-pointer"
                    >
                      <option value="Semua">Semua Tingkat</option>
                      <option value="Tinggi">Tinggi</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Rendah">Rendah</option>
                    </select>
                  </div>

                  {/* Tombol Reload */}
                  <button
                    onClick={fetchHistory}
                    disabled={historyLoading}
                    className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors duration-200"
                    title="Refresh data"
                  >
                    <RefreshCcw className={`w-4 h-4 text-slate-600 ${historyLoading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Tabel Histori Karyawan */}
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold border-b border-slate-100">
                      <th className="px-6 py-4 text-left w-12">#</th>
                      <th className="px-6 py-4 text-left">Karyawan</th>
                      <th className="px-6 py-4 text-center">Parameter Kesehatan</th>
                      <th className="px-6 py-4 text-center">Skor Risiko</th>
                      <th className="px-6 py-4 text-center">Tingkat Risiko</th>
                      <th className="px-6 py-4 text-left">Faktor Dominan</th>
                      <th className="px-6 py-4 text-center w-40">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                    {historyLoading ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                          <RefreshCw className="w-8 h-8 mx-auto mb-2 text-blue-500 animate-spin" />
                          <span className="text-sm font-semibold">Memuat database riwayat...</span>
                        </td>
                      </tr>
                    ) : filteredHistory.length > 0 ? (
                      filteredHistory.map((item, idx) => {
                        const isExpanded = expandedHistoryRows[item.id];
                        const recList = getProactiveRecommendations(item.risk_level, item.dominant_factor);
                        return (
                          <tr key={item.id} className="contents">
                            <tr 
                              className={`hover:bg-slate-50/40 transition-colors duration-150 cursor-pointer ${isExpanded ? "bg-blue-50/20" : ""}`}
                              onClick={() => toggleHistoryRow(item.id)}
                            >
                              <td className="px-6 py-4 font-medium text-slate-400 text-xs">
                                {idx + 1}
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-slate-800">{item.employee_name}</div>
                                <div className="text-slate-400 text-xs flex items-center gap-1.5 mt-0.5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-3 text-xs">
                                  <div className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 flex flex-col items-center">
                                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wide">Stres</span>
                                    <span className="font-extrabold text-violet-600">{item.stress_level}/10</span>
                                  </div>
                                  <div className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 flex flex-col items-center">
                                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wide">Kerja</span>
                                    <span className="font-extrabold text-amber-600">{item.work_hours} jam</span>
                                  </div>
                                  <div className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 flex flex-col items-center">
                                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wide">Tidur</span>
                                    <span className="font-extrabold text-sky-600">{item.sleep_quality}/10</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col items-center justify-center gap-1">
                                  <span className="font-bold text-slate-800 text-xs">{(item.risk_score * 100).toFixed(1)}%</span>
                                  <div className="w-16 bg-slate-100 rounded-full h-1.5">
                                    <div 
                                      className={`h-1.5 rounded-full ${
                                        item.risk_level === "Tinggi" ? "bg-rose-500" :
                                        item.risk_level === "Sedang" ? "bg-amber-500" :
                                        "bg-emerald-500"
                                      }`}
                                      style={{ width: `${item.risk_score * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                {getRiskBadge(item.risk_level)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                  {getFactorIcon(item.dominant_factor)}
                                  {item.dominant_factor}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleHistoryRow(item.id);
                                    }}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-2.5 py-1.5 rounded-lg transition-colors duration-200"
                                  >
                                    {isExpanded ? (
                                      <>Tutup <ChevronUp className="w-3.5 h-3.5" /></>
                                    ) : (
                                      <>Tindakan <ChevronDown className="w-3.5 h-3.5" /></>
                                    )}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteHistory(item.id);
                                    }}
                                    className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-rose-100"
                                    title="Hapus data karyawan"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                            
                            {/* Expanded Recommendations Row */}
                            {isExpanded && (
                              <tr className="bg-slate-50/30 border-l-2 border-blue-500 animate-slideDown">
                                <td colSpan="7" className="px-6 py-5">
                                  <div className="space-y-3">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-2">
                                      <div className="flex items-center gap-2 text-xs font-bold text-blue-800 bg-blue-50/80 w-max px-2.5 py-1 rounded-md">
                                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                                        <span>Langkah Pencegahan &amp; Intervensi Proaktif (Rekomendasi HRD):</span>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handlePrint(item);
                                        }}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors duration-200 shadow-sm self-start md:self-auto"
                                      >
                                        <Printer className="w-3.5 h-3.5 text-blue-600" />
                                        Cetak Laporan
                                      </button>
                                    </div>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1">
                                      {recList.map((s, i) => {
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
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                          <span className="text-sm font-semibold">Riwayat identifikasi kosong</span>
                          <p className="text-xs mt-1">Gunakan kata kunci lain atau unggah berkas Excel baru terlebih dahulu.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
              <span className="text-xs font-bold text-slate-400 block uppercase">Tanggal Identifikasi</span>
              <span className="text-sm font-semibold text-slate-700">
                {new Date(printEmployee.created_at || new Date()).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">ID Pegawai</span>
              <span className="text-sm font-semibold text-slate-700">#{1000 + (printEmployee.row_index || 0)}</span>
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
