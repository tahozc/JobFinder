import React, { Fragment } from "react";
import "./index.css";
import Sidebar from "../../shared/Sidebar";
import DashboardNavbar from "../../shared/DashboardNavbar";
import { useSelector } from "react-redux";
const withDashboard = (WrappedComponent) => {
  const DashboardLayout = (props) => {
    const isSidebarOpen = useSelector(({ Shared }) => Shared.isSidebarOpen);
    return (
      <Fragment>
        <div className="dashboard-container-row">
          <div
            className={`dashboard-sidebar ${
              isSidebarOpen ? "isSidebarOpen" : "isSidebarClose"
            }`}
          >
            <Sidebar />
          </div>
          <div
            className={`dashboard-content ${
              isSidebarOpen ? "isSidebarOpen" : "isSidebarClose"
            }`}
          >
            <div className="dashboard-inner-content">
              <DashboardNavbar />
              <WrappedComponent {...props} />
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  return DashboardLayout;
};

export default withDashboard;
