import{ BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "../components/loader";
import { lazy, Suspense } from "react";
import HomeLayout from "../layouts/homeLayout";
import Layout from "../layouts/layout";


const Dashboard= lazy(() => import("../pages/dashboardPage"));
const GalleryDash= lazy(() => import("../pages/galleryDashPage"));
const Identification = lazy(() => import("../pages/identificationPage"));
const Survei = lazy(() => import("../pages/surveiPage"));
const SurveiContent = lazy(() => import("../pages/surveiContentPage"));
const Home = lazy(() => import("../pages/homePage"));
const Question = lazy(() => import("../pages/questionPage"));
const Profile = lazy(() => import("../pages/profilePage"));
const Content = lazy(() => import("../pages/contentPage"));
const Login = lazy(() => import("../pages/loginPage"));
const User = lazy(() => import("../pages/userPage"));
const CreateUserPage = lazy(() => import("../pages/createUserPage"));
const CreateQuestionPage = lazy(() => import("../pages/createQuestionPage"));
const CreateGalleryPage = lazy(() => import("../pages/createGalleryPage"));


function AppRoutes() {
    return(
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route element={<HomeLayout />}>
                    <Route path="/survei" element={<Survei />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/content" element={<Content/>}/>
                    <Route path="/survei/content" element={<SurveiContent/>}/>
                </Route>
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/galleryDash" element={<GalleryDash />} />
                    <Route path="/galleryDash/create" element={<CreateGalleryPage />} />
                    <Route path="/identification" element={<Identification />} />
                    <Route path="/question" element={<Question />} />
                    <Route path="/question/create" element={<CreateQuestionPage />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/users/create" element={<CreateUserPage />} />
                </Route>
            </Routes>
        </Suspense>
    );
}

export default AppRoutes;