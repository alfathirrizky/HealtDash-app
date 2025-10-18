import Sidebar from "./components/sidebar";
import Layout from "./layouts/layout";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";


function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;