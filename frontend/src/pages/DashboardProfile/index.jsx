import React, { useRef, Fragment, useEffect, useState } from "react";
import withDashboard from "../../HOC/Dashboard";
import Input from "../../shared/Input";
import countries from "../../constants/countries";
import Select from "react-select";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import Datepicker from "../../shared/Datepicker";
import Textarea from "../../shared/Textarea";
import Button from "../../shared/Button";
import "../../components/PersonalDetails/index.css";
import "./index.css";
import countryCodes from "../../constants/countryCodes";
import CreatableSelect from "react-select/creatable";
import { v4 as uuidv4 } from "uuid";
import JobHistory from "../../components/JobHistory";
import { useSelector, useDispatch } from "react-redux";
import {
  parseResume,
  setProfileForm,
  setShared,
  updateCompanyProfile,
  updateUserProfile,
} from "../../redux/actions/sharedAction";
import languagesList from "../../constants/languages";
import Loader from "../../shared/Loader";
import jobdomains from "../../constants/jobdomains";
import Swal from "sweetalert2";
const DashboardProfile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(({ Shared }) => Shared.currentUser);
  const isCompany = currentUser.type === 0;
  const profileForm = useSelector(({ Shared }) => Shared.profileForm);
  const isLoading = useSelector(({ Shared }) => Shared.isLoading);
  const {
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
    companyName,
    fiscalNumber,
    creationDate,
    companyExpertise,
    profileImageFile,
    image,
    raw_text,
  } = profileForm;
  const [errors, setErrors] = useState({
    firstName: { hasError: false, text: "", type: "user" },
    lastName: { hasError: false, text: "", type: "user" },
    birthdate: { hasError: false, text: "", type: "user" },
    countryCode: { hasError: false, text: "", type: "both" },
    phoneNumber: { hasError: false, text: "", type: "both" },
    streetNumber: { hasError: false, text: "", type: "both" },
    streetName: { hasError: false, text: "", type: "both" },
    city: { hasError: false, text: "", type: "both" },
    country: { hasError: false, text: "", type: "both" },
    languages: { hasError: false, text: "", type: "both" },
    resumeFile: { hasError: false, text: "", type: "user" },
    workDomain: { hasError: false, text: "", type: "user" },
    skills: { hasError: false, text: "", type: "user" },
    degree: { hasError: false, text: "", type: "user" },
    companydesc: { hasError: false, text: "", type: "both" },
    companyName: { hasError: false, text: "", type: "company" },
    fiscalNumber: { hasError: false, text: "", type: "company" },
    creationDate: { hasError: false, text: "", type: "company" },
    companyExpertise: { hasError: false, text: "", type: "company" },
  });
  const validateFields = (data, isCompany) => {
    let hasErrors = false;
    const updatedErrors = { ...errors }; // Copy existing errors state

    for (const key in data) {
      const value = data[key];
      const keyStr = key.toString();
      const fieldConfig = errors[keyStr];
      const type = fieldConfig?.type;
      const fieldName = key.charAt(0).toUpperCase() + key.slice(1);

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

  useEffect(() => {
    dispatch(
      setShared({
        name: "DashboardPage",
        value: "Profile",
      })
    );
  }, []);

  const ResumeRef = useRef(null);
  const ProfileRef = useRef(null);
  const handleResumeFile = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type === "application/pdf") {
      const selectedFileName = selectedFile.name;

      onChange({
        target: {
          name: "resumeFile",
          value: selectedFile,
        },
      });
      onChange({
        target: {
          name: "resumeFileName",
          value: selectedFileName,
        },
      });
      dispatch(
        parseResume({ file: selectedFile, skills, degree, jobs, isEdit: true })
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "Error Occured",
        text: "Please Only upload Resume in PDF Format",
      });
    }
  };
  const handleResumeInput = () => {
    // Trigger the click event of the file input
    ResumeRef.current.click();
  };

  const handleProfileFile = (e) => {
    const selectedFile = e.target.files[0];
    const selectedFileName = selectedFile.name;

    if (selectedFile.type.startsWith("image/")) {
      // It's an image file
      onChange({
        target: {
          name: "profileImageFile",
          value: selectedFile,
        },
      });
      onChange({
        target: {
          name: "image",
          value: selectedFileName,
        },
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error Occured",
        text: "Please Only upload an Image",
      });
    }
  };

  const handleProfileInput = () => {
    // Trigger the click event of the file input
    ProfileRef.current.click();
  };

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(
      setProfileForm({
        name,
        value,
      })
    );
    removeError(name);
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
    console.log(updatedJobs)
    onJobItemUpdate(updatedJobs)
    return hasJobErrors;
  };
  const removeJobHistory = (id) => {
    const updatedJobs = jobs.filter((job) => job.id !== id);
    onChange({
      target: { name: "jobs", value: updatedJobs },
    });
  };
  const onUpdateProfile = (e) => {
    e.preventDefault();
    const hasErrors = validateFields(
      {
        firstName,
        lastName,
        birthdate,
        countryCode,
        phoneNumber,
        streetNumber,
        streetName,
        city,
        country,
        languages,
        workDomain,
        skills,
        jobs,
        degree,
        companydesc,
        companyName,
        fiscalNumber,
        creationDate,
        companyExpertise,
      },
      isCompany
    );
    if (hasErrors) {
      return;
    }
    const hasJobErrors = validateJobs(jobs);
    if (hasJobErrors) {
      return;
    }
    if (isCompany) {
      dispatch(
        updateCompanyProfile({
          website,
          countryCode,
          phoneNumber,
          streetNumber,
          streetName,
          city,
          country,
          languages,
          companydesc,
          companyName,
          fiscalNumber,
          creationDate,
          companyExpertise,
          profileImageFile,
        })
      );
    } else {
      dispatch(
        updateUserProfile({
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
          profileImageFile,
          raw_text,
        })
      );
    }
  };
  return (
    <div className="dashboard-profile-container">
      <div className="dashboard-profile-card">
        <div className="dashboard-profile-row">
          <div className="dashboard-profile-header">Edit Profile</div>
        </div>
        <div className="dashboard-profile-row">
          <div className="dashboard-profile-column">
            {isCompany ? (
              <div className="auth-form-item">
                <div className="auth-form-label">Enter CompanyName</div>
                <Input
                  type={"text"}
                  placeholder={"e.g Facebook"}
                  name={"companyName"}
                  onChange={onChange}
                  value={companyName}
                />
                {errors.companyName.hasError && (
                  <div className="auth-form-error">
                    {errors.companyName.text}
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-form-item">
                <div className="auth-form-label">Enter FirstName</div>
                <Input
                  type={"text"}
                  placeholder={"e.g John"}
                  name={"firstName"}
                  onChange={onChange}
                  value={firstName}
                />
                {errors.firstName.hasError && (
                  <div className="auth-form-error">{errors.firstName.text}</div>
                )}
              </div>
            )}
          </div>
          <div className="dashboard-profile-column">
            {isCompany ? (
              <div className="auth-form-item">
                <div className="auth-form-label">Enter FiscalNumber</div>
                <Input
                  type={"text"}
                  placeholder={"e.g 1234-5678-9"}
                  name={"fiscalNumber"}
                  onChange={onChange}
                  value={fiscalNumber}
                />
                {errors.fiscalNumber.hasError && (
                  <div className="auth-form-error">
                    {errors.fiscalNumber.text}
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-form-item">
                <div className="auth-form-label">Enter LastName</div>
                <Input
                  type={"text"}
                  placeholder={"e.g John"}
                  name={"lastName"}
                  onChange={onChange}
                  value={lastName}
                />
                {errors.lastName.hasError && (
                  <div className="auth-form-error">{errors.lastName.text}</div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="dashboard-profile-row">
          <div className="dashboard-profile-column">
            {isCompany ? (
              <div className="auth-form-item">
                <div className="auth-form-label">Enter CreationDate</div>
                <Datepicker
                  calendarValue={creationDate}
                  setCalendarValue={onChange}
                  icon={faCalendar}
                  name={"creationDate"}
                />
                {errors.creationDate.hasError && (
                  <div className="auth-form-error">
                    {errors.creationDate.text}
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-form-item">
                <div className="auth-form-label">Enter Birthday</div>
                <Datepicker
                  calendarValue={birthdate}
                  setCalendarValue={onChange}
                  icon={faCalendar}
                  name={"birthdate"}
                />
                {errors.birthdate.hasError && (
                  <div className="auth-form-error">{errors.birthdate.text}</div>
                )}
              </div>
            )}
          </div>
          <div className="dashboard-profile-column">
            <div className="auth-form-item">
              <div className="auth-form-label">Enter Website</div>
              <Input
                type={"text"}
                placeholder={"e.g https://www.facebook.com"}
                name={"website"}
                onChange={onChange}
                value={website}
              />
            </div>
          </div>
        </div>
        <div className="dashboard-profile-row">
          <div className="dashboard-profile-column">
            <div className="auth-form-item">
              <div className="auth-form-label">Enter Phone Number</div>
              <Select
                options={countryCodes}
                placeholder={"Select Country Code"}
                onChange={(selectedCountry) =>
                  onChange({
                    target: {
                      name: "countryCode",
                      value: selectedCountry,
                    },
                  })
                }
                value={countryCode}
              />
              <Input
                type={"text"}
                placeholder={"e.g 3155145092"}
                className={"dual-input"}
                name={"phoneNumber"}
                onChange={onChange}
                value={phoneNumber}
              />
              {errors.countryCode.hasError && (
                <div className="auth-form-error">{errors.countryCode.text}</div>
              )}
              {errors.phoneNumber.hasError && (
                <div className="auth-form-error">{errors.phoneNumber.text}</div>
              )}
            </div>
          </div>
          <div className="dashboard-profile-column">
            <div className="auth-form-item">
              <div className="auth-form-label">Enter Street Number & Name</div>
              <Input
                type={"text"}
                placeholder={"Street Number e.g 3"}
                name={"streetNumber"}
                onChange={onChange}
                value={streetNumber}
              />
              <Input
                type={"text"}
                placeholder={"Street Name e.g Baker Street"}
                className={"dual-input"}
                name={"streetName"}
                onChange={onChange}
                value={streetName}
              />
              {errors.streetNumber.hasError && (
                <div className="auth-form-error">
                  {errors.streetNumber.text}
                </div>
              )}
              {errors.streetName.hasError && (
                <div className="auth-form-error">{errors.streetName.text}</div>
              )}
            </div>
          </div>
        </div>
        <div className="dashboard-profile-row">
          <div className="dashboard-profile-column">
            <div className="auth-form-item">
              <div className="auth-form-label">Enter City</div>
              <Input
                type={"text"}
                placeholder={"e.g New York"}
                name={"city"}
                onChange={onChange}
                value={city}
              />
              {errors.city.hasError && (
                <div className="auth-form-error">{errors.city.text}</div>
              )}
            </div>
          </div>
          <div className="dashboard-profile-column">
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
        <div className="dashboard-profile-row">
          <div className="dashboard-profile-column">
            <div className="auth-form-item">
              <div className="auth-form-label">Enter Languages</div>
              <Select
                isMulti
                options={languagesList}
                placeholder={"Select Languages"}
                onChange={(selectLanguages) =>
                  onChange({
                    target: {
                      name: "languages",
                      value: selectLanguages,
                    },
                  })
                }
                value={languages}
              />
              {errors.languages.hasError && (
                <div className="auth-form-error">{errors.languages.text}</div>
              )}
            </div>
          </div>
          {isCompany ? (
            <div className="dashboard-profile-column">
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
            </div>
          ) : (
            <div className="dashboard-profile-column">
              <div className="auth-form-item ">
                <div className="auth-form-label">
                  Enter Work Domains(upto 3)
                </div>
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
                  <div className="auth-form-error">
                    {errors.workDomain.text}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {!isCompany && (
          <Fragment>
            {" "}
            <div className="dashboard-profile-row">
              <div className="dashboard-profile-column">
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
              </div>
              <div className="dashboard-profile-column">
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
                  />
                  {errors.degree.hasError && (
                    <div className="auth-form-error">{errors.degree.text}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="dashboard-profile-row signle-item">
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
                  <div className="auth-form-error">Resume is Requied</div>
                )}
              </div>
            </div>
            <div className="dashboard-profile-row signle-item">
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
            </div>
          </Fragment>
        )}
        <div className="dashboard-profile-row signle-item">
          <div className="auth-form-item ">
            <div className="auth-form-label">Upload Profile Image</div>
            <Input
              type="text"
              placeholder={"Upload Profile"}
              onClick={handleProfileInput}
              className={"resume-input"}
              value={image}
            />
            <input
              type="file"
              ref={ProfileRef}
              className="hidden"
              onChange={handleProfileFile}
            />
          </div>
        </div>

        <div className="dashboard-profile-row signle-item">
          <div className="auth-form-item ">
            <div className="auth-form-label">Describe yourself</div>
            <Textarea
              name={"companydesc"}
              onChange={onChange}
              value={companydesc}
            />
            {errors.companydesc.hasError && (
              <div className="auth-form-error">Description is Requied</div>
            )}
          </div>
        </div>
        <div className="dashboard-profile-row signle-item">
          <Button text={"Update Profile"} onClick={onUpdateProfile} />
        </div>
        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default withDashboard(DashboardProfile);
