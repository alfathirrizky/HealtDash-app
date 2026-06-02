# pyrefly: ignore [missing-import]
from fastapi import FastAPI, UploadFile, File
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from fastapi.responses import FileResponse
# pyrefly: ignore [missing-import]
import pandas as pd
# pyrefly: ignore [missing-import]
from sklearn.tree import DecisionTreeClassifier, export_graphviz
# pyrefly: ignore [missing-import]
from sklearn.model_selection import train_test_split
# pyrefly: ignore [missing-import]
from sklearn.metrics import accuracy_score
from io import BytesIO
# pyrefly: ignore [missing-import]
import pydot
import os
from pydantic import BaseModel

# Global Decision Tree classifier instance
clf_model = None

def train_default_model():
    global clf_model
    excel_path = "../data_uji_burnout.xlsx"
    features = ["stress_level", "work_hours", "sleep_quality"]
    target = "burnout"
    if os.path.exists(excel_path):
        try:
            df = pd.read_excel(excel_path)
            X = df[features]
            y = df[target]
            clf_model = DecisionTreeClassifier(max_depth=4, min_samples_split=5, min_samples_leaf=2, random_state=42)
            clf_model.fit(X, y)
            print("Model successfully trained on startup using data_uji_burnout.xlsx")
        except Exception as e:
            print(f"Error training model on startup: {e}")

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    train_default_model()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    stress_level: int
    work_hours: float
    sleep_quality: int

@app.post("/predict/")
async def predict_single(req: PredictRequest):
    global clf_model
    if clf_model is None:
        train_default_model()
    if clf_model is None:
        return {"error": "Model not trained. Please upload an Excel file first."}
    
    # Predict probability for class 1 (burnout)
    row = {
        "stress_level": req.stress_level,
        "work_hours": req.work_hours,
        "sleep_quality": req.sleep_quality
    }
    
    df_input = pd.DataFrame([row])
    
    classes_list = clf_model.classes_.tolist()
    if 1 in classes_list:
        class_1_idx = classes_list.index(1)
        prob = float(clf_model.predict_proba(df_input)[0, class_1_idx])
    else:
        prob = 0.0
        
    pred = int(clf_model.predict(df_input)[0])
    
    # Classification of risk level
    if prob > 0.7:
        risk_level = "Tinggi"
    elif prob >= 0.3:
        risk_level = "Sedang"
    else:
        risk_level = "Rendah"
        
    rec = get_proactive_recommendation(row, risk_level)
    
    return {
        "risk_score": prob,
        "risk_level": risk_level,
        "dominant_factor": rec["dominant_factor"],
        "recommendations": rec["recommendations"],
        "prediction": pred
    }

