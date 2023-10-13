import React, { Fragment, useEffect, useState } from "react";
import ContactImg from "../../assets/contact.jpg";
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
import Textarea from "../../shared/Textarea";
const Contact = () => {
  return (
    <Fragment>
      <Container>
        <div className="auth-container">
          <div className="auth-row">
            <div className="auth-image-container">
              <img src={ContactImg} className="authImg" alt={"auth.png"} />
            </div>
            <div className="auth-inputs-container">
              <div className="auth-text-header">Contact</div>
              <form className="auth-form">
                <div className="auth-form-item">
                  <div className="auth-form-label">
                    Enter Email
                  </div>
                  <Input type={"text"} placeholder={"Enter Email"} />
                </div>
                <div className="auth-form-item">
                  <div className="auth-form-label">Enter Message</div>
                  <Textarea />
                </div>

                <div className="auth-form-item auth-form-btn-container">
                  <Button text={"Send"} className={"alt"} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default Contact;
