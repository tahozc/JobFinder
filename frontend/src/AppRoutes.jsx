import React, { Fragment } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobListings from "./pages/JobListings";
import JobListingDetail from "./pages/JobListingDetail";
import CreateJob from "./pages/CreateJob";
import DashboardJobList from "./pages/DashboardJobList";
import DashboardProfile from "./pages/DashboardProfile";
import Chat from "./pages/Chat";
// Redux
import EditJob from "./pages/EditJob";
import DashboardRoutes from "./constants/DashboardRoutes";
import ProtectedRoute from "./utils/ProtectedRoute";
import Applications from "./pages/Applications";
import Userlistings from "./pages/UserListing";
import UserDetail from "./pages/UserDetail";
import CompanyJobs from "./pages/CompanyJobs";
import JobApplicants from "./pages/JobApplicants";
import RecommendedUsers from "./pages/RecommendedUsers";
import About from "./pages/About";
import Contact from "./pages/Contact";
const AppRoutes = () => {
  const { pathname } = useLocation();
  const isDashboardRoute = DashboardRoutes.includes(pathname);

  return (
    <Fragment>
      {!isDashboardRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/userlistingdetail" element={<UserDetail />} />
        <Route path="/joblistings" element={<JobListings />} />
        <Route path="/joblistingdetail" element={<JobListingDetail />} />
        {/* Dashboard Routes */}
        <Route
          path="/createjob"
          element={<ProtectedRoute Component={CreateJob} />}
        />
        <Route
          path="/editjob"
          element={<ProtectedRoute Component={EditJob} />}
        />
        <Route
          path="/dashboardjoblist"
          element={<ProtectedRoute Component={DashboardJobList} />}
        />
        <Route
          path="/applications"
          element={<ProtectedRoute Component={Applications} />}
        />
        <Route
          path="/companyJobs"
          element={<ProtectedRoute Component={CompanyJobs} />}
        />
        <Route
          path="/jobapplicants"
          element={<ProtectedRoute Component={JobApplicants} />}
        />
        <Route
          path="/recommendedUsers"
          element={<ProtectedRoute Component={RecommendedUsers} />}
        />
        <Route
          path="/dashboardprofile"
          element={<ProtectedRoute Component={DashboardProfile} />}
        />
        <Route path="/chat" element={<ProtectedRoute Component={Chat} />} />

        {/* <Route path="/userlistings" element={<Userlistings />} /> */}
      </Routes>
      {!isDashboardRoute && <Footer />}
    </Fragment>
  );
};

export default AppRoutes;
