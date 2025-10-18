import{ BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "../components/loader";
import { lazy, Suspense } from "react";
import HomeLayout from "../layouts/homeLayout";
import Layout from "../layouts/layout";


const Dashboard= lazy(() => import("../pages/dashboardPage"));
const Statistic= lazy(() => import("../pages/statisticPage"));
const Identification = lazy(() => import("../pages/identificationPage"));
const Survei = lazy(() => import("../pages/surveiPage"));
const Home = lazy(() => import("../pages/homePage"));
const Question = lazy(() => import("../pages/questionPage"));
const Profile = lazy(() => import("../pages/profilePage"));
const Gallery = lazy(() => import("../pages/galleryPage"));
const Login = lazy(() => import("../pages/loginPage"));


function AppRoutes() {
    return(
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route element={<HomeLayout />}>
                    <Route path="/survei" element={<Survei />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/gallery" element={<Gallery/>}/>
                </Route>
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/statistic" element={<Statistic />} />
                    <Route path="/identification" element={<Identification />} />
                    <Route path="/question" element={<Question />} />
                </Route>
            </Routes>
        </Suspense>
    );
}

export default AppRoutes;