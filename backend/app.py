from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from io import BytesIO

app = FastAPI()

# CORS supaya React bisa akses API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ganti "*" dengan domain React kalau sudah deploy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-excel/")
async def upload_excel(file: UploadFile = File(...)):
    # Baca file Excel
    contents = await file.read()
    df = pd.read_excel(BytesIO(contents))

    # Asumsi ada kolom: stress_level, work_hours, sleep_quality, burnout
    features = ["stress_level", "work_hours", "sleep_quality"]
    target = "burnout"

    if not all(col in df.columns for col in features + [target]):
        return {"error": "Pastikan Excel berisi kolom: stress_level, work_hours, sleep_quality, burnout"}

    # Pisahkan data training & testing
    X = df[features]
    y = df[target]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train Decision Tree
    clf = DecisionTreeClassifier()
    clf.fit(X_train, y_train)

    # Hitung akurasi
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    # Prediksi semua data
    all_predictions = clf.predict(X)

    # Return JSON ke React
    return {
        "accuracy": float(accuracy),
        "predictions": all_predictions.tolist()
    }