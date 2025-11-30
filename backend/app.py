from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd
from sklearn.tree import DecisionTreeClassifier, export_graphviz
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from io import BytesIO
import pydot
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========= Rekomendasi HRD Berdasarkan Faktor Dominan =========
def get_hr_recommendation(row):
    # Menentukan faktor paling dominan per pegawai
    factors = {
        "Stress Level": row["stress_level"],
        "Work Hours": row["work_hours"],
        "Sleep Quality": (10 - row["sleep_quality"])  # Semakin kecil kualitas tidur, semakin buruk
    }

    dominant_factor = max(factors, key=factors.get)

    # ==== Rekomendasi berdasarkan faktor dominan ====
    recommendations = {
        "Stress Level": {
            "factor": "Stress Kerja Tinggi",
            "suggestions": [
                "Evaluasi ulang target & timeline pekerjaan.",
                "Berikan pelatihan manajemen stres & time management.",
                "Lakukan mediasi konflik jika terjadi tekanan interpersonal.",
                "Berikan cuti singkat untuk pemulihan mental."
            ],
        },
        "Work Hours": {
            "factor": "Jam Kerja Berlebihan / Overwork",
            "suggestions": [
                "Redistribusi beban kerja agar tidak menumpuk pada satu orang.",
                "Batasi lembur dan perketat kebijakan work-life balance.",
                "Atur rotasi tugas untuk mengurangi kelelahan.",
                "Anjurkan istirahat wajib atau cuti 1–2 hari."
            ],
        },
        "Sleep Quality": {
            "factor": "Kualitas Tidur Buruk",
            "suggestions": [
                "Evaluasi jam kerja yang terlalu malam atau lembur.",
                "Sediakan fleksibilitas jam mulai kerja untuk sementara.",
                "Berikan edukasi sleep hygiene.",
                "Kurangi beban kerja berat di minggu berjalan."
            ],
        }
    }

    return {
        "dominant_factor": recommendations[dominant_factor]["factor"],
        "recommendations": recommendations[dominant_factor]["suggestions"]
    }


# ===========================================================

@app.post("/upload-excel/")
async def upload_excel(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_excel(BytesIO(contents))

    features = ["stress_level", "work_hours", "sleep_quality"]
    target = "burnout"

    if not all(col in df.columns for col in features + [target]):
        return {"error": "Kolom tidak lengkap!"}

    X = df[features]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    clf = DecisionTreeClassifier()
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    all_predictions = clf.predict(X).tolist()

    # === GENERATE DECISION TREE IMAGE ===
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

    # ==== Rekomendasi HR untuk setiap pegawai ====
    hr_recommendations = []
    for idx, row in df.iterrows():
        rec = get_hr_recommendation(row)
        hr_recommendations.append({
            "row_index": idx,
            "dominant_factor": rec["dominant_factor"],
            "recommendations": rec["recommendations"]
        })

    return {
        "accuracy": float(accuracy),
        "predictions": all_predictions,
        "hr_recommendations": hr_recommendations,
        "tree_image_url": "http://127.0.0.1:8000/tree-image",
    }


@app.get("/tree-image")
def get_tree_image():
    return FileResponse("tree_visualization.png")