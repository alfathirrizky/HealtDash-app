import { useEffect, useState } from "react";
import axios from "axios";

function useSurvey() {
    const [surveys, setSurveys] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/surveys")
            .then((res) => setSurveys(res.data))
            .catch((err) => console.error("Error fetching surveys:", err));
    }, []);
    return surveys;
}

export default useSurvey;