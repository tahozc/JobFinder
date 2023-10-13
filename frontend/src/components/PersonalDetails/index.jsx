import React, { Fragment, useRef, useState } from "react";
import "./index.css";
import Select from "react-select";
import Input from "../../shared/Input";
import Button from "../../shared/Button";
import CreatableSelect from "react-select/creatable";
import { v4 as uuidv4 } from "uuid";
import JobHistory from "../JobHistory";
import Textarea from "../../shared/Textarea";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  registerCompany,
  setShared,
  parseResume,
} from "../../redux/actions/sharedAction";
import jobdomains from "../../constants/jobdomains";
const PersonalDetails = ({ setcurrentStep }) => {
  const dispatch = useDispatch();
  const Shared = useSelector(({ Shared }) => Shared);
  const ResumeRef = useRef(null);
  const {
    email,
    password,
    firstName,
    lastName,
    birthdate,
    website,
    countryCode,
    phoneNumber,
    streetNumber,
    streetName,
    city,
    country,
    languages,
    resumeFile,
    resumeFileName,
    workDomain,
    skills,
    jobs,
    degree,
    companydesc,
    isCompany,
    companyName,
    fiscalNumber,
    creationDate,
    companyExpertise,
    raw_text,
  } = Shared;

  const [errors, setErrors] = useState({
    resumeFile: { hasError: false, text: "", type: "user" },
    workDomain: { hasError: false, text: "", type: "user" },
    skills: { hasError: false, text: "", type: "user" },
    degree: { hasError: false, text: "", type: "user" },
    companyExpertise: { hasError: false, text: "", type: "company" },
    companydesc: { hasError: false, text: "", type: "both" },
  });
  const validateFields = (data, isCompany) => {
    let hasErrors = false;
    const updatedErrors = { ...errors }; // Copy existing errors state

    for (const key in data) {
      const value = data[key];
      const fieldConfig = errors[key];
      const type = fieldConfig?.type;
      const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
      console.log(fieldConfig);
      if (!value || value.toString().trim() === "") {
        if (
          (fieldConfig?.type === "company" && isCompany) ||
          (fieldConfig?.type === "user" && !isCompany) ||
          fieldConfig?.type === "both"
        ) {
          updatedErrors[key] = {
            hasError: true,
            text: `${fieldName} is required.`,
            type,
          };
          hasErrors = true;
        }
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
      [key]: { ...prevErrors[key], hasError: false, text: "" },
    }));
  };
  const handleResumeFile = (e) => {
    const selectedFile = e.target.files[0];
    const fileName = selectedFile.name;
    onChange({
      target: {
        name: "resumeFileName",
        value: fileName,
      },
    });
    onChange({
      target: {
        name: "resumeFile",
        value: selectedFile,
      },
    });
    dispatch(parseResume({ file: selectedFile, skills, degree, jobs }));
  };
  const handleResumeInput = () => {
    ResumeRef.current.click();
  };
  const AddNewJob = () => {
    const newJobId = uuidv4();
    onChange({
      target: {
        name: "jobs",
        value: [
          ...jobs,
          {
            id: newJobId,
            title: "",
            company: "",
            hasTitleError: false,
            hasCompanyError: false,
          },
        ],
      },
    });
  };
  const onJobItemUpdate = (updatedJobs) => {
    onChange({
      target: { name: "jobs", value: updatedJobs },
    });
  };
  const removeJobHistory = (id) => {
    const updatedJobs = jobs.filter((job) => job.id !== id);
    onChange({
      target: { name: "jobs", value: updatedJobs },
    });
  };

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
  const validateJobs = (jobs) => {
    let hasJobErrors = false;
    const updatedJobs = jobs.map((job) => {
      const isTitleEmpty = job.title === "";
      const isCompanyEmpty = job.company === "";
      if (isTitleEmpty || isCompanyEmpty) hasJobErrors = true;
      return {
        ...job,
        hasTitleError: isTitleEmpty,
        hasCompanyError: isCompanyEmpty,
      };
    });
    console.log(updatedJobs);
    onJobItemUpdate(updatedJobs);
    return hasJobErrors;
  };
  const onSubmit = () => {
    const hasErrors = validateFields(
      {
        resumeFile,
        workDomain,
        skills,
        degree,
        companyExpertise,
        companydesc,
      },
      isCompany
    );
    
    if (hasErrors) {
      return;
    }

    if (isCompany) {
      dispatch(
        registerCompany({
          email,
          password,
          companyName,
          fiscalNumber,
          creationDate,
          website,
          countryCode,
          phoneNumber,
          streetNumber,
          streetName,
          city,
          country,
          languages,
          companyExpertise,
          companydesc,
        })
      );
    } else {
      const hasJobErrors = validateJobs(jobs);
      if (hasJobErrors) {
        return;
      }

      dispatch(
        registerUser({
          email,
          password,
          firstName,
          lastName,
          birthdate,
          website,
          countryCode,
          phoneNumber,
          streetNumber,
          streetName,
          city,
          country,
          languages,
          resumeFile,
          workDomain,
          skills,
          jobs,
          degree,
          companydesc,
          raw_text,
        })
      );
    }
  };
  return (
    <Fragment>
      <div className="profiledetails-container">
        {!isCompany && (
          <div className="auth-form-item ">
            <div className="auth-form-label">Upload Resume</div>
            <Input
              type="text"
              placeholder={"Upload Resume"}
              onClick={handleResumeInput}
              className={"resume-input"}
              value={resumeFileName}
            />
            <input
              type="file"
              ref={ResumeRef}
              className="hidden"
              onChange={handleResumeFile}
            />
            {errors.resumeFile.hasError && (
              <div className="auth-form-error">{errors.resumeFile.text}</div>
            )}
          </div>
        )}

        {isCompany ? (
          <div className="auth-form-item ">
            <div className="auth-form-label">Enter Company Expertise</div>
            <CreatableSelect
              isMulti
              isClearable
              options={[]}
              onChange={(newCompanyExpertise) =>
                onChange({
                  target: {
                    name: "companyExpertise",
                    value: newCompanyExpertise,
                  },
                })
              }
              value={companyExpertise}
              placeholder={"e.g UI/UX Design"}
            />
            {errors.companyExpertise.hasError && (
              <div className="auth-form-error">
                {errors.companyExpertise.text}
              </div>
            )}
          </div>
        ) : (
          <div className="auth-form-item ">
            <div className="auth-form-label">Enter Work Domains(upto 3)</div>
            <Select
              isMulti
              options={jobdomains}
              placeholder={"Select Work Domains"}
              onChange={(selectedjobDomain) => {
                if (selectedjobDomain.length <= 3)
                  onChange({
                    target: {
                      name: "workDomain",
                      value: selectedjobDomain,
                    },
                  });
              }}
              value={workDomain}
            />
            {errors.workDomain.hasError && (
              <div className="auth-form-error">{errors.workDomain.text}</div>
            )}
          </div>
        )}
        {!isCompany && (
          <Fragment>
            <div className="auth-form-item ">
              <div className="auth-form-label">Enter Skills</div>
              <CreatableSelect
                isMulti
                isClearable
                options={[]}
                onChange={(newSkills) =>
                  onChange({
                    target: {
                      name: "skills",
                      value: newSkills,
                    },
                  })
                }
                value={skills}
                placeholder={"e.g ReactJS,Angular,Vue etc"}
              />
              {errors.skills.hasError && (
                <div className="auth-form-error">{errors.skills.text}</div>
              )}
            </div>
            <div className="profiledetails-work-container">
              <div className="profiledetails-work-header auth-form-label">
                Enter Work History
              </div>
              {jobs.map((jobItem, key) => (
                <JobHistory
                  key={jobItem.id}
                  index={key}
                  jobItem={jobItem}
                  jobs={jobs}
                  setjobs={onJobItemUpdate}
                  removeItem={removeJobHistory}
                />
              ))}
              <div className="profiledetails-row buttons">
                <Button
                  text={"Add New Job"}
                  className={"alt"}
                  onClick={AddNewJob}
                />
              </div>
            </div>
            <div className="auth-form-item ">
              <div className="auth-form-label">Enter Degree</div>
              <CreatableSelect
                isMulti
                isClearable
                options={[]}
                onChange={(newDegrees) =>
                  onChange({
                    target: {
                      name: "degree",
                      value: newDegrees,
                    },
                  })
                }
                value={degree}
                placeholder={"e.g Software Engineering,Accounting"}
              />{" "}
              {errors.degree.hasError && (
                <div className="auth-form-error">{errors.degree.text}</div>
              )}
            </div>
          </Fragment>
        )}

        <div className="auth-form-item ">
          <div className="auth-form-label">
            Describe {isCompany ? "Your Company" : "Yourself"}
          </div>
          <Textarea
            name={"companydesc"}
            onChange={onChange}
            value={companydesc}
          />
          {errors.companydesc.hasError && (
            <div className="auth-form-error">Description is Requied</div>
          )}
        </div>
        <div className="profiledetails-row dual-button">
          <Button
            text={"Previous"}
            className={"alt"}
            onClick={() => setcurrentStep(2)}
          />
          <Button text={"Submit"} onClick={onSubmit} />
        </div>
      </div>
    </Fragment>
  );
};

export default PersonalDetails;
