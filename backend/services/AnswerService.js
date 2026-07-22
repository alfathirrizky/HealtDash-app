import axios from "axios";
import { PYTHON_API_URL } from "../config/index.js";

class AnswerService {
  constructor(answerModel) {
    this.answerModel = answerModel;
  }

  async getAllAnswers() {
    return await this.answerModel.findAll();
  }

  async getSurveyResults() {
    return await this.answerModel.findSurveyResults();
  }

  async getDetailedAnswers() {
    return await this.answerModel.findDetailedAnswers();
  }

  async getHistoryByUserId(userId) {
    return await this.answerModel.findHistoryByUserId(userId);
  }

  async submitAnswers(survey_id, answers, user_id) {
    if (!survey_id || !answers || !Array.isArray(answers)) {
      throw new Error("Invalid data");
    }
    const values = answers.map((item) => [
      survey_id,
      item.question_id,
      user_id,
      item.answer,
    ]);
    
    await this.answerModel.insertMany(values);

    // Ambil nama pengguna
    const users = await this.answerModel.findUserById(user_id);
    const userName = users.length > 0 ? users[0].name : "Karyawan";

    // Cek data existing untuk menggabungkan hasil (gunakan user_id)
    const existing = await this.answerModel.findSurveyResultByUserId(user_id);

    // Jalankan prediksi burnout proaktif untuk setiap survei
    let stress_level = existing.length > 0 ? existing[0].stress_level : 0;
    let work_hours = existing.length > 0 ? existing[0].work_hours : 0;
    let sleep_quality = existing.length > 0 ? existing[0].sleep_quality : 0;

    // Ambil detail pertanyaan untuk mencocokkan question_id dengan nama field (stress_level, work_hours, sleep_quality)
    const questions = await this.answerModel.findQuestionsBySurveyId(survey_id);

    // Ambil kategori survei
    const surveys = await this.answerModel.findSurveyCategory(survey_id);
    const surveyCategory = surveys.length > 0 ? String(surveys[0].category).toLowerCase() : "";

    let stressSum = 0, stressCount = 0;
    let workSum = 0, workCount = 0;
    let sleepSum = 0, sleepCount = 0;

    answers.forEach((ans) => {
      const q = questions.find((item) => String(item.question_id) === String(ans.question_id));
      if (q) {
        const nameStr = String(q.name || "").toLowerCase();
        const labelStr = String(q.label || "").toLowerCase();
        const qType = String(q.type || "").toLowerCase();
        
        // Prioritaskan kategori survei jika ada, jika tidak cek nama dan label pertanyaan
        const isStress = surveyCategory.includes("stres") || surveyCategory.includes("burnout") || 
                         nameStr === "stress_level" || nameStr.includes("stres") || 
                         labelStr.includes("stres") || labelStr.includes("cemas") || 
                         labelStr.includes("tekanan") || labelStr.includes("lelah") || 
                         labelStr.includes("burnout");
                         
        const isWork = surveyCategory.includes("jam kerja") || surveyCategory.includes("waktu") || 
                       nameStr === "work_hours" || nameStr.includes("jam kerja") || 
                       labelStr.includes("jam kerja") || labelStr.includes("waktu") || 
                       labelStr.includes("jam");
                       
        const isSleep = surveyCategory.includes("tidur") || surveyCategory.includes("istirahat") || 
                        nameStr === "sleep_quality" || nameStr.includes("tidur") || 
                        nameStr.includes("istirahat") || labelStr.includes("tidur") || 
                        labelStr.includes("istirahat");

        const getScaledValue = (rawValue, type, category) => {
            let val = parseFloat(rawValue);
            if (isNaN(val)) return 0;
            // Jika tipe bukan standar, kemungkinan menggunakan skala 1-5 dari SurveiCard
            if (category === 'stress' && qType !== 'stress_level' && qType !== 'sleep_quality') {
                return val <= 5 ? val * 2 : val; // Skala 1-5 -> 1-10
            }
            if (category === 'sleep' && qType !== 'stress_level' && qType !== 'sleep_quality') {
                return val <= 5 ? val * 2 : val; // Skala 1-5 -> 1-10
            }
            if (category === 'work' && qType !== 'work_hours') {
                // Skala 1-5 -> 6-12 jam (1: 6, 2: 7.5, 3: 9, 4: 10.5, 5: 12)
                return val <= 5 ? 6 + ((val - 1) * 1.5) : val;
            }
            return val;
        };

        // Evaluasi berurutan berdasarkan kecocokan (Kualitas Tidur dan Jam Kerja didahulukan jika kategori spesifik, jika tidak ikuti urutan)
        if (isSleep && (surveyCategory.includes("tidur") || surveyCategory.includes("istirahat") || !isStress)) {
            sleepSum += getScaledValue(ans.answer, qType, 'sleep');
            sleepCount++;
        }
        else if (isWork && (surveyCategory.includes("jam kerja") || surveyCategory.includes("waktu") || !isStress)) {
            workSum += getScaledValue(ans.answer, qType, 'work');
            workCount++;
        }
        else if (isStress) {
            stressSum += getScaledValue(ans.answer, qType, 'stress');
            stressCount++;
        }
        else if (isSleep) { // Fallback jika isSleep true tapi tertahan kondisi pertama
            sleepSum += getScaledValue(ans.answer, qType, 'sleep');
            sleepCount++;
        }
        else if (isWork) { // Fallback untuk isWork
            workSum += getScaledValue(ans.answer, qType, 'work');
            workCount++;
        }
      }
    });

    if (stressCount > 0) stress_level = Math.round(stressSum / stressCount);
    if (workCount > 0) work_hours = Math.round((workSum / workCount) * 10) / 10;
    if (sleepCount > 0) sleep_quality = Math.round(sleepSum / sleepCount);

    let rec = { risk_score: 0, risk_level: "Rendah", dominant_factor: "Prediksi Offline" };

    // Panggil API Python untuk melakukan prediksi
    try {
      const response = await axios.post(`${PYTHON_API_URL}/predict/`, {
        stress_level,
        work_hours,
        sleep_quality,
      });

      rec = response.data;
    } catch (err) {
      console.error("❌ Python prediction call failed:", err.message);
      // Fallback sederhana jika Python server mati
      let prob = (stress_level * 0.4 + (work_hours > 8 ? (work_hours - 8) * 0.5 : 0) + (10 - sleep_quality) * 0.3) / 10;
      if (prob > 1) prob = 1;
      if (prob < 0) prob = 0;
      
      let risk_level = "Rendah";
      if (prob > 0.7) risk_level = "Tinggi";
      else if (prob >= 0.3) risk_level = "Sedang";
      
      rec = {
        risk_score: prob,
        risk_level: risk_level,
        dominant_factor: "Stres / Beban Kerja (Prediksi Offline)"
      };
    }

    // Simpan hasil klasifikasi ke tabel survey_results (relasi user_id)
    if (existing.length > 0) {
      await this.answerModel.updateSurveyResult(
        user_id, userName, stress_level, work_hours, sleep_quality, rec.risk_score, rec.risk_level, rec.dominant_factor
      );
    } else {
      await this.answerModel.insertSurveyResult(
        userName, user_id, stress_level, work_hours, sleep_quality, rec.risk_score, rec.risk_level, rec.dominant_factor
      );
    }
    console.log(`🚀 Burnout prediction saved for ${userName}: Risk Level = ${rec.risk_level}`);
    
    return { message: "Survey submitted successfully" };
  }
}

export default AnswerService;
