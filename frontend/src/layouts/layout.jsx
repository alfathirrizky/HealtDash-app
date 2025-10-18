import Sidebar from "../components/sidebar";
import AppRoutes from "../routes/AppRoutes";
import { Outlet } from "react-router-dom";

function Layout() {
    return(
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;