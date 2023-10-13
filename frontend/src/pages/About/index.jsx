import React, { Fragment, useEffect, useState } from "react";
import AboutImg from "../../assets/about.png";
import OrganizationImg from "../../assets/organization.png";
import Button from "../../shared/Button";
import Container from "../../shared/Container";
import "../../shared/css/auth.css";
import Input from "../../shared/Input";
import { useDispatch, useSelector } from "react-redux";
import {
  loginCompany,
  loginUser,
  setShared,
} from "../../redux/actions/sharedAction";
import { useNavigate } from "react-router-dom";
import "./index.css";
const About = () => {
  return (
    <Fragment>
      <Container>
        <div className="auth-container">
          <div className="auth-row">
            <div className="auth-image-container">
              <img src={AboutImg} className="authImg" alt={"auth.png"} />
            </div>
            <div className="auth-inputs-container">
              <div className="auth-text-header">About</div>
              <div className="about-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default About;