def get_proactive_recommendation(row, risk_level):
    # Menentukan faktor paling dominan per pegawai
    factors = {
        "Stress Level": row["stress_level"],
        "Work Hours": row["work_hours"],
        "Sleep Quality": (10 - row["sleep_quality"])  # Semakin kecil kualitas tidur, semakin buruk
    }
    dominant_factor = max(factors, key=factors.get)

    # Rekomendasi disesuaikan dengan tingkat risiko dan faktor dominan
    if risk_level == "Tinggi":
        if dominant_factor == "Stress Level":
            factor_desc = "Tingkat Stres Kerja Sangat Tinggi (Kritis)"
            suggestions = [
                "Tindakan Darurat: Berikan cuti mental wajib selama 2-3 hari kerja.",
                "Lakukan konseling/konsultasi psikologis secara privat yang difasilitasi perusahaan.",
                "Intervensi Manajemen: Pindahkan sebagian tanggung jawab proyek kritis ke rekan kerja lain.",
                "Jadwalkan pertemuan empat mata (1-on-1) segera untuk mendengarkan hambatan kerja mereka."
            ]
        elif dominant_factor == "Work Hours":
            factor_desc = "Kelebihan Jam Kerja Ekstrim (Overwork Kritis)"
            suggestions = [
                "Tindakan Darurat: Hentikan akses lembur atau pekerjaan luar jam kantor segera.",
                "Delegasikan ulang tugas mendesak untuk mengurangi beban kerja hingga 30%.",
                "Wajibkan karyawan mengambil cuti pemulihan dalam minggu ini.",
                "Lakukan audit beban kerja bulanan untuk menganalisis mengapa terjadi overwork."
            ]
        else:  # Sleep Quality
            factor_desc = "Kualitas Tidur Buruk & Kelelahan Akut"
            suggestions = [
                "Tindakan Darurat: Berikan dispensasi keterlambatan mulai kerja atau opsi Work From Home (WFH).",
                "Batasi penugasan shift malam atau rapat di pagi hari.",
                "Kurangi target output harian agar karyawan memiliki waktu istirahat yang cukup.",
                "Sarankan pemeriksaan kesehatan/medical check-up gratis."
            ]
    elif risk_level == "Sedang":
        if dominant_factor == "Stress Level":
            factor_desc = "Stres Kerja Meningkat (Lampu Kuning)"
            suggestions = [
                "Proaktif: Berikan sesi coaching manajemen stres & prioritas tugas.",
                "Evaluasi keselarasan target kinerja (KPI) agar lebih realistis.",
                "Ajak berpartisipasi dalam program kebugaran mental (mindfulness/wellness) kantor.",
                "Diskusikan potensi pembagian tugas jika beban dirasa mulai berat."
            ]
        elif dominant_factor == "Work Hours":
            factor_desc = "Jam Kerja Melebihi Batas Ideal"
            suggestions = [
                "Proaktif: Terapkan kebijakan 'Right to Disconnect' setelah jam kerja.",
                "Bantu karyawan membuat prioritas harian untuk menghindari penumpukan pekerjaan.",
                "Batasi waktu lembur maksimal 5 jam per minggu.",
                "Pastikan hak istirahat makan siang dan rehat pendek dimanfaatkan penuh."
            ]
        else:  # Sleep Quality
            factor_desc = "Kualitas Tidur Mulai Menurun"
            suggestions = [
                "Proaktif: Edukasi 'sleep hygiene' dan pentingnya mematikan gadget sebelum tidur.",
                "Kurangi pengiriman pesan kerja (chat/email) di luar jam operasional.",
                "Sediakan suplemen vitamin atau fasilitas istirahat (nap room) jika memungkinkan.",
                "Tawarkan fleksibilitas jam kerja agar ritme istirahat membaik."
            ]
    else:  # Rendah
        if dominant_factor == "Stress Level":
            factor_desc = "Stres Kerja Terkendali"
            suggestions = [
                "Wellness: Pertahankan target kerja yang sehat saat ini.",
                "Apresiasi pencapaian dan kinerja karyawan untuk menjaga motivasi.",
                "Sarankan untuk ikut serta dalam aktivitas sosial tim (gathering/outing)."
            ]
        elif dominant_factor == "Work Hours":
            factor_desc = "Beban Kerja Seimbang"
            suggestions = [
                "Wellness: Berikan apresiasi atas manajemen waktu yang baik.",
                "Dorong untuk konsisten menjaga pola kerja saat ini.",
                "Pastikan karyawan terus menjaga keseimbangan kehidupan kerja (work-life balance)."
            ]
        else:  # Sleep Quality
            factor_desc = "Kualitas Istirahat Baik"
            suggestions = [
                "Wellness: Edukasi berkelanjutan mengenai gaya hidup sehat.",
                "Dukung program olahraga bersama atau keanggotaan gym dari kantor.",
                "Jaga lingkungan kerja yang kondusif untuk produktivitas yang sehat."
            ]

    return {
        "dominant_factor": factor_desc,
        "recommendations": suggestions
    }

