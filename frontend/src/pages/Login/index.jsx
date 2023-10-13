import React, { Fragment, useEffect, useState } from "react";
import UserImg from "../../assets/user.png";
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
const Login = () => {
  const Shared = useSelector(({ Shared }) => Shared);
  const { isCompany, email, password, currentUser } = Shared;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    email: { hasError: false, text: "" },
    password: { hasError: false, text: "" },
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
    return hasErrors;
  };
  const onLoginClick = () => {
    const hasErrors = validateFields();
    if (hasErrors) return;
    if (isCompany) {
      dispatch(loginCompany({ data: { email, password }, navigate }));
    } else {
      dispatch(loginUser({ data: { email, password }, navigate }));
    }
  };
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboardprofile");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <Container>
        <div className="auth-container">
          <div className="auth-row">
            <div className="auth-image-container">
              <img
                src={isCompany ? UserImg : OrganizationImg}
                className="authImg"
                alt={"auth.png"}
              />
            </div>
            <div className="auth-inputs-container">
              <div className="auth-text-header">Login</div>
              <form className="auth-form">
                <div className="auth-form-item">
                  <div className="auth-form-label">
                    Enter Email<span>*</span>
                  </div>
                  <Input
                    type={"text"}
                    placeholder={"Enter Email"}
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
                    placeholder={"Enter Password"}
                    name={"password"}
                    onChange={onChange}
                    value={password}
                  />
                  {errors.password.hasError && (
                    <div className="auth-form-error">
                      {errors.password.text}
                    </div>
                  )}
                </div>
                <div className="auth-accordian-container">
                  <div className="auth-accordian-row">
                    <div
                      className={`auth-accordian-item ${
                        isCompany && "selected"
                      }`}
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
                      className={`auth-accordian-item ${
                        !isCompany && "selected"
                      }`}
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
                  <Button
                    text={"Login"}
                    className={"alt"}
                    onClick={onLoginClick}
                  />
                </div>
                <div
                  className="auth-link"
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  Don't have an account? Register
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default Login;
