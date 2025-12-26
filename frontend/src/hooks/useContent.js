import { useEffect, useState } from "react";
import axios from "axios";

function useContent() {
    const [contents, setContents] = useState([]);
    useEffect(()=>{
        axios
        .get("http://localhost:5000/api/gallery")
        .then(response => setContents(response.data))
        .catch(error => console.error("Error fetching contents:", error));
    },[]);
    return contents;
}

export default useContent;