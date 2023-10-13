import React, { Fragment, useState } from "react";
import Logo from "../../assets/logo.png";
import Container from "../../shared/Container";
import Button from "../../shared/Button";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import UserImg from "../../assets/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/sharedAction";
const Navbar = () => {
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector(({ Shared }) => Shared.currentUser);
  const dispatch = useDispatch();
  return (
    <Fragment>
      <Container>
        <div className="navbar-container">
          <div className="navbar-row">
            <img src={Logo} className="navbar-logo" alt={"navbar-logo.png"} />
            <div className="navbar-items-container">
              <Link to={"/"} className="navbar-item">
                Home
              </Link>
              <Link to={"/joblistings"} className="navbar-item">
                Find Jobs
              </Link>
              <Link to={"/about"} className="navbar-item">
                About
              </Link>
              <Link to={"/contact"} className="navbar-item">
                Contact
              </Link>
            </div>
            {currentUser ? (
              <Fragment>
                <div
                  className="navbar-user-container"
                  onClick={() => {
                    setIsNavDropdownOpen(!isNavDropdownOpen);
                  }}
                >
                  <img
                    src={
                      currentUser.image
                        ? require(`../../assets/profile/${currentUser.image}`)
                        : UserImg
                    }
                    className="navbar-user-img"
                    alt={"profile.png"}
                  />
                  <div className="navbar-user-name">
                    {" "}
                    {currentUser.type === 0
                      ? currentUser.companyName
                      : `${currentUser.firstName} ${currentUser.lastName}`}
                  </div>
                  <div className="navbar-user-icon-container">
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                  {isNavDropdownOpen && (
                    <div className="navbar-user-dropdown-container right-auto">
                      <div
                        className="navbar-user-dropdown-item-container"
                        onClick={() => navigate("/dashboardprofile")}
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
            ) : (
              <div className="navbar-buttons-container">
                <Button
                  text={"Register"}
                  className={"mr-5"}
                  onClick={() => {
                    navigate("/register");
                  }}
                />
                <Button
                  text={"Login"}
                  className={"alt"}
                  onClick={() => {
                    navigate("/");
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default Navbar;