@app.post("/upload-excel/")
async def upload_excel(file: UploadFile = File(...)):
    global clf_model
    contents = await file.read()
    df = pd.read_excel(BytesIO(contents))

    features = ["stress_level", "work_hours", "sleep_quality"]
    target = "burnout"

    if not all(col in df.columns for col in features + [target]):
        return {"error": "Kolom tidak lengkap! Pastikan file Excel memiliki kolom: stress_level, work_hours, sleep_quality, dan burnout."}

    X = df[features]
    y = df[target]

    # Melakukan split data secara aman berdasarkan ukuran data
    if len(df) >= 5:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        # Regularisasi Decision Tree (max_depth=4) untuk menghindari overfitting dan menyederhanakan pohon
        clf = DecisionTreeClassifier(max_depth=4, min_samples_split=5, min_samples_leaf=2, random_state=42)
        clf.fit(X_train, y_train)

        y_pred = clf.predict(X_test)
        accuracy = float(accuracy_score(y_test, y_pred))
    else:
        # Jika data terlalu sedikit, latih dengan seluruh dataset
        clf = DecisionTreeClassifier(max_depth=4, min_samples_split=5, min_samples_leaf=2, random_state=42)
        clf.fit(X, y)
        accuracy = 1.0

    clf_model = clf
    all_predictions = clf.predict(X).tolist()

    # Mendapatkan probabilitas risiko burnout untuk analisis proaktif
    classes_list = clf.classes_.tolist()
    if 1 in classes_list:
        class_1_idx = classes_list.index(1)
        probabilities = clf.predict_proba(X)[:, class_1_idx].tolist()
    else:
        # Jika tidak ada kelas burnout (1) di training data
        probabilities = [0.0] * len(df)

    # Deteksi kolom nama/identitas karyawan secara dinamis
    name_candidates = ["nama", "name", "nip", "email", "id", "employee", "pegawai", "karyawan"]
    identifier_col = None
    for col in df.columns:
        if str(col).lower() in name_candidates:
            identifier_col = col
            break

    # === GENERATE DECISION TREE IMAGE ===
    tree_available = False
    try:
        dot_data = export_graphviz(
            clf,
            out_file=None,
            feature_names=features,
            class_names=[str(c) for c in clf.classes_],
            filled=True,
            rounded=True,
            special_characters=True
        )

        (graph,) = pydot.graph_from_dot_data(dot_data)
        graph.write_png("tree_visualization.png")
        tree_available = True
    except Exception as e:
        print(f"Gagal mengekspor diagram pohon keputusan: {e}")

    # ==== Rekomendasi HR untuk setiap pegawai ====
    hr_recommendations = []
    risk_counts = {"Tinggi": 0, "Sedang": 0, "Rendah": 0}

    for idx, row in df.iterrows():
        # Dapatkan nama pegawai
        emp_name = str(row[identifier_col]) if identifier_col else f"Karyawan {idx + 1}"
        prob = probabilities[idx]

        # Klasifikasi tingkat risiko proaktif
        if prob > 0.7:
            risk_level = "Tinggi"
        elif prob >= 0.3:
            risk_level = "Sedang"
        else:
            risk_level = "Rendah"

        risk_counts[risk_level] += 1
        rec = get_proactive_recommendation(row, risk_level)

        hr_recommendations.append({
            "row_index": idx,
            "employee_name": emp_name,
            "stress_level": int(row["stress_level"]),
            "work_hours": float(row["work_hours"]),
            "sleep_quality": int(row["sleep_quality"]),
            "risk_score": float(prob),
            "risk_level": risk_level,
            "dominant_factor": rec["dominant_factor"],
            "recommendations": rec["recommendations"],
            "prediction": int(all_predictions[idx])
        })

    # Hitung kontribusi faktor (Feature Importance)
    importances = clf.feature_importances_.tolist()
    feature_importance = {features[i]: float(importances[i]) for i in range(len(features))}
    
    # Faktor kontributor utama perusahaan
    primary_driver_key = max(feature_importance, key=feature_importance.get)
    driver_labels = {
        "stress_level": "Tingkat Stres Kerja",
        "work_hours": "Jam Kerja (Overwork)",
        "sleep_quality": "Kualitas Istirahat / Tidur"
    }
    primary_driver = driver_labels.get(primary_driver_key, primary_driver_key)

    # Ringkasan insight batch untuk dashboard HRD
    actual_burnout = int((df[target] == 1).sum()) if target in df.columns else 0
    global_insights = {
        "total_analyzed": len(df),
        "actual_burnout_count": actual_burnout,
        "predicted_burnout_count": sum(1 for p in all_predictions if p == 1),
        "actual_burnout_rate": float(actual_burnout / len(df)),
        "predicted_burnout_rate": float(sum(1 for p in all_predictions if p == 1) / len(df)),
        "risk_distribution": risk_counts,
        "feature_importance": feature_importance,
        "primary_driver": primary_driver
    }

    return {
        "accuracy": float(accuracy),
        "predictions": all_predictions,
        "hr_recommendations": hr_recommendations,
        "global_insights": global_insights,
        "tree_image_url": "http://127.0.0.1:8000/tree-image" if tree_available else None,
    }


@app.get("/tree-image")
def get_tree_image():
    if os.path.exists("tree_visualization.png"):
        return FileResponse("tree_visualization.png")
    return {"error": "Diagram pohon keputusan belum di-generate atau tidak tersedia."}