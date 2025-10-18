import { useState, useRef } from "react";
import * as XLSX from "xlsx";

export default function ExcelInput({ onData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null); // array of objects
  const fileRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const handleFiles = async (file) => {
    setError("");
    if (!file) return;

    // Validasi tipe
    const allowed = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];
    if (!allowed.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setError("Tipe file tidak didukung. Gunakan .xlsx/.xls/.csv");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Ukuran file terlalu besar (maksimal 5 MB).");
      return;
    }

    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });

      // Ambil sheet pertama
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Konversi ke JSON. header: 1 untuk array of arrays, atau default untuk objects.
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      setPreview(jsonData);

      // Callback ke parent (opsional)
      if (onData) onData(jsonData);
    } catch (err) {
      console.error(err);
      setError("Gagal memproses file Excel. Pastikan file valid.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFiles(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFiles(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const clearPreview = () => {
    setPreview(null);
    setError("");
    fileRef.current.value = null;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-shadow duration-200 hover:shadow-lg"
      >
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleInputChange}
          className="hidden"
          id="excel-input"
        />
        <label
          htmlFor="excel-input"
          className="inline-block cursor-pointer px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
        >
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span className="font-medium text-gray-700">Klik atau tarik file Excel ke sini</span>
          </div>
        </label>

        <p className="mt-3 text-sm text-gray-500">Format yang didukung: .xlsx, .xls, .csv — Maks 5 MB</p>

        {/* Tombol clear */}
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={() => fileRef.current.click()}
            className="px-4 py-2 bg-white border rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            Pilih File
          </button>
          <button
            onClick={clearPreview}
            className="px-4 py-2 bg-red-50 text-red-600 border rounded-lg hover:bg-red-100 transition-colors duration-200"
          >
            Clear
          </button>
        </div>

        {loading && (
          <div className="mt-4 text-gray-600">Memproses file... (loading)</div>
        )}

        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>

      {/* Preview tabel */}
      {preview && preview.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Preview Data ({preview.length} baris)</h3>
            <button
              onClick={() => {
                // contoh: kirim data ke backend
                // fetch('/api/upload', { method: 'POST', body: JSON.stringify(preview) })
                console.log("Data siap dikirim:", preview);
                alert("Contoh: data dicetak ke console. Implementasikan pengiriman ke backend sesuai kebutuhan.");
              }}
              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
            >
              Kirim Data
            </button>
          </div>

          <div className="mt-3 overflow-auto border rounded-md">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(preview[0]).map((col) => (
                    <th key={col} className="px-3 py-2 text-left text-sm font-medium text-gray-600">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 50).map((row, ri) => (
                  <tr
                    key={ri}
                    className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {Object.keys(preview[0]).map((col) => (
                      <td key={col} className="px-3 py-2 text-sm text-gray-700">
                        {String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.length > 50 && (
              <div className="p-2 text-sm text-gray-500">Menampilkan 50 baris pertama dari {preview.length} baris.</div>
            )}
          </div>
        </div>
      )}

      {preview && preview.length === 0 && (
        <div className="mt-4 text-gray-600">File diproses tapi tidak ada data yang ditemukan.</div>
      )}
    </div>
  );
}
