import React, { Fragment, useEffect } from "react";
import LogoImg from "../../assets/logo_alt.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faUserAlt,
  faBell,
  faCommentAlt,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector(({ Shared }) => Shared.currentUser);
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <div className="dashboard-sidebar-img-row">
        <img src={LogoImg} className="dashboard-sidebar-img" alt={"logo.png"} />
      </div>

      <div className="dashboard-sidebar-routes-container">
        <div
          className={`dashboard-sidebar-route-item-container ${
            pathname === "/joblistings" && "selected"
          }`}
          onClick={() => navigate("/joblistings")}
        >
          <div className="dashboard-sidebar-route-item-img">
            <FontAwesomeIcon icon={faList} />
          </div>
          <div className="dashboard-sidebar-route-item-text">Job Listings</div>
        </div>
        <div
          className={`dashboard-sidebar-route-item-container ${
            pathname === "/dashboardprofile" && "selected"
          }`}
          onClick={() => navigate("/dashboardprofile")}
        >
          <div className="dashboard-sidebar-route-item-img">
            <FontAwesomeIcon icon={faUserAlt} />
          </div>
          <div className="dashboard-sidebar-route-item-text">Profile</div>
        </div>
        {currentUser?.type === 0 && (
          <div
            className={`dashboard-sidebar-route-item-container ${
              (pathname === "/createjobs" ||
                pathname === "/dashboardjoblist") &&
              "selected"
            }`}
            onClick={() => navigate("/dashboardjoblist")}
          >
            <div className="dashboard-sidebar-route-item-img">
              <FontAwesomeIcon icon={faBriefcase} />
            </div>
            <div className="dashboard-sidebar-route-item-text">Jobs</div>
          </div>
        )}

        <div
          className={`dashboard-sidebar-route-item-container ${
            (pathname === "/applications" || pathname === "/companyJobs") &&
            "selected"
          }`}
          onClick={() => {
            if (currentUser.type === 0) {
              navigate("/companyJobs");
            } else {
              navigate("/applications");
            }
          }}
        >
          <div className="dashboard-sidebar-route-item-img">
            <FontAwesomeIcon icon={faBriefcase} />
          </div>
          <div className="dashboard-sidebar-route-item-text">Applications</div>
        </div>
        <div
          className={`dashboard-sidebar-route-item-container ${
            pathname === "/chat" && "selected"
          }`}
          onClick={() => navigate("/chat")}
        >
          <div className="dashboard-sidebar-route-item-img">
            <FontAwesomeIcon icon={faCommentAlt} />
          </div>
          <div className="dashboard-sidebar-route-item-text">Chats</div>
        </div>
      </div>
    </Fragment>
  );
};

export default Sidebar;
