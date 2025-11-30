import { useState } from "react";
import axios from "axios";

export default function UploadExcel() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
      const res = await axios.post("http://127.0.0.1:8000/upload-excel/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Gagal memproses file. Periksa backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-5">
      <div className="flex flex-col gap-5 scrollbar-none scroll-smooth overflow-y-auto h-[89vh]">
        <h1 className="text-xl font-bold mb-4">Upload Data Excel</h1>
        <div className="flex items-center gap-4 mb-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="border p-2 rounded"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Upload & Process"}
          </button>
        </div>
        {/* ======= Accuracy & Predictions ======= */}
        {result && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">📊 Hasil Decision Tree</h2>
            <p className="mb-4">
              <span className="font-bold">Accuracy:</span>{" "}
              {(result.accuracy * 100).toFixed(2)}%
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-100">
                <thead className="bg-blue-400">
                  <tr>
                    <th className="border px-4 py-2 text-white">Index</th>
                    <th className="border px-4 py-2 text-white">Prediction</th>
                  </tr>
                </thead>
                <tbody>
                  {result.predictions?.map((pred, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="border px-4 py-2">{idx + 1}</td>
                      <td className="border px-4 py-2">{pred}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* ======= Rekomendasi HRD ======= */}
            {result.hr_recommendations && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Rekomendasi Tindakan HRD</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-100">
                    <thead className="bg-blue-400">
                      <tr>
                        <th className="border px-4 py-2 text-white">Index</th>
                        <th className="border px-4 py-2 text-white">Faktor Dominan</th>
                        <th className="border px-4 py-2 text-white">Rekomendasi Tindakan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.hr_recommendations.map((rec, idx) => (
                        <tr key={idx} className="align-top">
                          <td className="border px-4 py-2 text-center">
                            {rec.row_index + 1}
                          </td>
                          <td className="border px-4 py-2 font-medium">
                            {rec.dominant_factor}
                          </td>
                          <td className="border px-4 py-2">
                            <ul className="list-disc list-inside space-y-1">
                              {rec.recommendations.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        {/* ======= Decision Tree Image ======= */}
        {result?.tree_image_url && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Visualisasi Decision Tree</h2>
            <img
              src={result.tree_image_url}
              alt="Decision Tree"
              className="border rounded shadow-md max-w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}