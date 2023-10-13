import React, { Fragment, useEffect, useState } from "react";
import Container from "../../shared/Container";
import AccountSetup from "../../components/AccountSetup";
import SocialProfile from "../../components/SocialProfile";
import PersonalDetails from "../../components/PersonalDetails";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../shared/css/auth.css";
import "./index.css";
import Loader from "../../shared/Loader";
const Register = () => {
  const [isOrganization, setIsOrganization] = useState(true);
  const [currentStep, setcurrentStep] = useState(1);
  const Shared = useSelector(({ Shared }) => Shared);
  const isLoading = useSelector(({ Shared }) => Shared.isLoading);
  const { currentUser } = Shared;
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboardprofile");
    }
    // eslint-disable-next-line
  }, [currentUser]);

  return (
    <Fragment>
      <div className="auth-steps-container">
        <div className="auth-step-container">
          <div
            className={`auth-step-number ${currentStep >= 2 && "completed"}`}
          >
            1
          </div>
          <div className="auth-step-text">Account Setup</div>
          <div
            className={`auth-step-connector ${currentStep >= 2 && "completed"}`}
          />
        </div>
        <div className="auth-step-container">
          <div
            className={`auth-step-number ${currentStep === 3 && "completed"}`}
          >
            2
          </div>
          <div className="auth-step-text">Socail Profile</div>
          <div
            className={`auth-step-connector ${currentStep === 3 && "completed"}`}
          />
        </div>
        <div className="auth-step-container">
          <div className="auth-step-number">3</div>
          <div className="auth-step-text">Personal Details</div>
        </div>
      </div>
      <Container>
        <div className="auth-container">
          <div className="auth-row">
            {currentStep === 1 && (
              <AccountSetup
                isOrganization={isOrganization}
                setIsOrganization={setIsOrganization}
                setcurrentStep={setcurrentStep}
              />
            )}
            {currentStep === 2 && (
              <SocialProfile setcurrentStep={setcurrentStep} />
            )}
            {currentStep === 3 && (
              <PersonalDetails setcurrentStep={setcurrentStep} />
            )}{" "}
            {isLoading && <Loader />}
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default Register;
