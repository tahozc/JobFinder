import React, { useState, useEffect } from "react";
import "./index.css";
import withDashboard from "../../HOC/Dashboard";
import Input from "../../shared/Input";
import countries from "../../constants/countries";
import Select from "react-select";
import { faCalendar, faTimes } from "@fortawesome/free-solid-svg-icons";
import Datepicker from "../../shared/Datepicker";
import Textarea from "../../shared/Textarea";
import Button from "../../shared/Button";
import { useDispatch, useSelector } from "react-redux";
import { setAddJob, addCompanysJob } from "../../redux/actions/companyAction";
import jobdomains from "../../constants/jobdomains";
import { useNavigate } from "react-router-dom";
import jobtypes from "../../constants/jobtypes";
import Loader from "../../shared/Loader";
import { setShared } from "../../redux/actions/sharedAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const CreateJob = () => {
  const navigate = useNavigate();
  const Company = useSelector(({ Company }) => Company);
  const isLoading = useSelector(({ Shared }) => Shared.isLoading);
  const currentUser = useSelector(({ Shared }) => Shared.currentUser);
  const { addJob } = Company;
  const {
    title,
    type,
    city,
    country,
    hourlyRate,
    budget,
    deadline,
    startDate,
    endDate,
    domain,
    description,
    duties,
    experience,
  } = addJob;

  useEffect(() => {
    if (currentUser) {
      if (currentUser.type !== 0) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
    dispatch(
      setShared({
        name: "DashboardPage",
        value: "Create Job",
      })
    );
  }, []);

  const [errors, setErrors] = useState({
    title: { hasError: false, text: "" },
    type: { hasError: false, text: "" },
    city: { hasError: false, text: "" },
    country: { hasError: false, text: "" },
    hourlyRate: { hasError: false, text: "" },
    budget: { hasError: false, text: "" },
    deadline: { hasError: false, text: "" },
    startDate: { hasError: false, text: "" },
    endDate: { hasError: false, text: "" },
    domain: { hasError: false, text: "" },
    description: { hasError: false, text: "" },
    duties: { hasError: false, text: "" },
    experience: { hasError: false, text: "" },
  });

  const validateFields = (data) => {
    let hasErrors = false;
    const updatedErrors = { ...errors }; // Copy existing errors state

    for (const key in data) {
      const value = data[key];
      const fieldName = key.charAt(0).toUpperCase() + key.slice(1);

      if (!value || value.toString().trim() === "") {
        updatedErrors[key] = {
          hasError: true,
          text: `${fieldName} is required.`,
        };
        hasErrors = true;
      } else {
        updatedErrors[key] = {
          hasError: false,
          text: "",
        };
      }
    }

    setErrors(updatedErrors);
    return hasErrors;
  };
  const removeError = (key) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: { hasError: false, text: "" },
    }));
  };
  const dispatch = useDispatch();
  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const isNumber = e.target.isNumber;
    const numberRegex = /^[0-9]*$/;
    if (isNumber && !numberRegex.test(value)) return;
    dispatch(
      setAddJob({
        name,
        value,
      })
    );
    removeError(name);
  };
  const onSubmit = () => {
    const data = {
      title,
      type,
      city,
      country,
      hourlyRate,
      budget,
      startDate,
      domain,
      description,
      duties,
      experience,
    };
    const hasErrors = validateFields(data);
    if (hasErrors) return;
    dispatch(
      addCompanysJob({
        data,
        navigate,
      })
    );
  };
  return (
    <div className="create-job-container">
      <div className="create-job-card">
        <div className="create-job-row">
          <div className="create-job-header">Create Job</div>
        </div>
        <div className="create-job-row">
          <div className="create-job-column">
            <div className="auth-form-item">
              <div className="auth-form-label">Job Title</div>
              <Input
                type={"text"}
                placeholder={"e.g CopyWriter"}
                name={"title"}
                value={title}
                onChange={onChange}
              />
              {errors.title.hasError && (
                <div className="auth-form-error">{errors.title.text}</div>
              )}
            </div>
          </div>
          <div className="create-job-column">
            <div className="auth-form-item">
              <div className="auth-form-label">Type of Job</div>
              <Select
                options={jobtypes}
                placeholder={"Select Job type"}
                onChange={(selectedtype) =>
                  onChange({
                    target: {
                      name: "type",
                      value: selectedtype,
                    },
                  })
                }
                value={type}
              />
              {errors.type.hasError && (
                <div className="auth-form-error">{errors.type.text}</div>
              )}
            </div>
          </div>
        </div>
        <div className="create-job-row">
          <div className="create-job-column">
            <div className="auth-form-item">
              <div className="auth-form-label">City</div>
              <Input
                type={"text"}
                placeholder={"e.g New York"}
                name={"city"}
                value={city}
                onChange={onChange}
              />
              {errors.city.hasError && (
                <div className="auth-form-error">{errors.city.text}</div>
              )}
            </div>
          </div>
          <div className="create-job-column">
            <div className="auth-form-item">
              <div className="auth-form-label">Enter Country</div>
              <Select
                options={countries}
                placeholder={"Select Country"}
                onChange={(selectedCountry) =>
                  onChange({
                    target: {
                      name: "country",
                      value: selectedCountry,
                    },
                  })
                }
                value={country}
              />
              {errors.country.hasError && (
                <div className="auth-form-error">{errors.country.text}</div>
              )}
            </div>
          </div>
        </div>
        <div className="create-job-row">
          <div className="create-job-column">
            <div className="auth-form-item">
              <div className="auth-form-label">Hourly Rate</div>
              <Input
                type={"text"}
                placeholder={"e.g 30"}
                name={"hourlyRate"}
                value={hourlyRate}
                onChange={onChange}
                isNumber={true}
              />
              {errors.hourlyRate.hasError && (
                <div className="auth-form-error">{errors.hourlyRate.text}</div>
              )}
            </div>
          </div>
          <div className="create-job-column">
            <div className="auth-form-item">
              <div className="auth-form-label">Budget</div>
              <Input
                type={"text"}
                placeholder={"e.g 100000"}
                name={"budget"}
                value={budget}
                onChange={onChange}
                isNumber={true}
              />
              {errors.budget.hasError && (
                <div className="auth-form-error">{errors.budget.text}</div>
              )}
            </div>
          </div>
        </div>
        <div className="create-job-row">
          <div className="create-job-column">
            <div className="auth-form-item">
              <div className="auth-form-label">
                Enter Application Deadline(Optional)
              </div>
              <Datepicker
                calendarValue={deadline}
                setCalendarValue={onChange}
                icon={faCalendar}
                name={"deadline"}
                minDate={new Date()}
              />
              <div
                className={`joblisting-filter-item-column-reset ${
                  !deadline && "isEmpty"
                }`}
                onClick={() => {
                  if (deadline)
                    onChange({
                      target: {
                        name: "deadline",
                        value: null,
                      },
                    });
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
                <span>Reset</span>
              </div>
            </div>
          </div>
          <div className="create-job-column">
            <div className="auth-form-item">
              <div className="auth-form-label">Enter StartDate</div>
              <Datepicker
                calendarValue={startDate}
                setCalendarValue={onChange}
                icon={faCalendar}
                name={"startDate"}
                minDate={new Date()}
              />
              {errors.startDate.hasError && (
                <div className="auth-form-error">{errors.startDate.text}</div>
              )}
            </div>
          </div>
        </div>
        <div className="create-job-row">
          <div className="create-job-column">
            <div className="auth-form-item">
              <div className="auth-form-label">Enter EndDate</div>
              <Datepicker
                calendarValue={endDate}
                setCalendarValue={onChange}
                icon={faCalendar}
                name={"endDate"}
                minDate={new Date()}
              />
              <div
                className={`joblisting-filter-item-column-reset ${
                  !endDate && "isEmpty"
                }`}
                onClick={() => {
                  if (endDate)
                    onChange({
                      target: {
                        name: "endDate",
                        value: null,
                      },
                    });
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
                <span>Reset</span>
              </div>
            </div>
          </div>
          <div className="create-job-column">
            <div className="auth-form-item">
              <div className="auth-form-label">Job Domain(upto 3)</div>
              <Select
                isMulti
                options={jobdomains}
                placeholder={"Select Job Domain"}
                onChange={(selectedjobDomain) => {
                  if (selectedjobDomain.length <= 3) {
                    onChange({
                      target: {
                        name: "domain",
                        value: selectedjobDomain,
                      },
                    });
                  }
                }}
                value={domain}
              />
              {errors.domain.hasError && (
                <div className="auth-form-error">{errors.domain.text}</div>
              )}
            </div>
          </div>
        </div>
        <div className="create-job-row signle-item">
          <div className="auth-form-item ">
            <div className="auth-form-label">Job Description:</div>
            <Textarea
              name={"description"}
              value={description}
              onChange={onChange}
            />
            {errors.description.hasError && (
              <div className="auth-form-error">{errors.description.text}</div>
            )}
          </div>
        </div>
        <div className="create-job-row signle-item">
          <div className="auth-form-item ">
            <div className="auth-form-label">Responsibilites and duties:</div>
            <Textarea name={"duties"} value={duties} onChange={onChange} />
            {errors.duties.hasError && (
              <div className="auth-form-error">{errors.duties.text}</div>
            )}
          </div>
        </div>
        <div className="create-job-row signle-item">
          <div className="auth-form-item ">
            <div className="auth-form-label">
              Required Experience,Skills and Qualifications:
            </div>
            <Textarea
              name={"experience"}
              value={experience}
              onChange={onChange}
            />
            {errors.experience.hasError && (
              <div className="auth-form-error">{errors.experience.text}</div>
            )}
          </div>
        </div>
        <div className="create-job-row signle-item">
          <Button text={"Create Job"} onClick={onSubmit} />
        </div>
        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default withDashboard(CreateJob);
