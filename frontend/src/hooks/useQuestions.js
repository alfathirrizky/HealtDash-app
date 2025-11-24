import { useEffect, useState } from "react";
import axios from "axios";

function useQuestions() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/questions")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);
  return questions;
}
export default useQuestions;
