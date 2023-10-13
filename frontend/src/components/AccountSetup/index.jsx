import React, { Fragment, useState } from "react";
import UserImg from "../../assets/user.png";
import OrganizationImg from "../../assets/organization.png";
import Input from "../../shared/Input";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import Button from "../../shared/Button";
import { useDispatch, useSelector } from "react-redux";
import { setShared } from "../../redux/actions/sharedAction";
import { useNavigate } from "react-router-dom";
const AccountSetup = ({ setcurrentStep }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Shared = useSelector(({ Shared }) => Shared);
  const { email, password, confirmPassword, isCompany } = Shared;
  const [errors, setErrors] = useState({
    email: { hasError: false, text: "" },
    password: { hasError: false, text: "" },
    confirmPassword: { hasError: false, text: "" },
  });
  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(
      setShared({
        name,
        value,
      })
    );
    removeError(name);
  };

  const removeError = (key) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: { hasError: false, text: "" },
    }));
  };
  const MoveToNextStep = () => {
    const hasErrors = validateFields();
    if (hasErrors) return;
    setcurrentStep(2);
  };
  function isValidEmail(email) {
    // Regular expression for validating an Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const validateFields = () => {
    let hasErrors = false;
    // Check Email Error
    if (email.length < 1 || !isValidEmail(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: {
          hasError: true,
          text: email.length < 1 ? "Email is Required" : "Email must be valid",
        },
      }));
      hasErrors = true;
    }

    // Check Password Error
    if (password.length < 1 || password.length < 3) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: {
          hasError: true,
          text:
            password.length < 1
              ? "Password is Required"
              : "Password must have at least 3 characters",
        },
      }));
      hasErrors = true;
    }

    // Check Confirm Password Error
    if (confirmPassword !== password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: {
          hasError: true,
          text: "Password and Confirm Password do not match",
        },
      }));
      hasErrors = true;
    }

    return hasErrors;
  };

  return (
    <Fragment>
      <div className="auth-image-container">
        <img
          src={isCompany ? OrganizationImg : UserImg}
          className="authImg"
          alt={"auth.png"}
        />
      </div>
      <div className="auth-inputs-container">
        <div className="auth-text-header">Register</div>
        <form className="auth-form">
          <div className="auth-form-item">
            <div className="auth-form-label">
              Enter Email<span>*</span>
            </div>
            <Input
              type={"text"}
              placeholder={"e.g name@mail.com"}
              icon={faEnvelope}
              name={"email"}
              onChange={onChange}
              value={email}
            />
            {errors.email.hasError && (
              <div className="auth-form-error">{errors.email.text}</div>
            )}
          </div>
          <div className="auth-form-item">
            <div className="auth-form-label">
              Enter Password<span>*</span>
            </div>
            <Input
              type={"password"}
              icon={faLock}
              placeholder={"Enter Password"}
              name={"password"}
              onChange={onChange}
              value={password}
            />
            {errors.password.hasError && (
              <div className="auth-form-error">{errors.password.text}</div>
            )}
          </div>
          <div className="auth-form-item">
            <div className="auth-form-label">
              Confirm Password<span>*</span>
            </div>
            <Input
              type={"password"}
              icon={faLock}
              placeholder={"Enter Password"}
              name={"confirmPassword"}
              onChange={onChange}
              value={confirmPassword}
            />
            {errors.confirmPassword.hasError && (
              <div className="auth-form-error">
                {errors.confirmPassword.text}
              </div>
            )}
          </div>
          <div className="auth-accordian-container">
            <div className="auth-accordian-row">
              <div
                className={`auth-accordian-item ${isCompany && "selected"}`}
                onClick={() =>
                  onChange({
                    target: {
                      name: "isCompany",
                      value: true,
                    },
                  })
                }
              >
                Organization
              </div>
              <div
                className={`auth-accordian-item ${!isCompany && "selected"}`}
                onClick={() =>
                  onChange({
                    target: {
                      name: "isCompany",
                      value: false,
                    },
                  })
                }
              >
                Individual
              </div>
            </div>
          </div>

          <div className="auth-form-item auth-form-btn-container">
            <Button text={"Next"} className={"alt"} onClick={MoveToNextStep} />
          </div>
          <div
            className="auth-link"
            onClick={() => {
              navigate("/");
            }}
          >
            Already have an account? Login
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default AccountSetup;
