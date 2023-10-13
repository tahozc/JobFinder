import React, { Fragment, useEffect, useState } from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faChevronDown,
  faCommentAlt,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import UserImg from "../../assets/avatar.png";
import { logout, setShared } from "../../redux/actions/sharedAction";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const DashboardNavbar = () => {
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector(({ Shared }) => Shared.isSidebarOpen);
  const currentUser = useSelector(({ Shared }) => Shared.currentUser);
  const DashboardPage = useSelector(({ Shared }) => Shared.DashboardPage);
  const ToggleSideBar = () => {
    dispatch(
      setShared({
        name: "isSidebarOpen",
        value: !isSidebarOpen,
      })
    );
  };
  useEffect(() => {}, [
    currentUser?.image,
    currentUser?.companyName,
    currentUser?.firstName,
    currentUser?.lastName,
  ]);

  return (
    <Fragment>
      <div className="dasboard-navbar-container">
        <div className="dasboard-navbar-page-container">
          <div className="bars-container" onClick={() => ToggleSideBar()}>
            <div className="bar-item item-1"></div>
            <div className="bar-item item-2"></div>
            <div className="bar-item item-3"></div>
          </div>
          <div className="dasboard-navbar-page-name">{DashboardPage}</div>
        </div>

        <div className="dashboard-navbar-profile-container">
          <div
            className="dashboard-navbar-profile-icon-container"
            onClick={() => navigate("/chat")}
          >
            <FontAwesomeIcon icon={faCommentAlt} />
          </div>
          <Fragment>
            <div
              className="navbar-user-container"
              onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
            >
              <img
                src={
                  currentUser.image
                    ? require(`../../assets/profile/${currentUser.image}`)
                    : UserImg
                }
                alt={"user.png"}
                className="navbar-user-img"
              />
              <div className="navbar-user-name">
                {currentUser.type === 0
                  ? currentUser.companyName
                  : `${currentUser.firstName} ${currentUser.lastName}`}
              </div>
              <div className="navbar-user-icon-container">
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
              {isNavDropdownOpen && (
                <div className="navbar-user-dropdown-container">
                  <div
                    className="navbar-user-dropdown-item-container"
                    onClick={() => {
                      dispatch(logout());
                      navigate("/dashboardprofile");
                    }}
                  >
                    <div className="navbar-user-dropdown-item-icon-container">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="navbar-user-dropdown-item-text">
                      Dashboard
                    </div>
                  </div>
                  <div
                    className="navbar-user-dropdown-item-container logout"
                    onClick={() => {
                      dispatch(logout());
                      navigate("/");
                    }}
                  >
                    <div className="navbar-user-dropdown-item-icon-container">
                      <FontAwesomeIcon icon={faSignOut} />
                    </div>
                    <div className="navbar-user-dropdown-item-text">
                      Log Out
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default DashboardNavbar;
