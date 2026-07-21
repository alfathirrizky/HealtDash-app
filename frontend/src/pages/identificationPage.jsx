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
  Sparkles,
  Printer,
  HelpCircle,
  Database
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
  const [activeTab, setActiveTab] = useState("dashboard");

  // State khusus untuk cetak laporan per karyawan
  const [printEmployee, setPrintEmployee] = useState(null);




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
    } catch (err) {
      console.error("Upload error:", err);
      alert("Gagal memproses file. Pastikan server Express (Port 5000) dan Python FastAPI (Port 8000) berjalan!");
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (idx) => {
    setExpandedRows(prev => ({
      ...prev,
      [idx]: !prev[idx]
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

          {/* ==================== CONTENT: UPLOAD & ACTIVE ANALYSIS ==================== */}
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
                  
                  {/* Penjelasan Cara Membaca Decision Tree */}
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2 mt-2">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      Cara Membaca Diagram Decision Tree
                    </h3>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                      <li><strong>Kotak Teratas (Root Node):</strong> Merupakan faktor penentu utama yang paling kuat mempengaruhi risiko burnout pada dataset Anda.</li>
                      <li><strong>Garis (Cabang):</strong> Merepresentasikan kriteria pemisahan (misal: <code>Tingkat Stres &lt;= 5.5</code>). Cabang ke kiri jika kriteria terpenuhi (True), ke kanan jika tidak (False).</li>
                      <li><strong>Kotak Bawah (Leaf Node):</strong> Menunjukkan hasil akhir kelompok karyawan. Menampilkan jumlah sampel (karyawan) yang masuk dalam kategori tersebut dan probabilitas prediksi kelasnya.</li>
                      <li><strong>Warna Kotak:</strong> Mengindikasikan kategori (kelas) mayoritas di dalam kotak tersebut. Intensitas atau kepekatan warna menunjukkan seberapa pasti (murni) kelompok tersebut.</li>
                    </ul>
                  </div>

                  <div className="text-center text-xs text-slate-400 font-medium pt-2">
                    ðŸ’¡ Klik kanan gambar untuk mengunduh diagram pohon dalam resolusi penuh.
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
        </div>
      </div>
    </>
  );
}
