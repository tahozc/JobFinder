import countries from "../../constants/countries";
import countryCodes from "../../constants/countryCodes";
import setAuthToken from "../../utils/setAuthToken";
import {
  APPLY_JOB_FILTER,
  BASE_URL,
  FILTER_USER_JOB_APPLICATIONS,
  PARSE_URL,
  RESET_CHAT,
  RESET_COMPANY,
  RESET_SHARED,
  SET_PROFILE_FORM,
  SET_SHARED,
  SET_USER_PROFILE,
  UPDATE_PROFILE_FORM,
} from "./types";
import Axios from "axios";
import Swal from "sweetalert2";
import { stringify, v4 as uuidv4 } from "uuid";
// Set overall Reducer
export const setShared = (data) => async (dispatch) => {
  try {
    dispatch({ type: SET_SHARED, payload: data });
  } catch (error) {
    console.log(error);
  }
};
// Set a single value in a profile form
export const setUserProfile = (data) => async (dispatch) => {
  try {
    dispatch({ type: SET_USER_PROFILE, payload: data });
  } catch (error) {
    console.log(error);
  }
};
// Filter Job Listing Page
export const applyJobFilter = () => async (dispatch) => {
  try {
    dispatch({ type: APPLY_JOB_FILTER });
  } catch (error) {
    console.log(error);
  }
};

// Filter Job Application on Application Page
export const filterJobApplications = (data) => async (dispatch) => {
  try {
    dispatch({ type: FILTER_USER_JOB_APPLICATIONS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

// Set Profile Form
export const setProfileForm = (data) => async (dispatch) => {
  try {
    dispatch({ type: SET_PROFILE_FORM, payload: data });
  } catch (error) {
    console.log(error);
  }
};
// set Profile Form for current User
export const updateProfileForm = (data) => async (dispatch) => {
  try {
    let user = { ...data };
    user.languages = user.languages.map((languageItem) => ({
      label: languageItem,
      value: languageItem,
    }));
    const { countryCode, country, type } = user;
    user.countryCode = countryCodes.find(
      (countryItem) => countryItem.value === countryCode
    );
    user.country = countries.find(
      (countryItem) => countryItem.value === country
    );
    if (type === 0) {
      // is Company
      user.companyExpertise = user.companyExpertise.map(
        (companyExpertiseItem) => ({
          label: companyExpertiseItem,
          value: companyExpertiseItem,
        })
      );
    } else {
      user.skills = user.skills.map((skillItem) => ({
        label: skillItem,
        value: skillItem,
      }));
      user.degree = user.degree.map((degreeItem) => ({
        label: degreeItem,
        value: degreeItem,
      }));
      user.workDomain = user.workDomain.map((workDomainItem) => ({
        label: workDomainItem,
        value: workDomainItem,
      }));
      const resumeFileNameParts = user.resumeFileName
        .toString()
        .split("_")
        .slice(1);
      const resumeFileName = resumeFileNameParts.join("_");
      user.resumeFileName = resumeFileName;
    }
    if (user.image) {
      const imageNameParts = user.image.toString().split("_").slice(1);
      const imageName = imageNameParts.join("_");
      user.image = imageName;
    }
    dispatch({ type: UPDATE_PROFILE_FORM, payload: user });
  } catch (error) {
    console.log(error);
  }
};
// Register a User(non Company)
export const registerUser = (data) => async (dispatch) => {
  try {
    // Clean Up data
    data.country = data.country.value;
    data.countryCode = data.countryCode.value;
    data.languages = JSON.stringify(
      data.languages.map((language) => language.value)
    );
    data.degree = JSON.stringify(data.degree.map((degree) => degree.value));
    data.skills = JSON.stringify(data.skills.map((skill) => skill.value));
    data.workDomain = JSON.stringify(
      data.workDomain.map((workDomain) => workDomain.value)
    );
    data.jobs = JSON.stringify(
      data.jobs.map(({ id, hasTitleError, hasCompanyError, ...rest }) => rest)
    );
    // Send to Server
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    const resp = await Axios.post(`${BASE_URL}/api/user/register`, formData);
    const token = resp.data.token;
    const currentUser = resp.data.user;
    localStorage.setItem("token", token);
    dispatch({
      type: SET_SHARED,
      payload: {
        name: "currentUser",
        value: currentUser,
      },
    });
    dispatch(updateProfileForm(currentUser));
    dispatch(getApplications());
    console.log(resp);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data.errors[0].msg;
      Swal.fire({
        icon: "error",
        title: "Error Occured",
        text: errorMessage,
      });
    }
    console.log(error);
  }
};
// Login a User
export const loginUser =
  ({ data, navigate }) =>
  async (dispatch) => {
    try {
      const resp = await Axios.post(`${BASE_URL}/api/user/login`, data);
      const token = resp.data.token;
      const currentUser = resp.data.user;
      localStorage.setItem("token", token);
      dispatch({
        type: SET_SHARED,
        payload: {
          name: "currentUser",
          value: currentUser,
        },
      });
      dispatch(updateProfileForm(currentUser));
      dispatch(getApplications());
      navigate("/dashboardprofile");
      console.log(resp);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Invalid Credentials",
        text: "Account was not Found",
      });
      console.log(error);
    }
  };
// Register a Company
export const registerCompany = (data) => async (dispatch) => {
  try {
    data.country = data.country.value;
    data.countryCode = data.countryCode.value;
    data.languages = data.languages.map((language) => language.value);
    data.companyExpertise = data.companyExpertise.map(
      (companyExpertise) => companyExpertise.value
    );
    const resp = await Axios.post(`${BASE_URL}/api/company/register`, data);
    const token = resp.data.token;
    const currentUser = resp.data.user;
    localStorage.setItem("token", token);
    dispatch({
      type: SET_SHARED,
      payload: {
        name: "currentUser",
        value: currentUser,
      },
    });
    dispatch(updateProfileForm(currentUser));
    console.log(resp);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data.errors[0].msg;
      Swal.fire({
        icon: "error",
        title: "Error Occured",
        text: errorMessage,
      });
    }
    console.log(error);
  }
};
// Login a Company
export const loginCompany =
  ({ data, navigate }) =>
  async (dispatch) => {
    try {
      const resp = await Axios.post(`${BASE_URL}/api/company/login`, data);
      const token = resp.data.token;
      const currentUser = resp.data.user;
      localStorage.setItem("token", token);
      dispatch({
        type: SET_SHARED,
        payload: {
          name: "currentUser",
          value: currentUser,
        },
      });
      dispatch(updateProfileForm(currentUser));
      navigate("/dashboardprofile");
      console.log(resp);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Invalid Credentials",
        text: "Company Account was not Found",
      });
      console.log(error.message);
    }
  };
// Logout
export const logout = () => async (dispatch) => {
  try {
    dispatch({
      type: SET_SHARED,
      payload: {
        name: "currentUser",
        value: null,
      },
    });
    dispatch({ type: RESET_CHAT });
    dispatch({ type: RESET_COMPANY });
    dispatch({ type: RESET_SHARED });
    localStorage.removeItem("token");
  } catch (error) {
    console.log(error);
  }
};
// Update a Company Profile
export const updateCompanyProfile = (data) => async (dispatch) => {
  dispatch(setShared({ name: "isLoading", value: true }));
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.getItem("token"));
    }
    data.country = data.country.value;
    data.countryCode = data.countryCode.value;
    data.languages = JSON.stringify(
      data.languages.map((language) => language.value)
    );
    data.companyExpertise = JSON.stringify(
      data.companyExpertise.map((companyExpertise) => companyExpertise.value)
    );
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    const resp = await Axios.post(
      `${BASE_URL}/api/company/updateCompanyProfile`,
      formData
    );
    const currentUser = resp.data.user;
    dispatch({
      type: SET_SHARED,
      payload: {
        name: "currentUser",
        value: currentUser,
      },
    });
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Profile Updated",
      showConfirmButton: false,
      timer: 1500,
    });
    console.log(resp);
  } catch (error) {
    console.log(error);
  }
  dispatch(setShared({ name: "isLoading", value: false }));
};

// Update a User Profile
export const updateUserProfile = (data) => async (dispatch) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.getItem("token"));
    }
    data.country = data.country.value;
    data.countryCode = data.countryCode.value;
    data.languages = JSON.stringify(
      data.languages.map((language) => language.value)
    );
    data.skills = JSON.stringify(data.skills.map((skill) => skill.value));
    data.degree = JSON.stringify(data.degree.map((degree) => degree.value));
    data.workDomain = JSON.stringify(
      data.workDomain.map((workDomain) => workDomain.value)
    );
    data.jobs = JSON.stringify(
      data.jobs.map(({ id, hasTitleError, hasCompanyError, ...rest }) => rest)
    );
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    const resp = await Axios.post(
      `${BASE_URL}/api/user/updateUserProfile`,
      formData
    );
    const currentUser = resp.data.user;
    dispatch({
      type: SET_SHARED,
      payload: {
        name: "currentUser",
        value: currentUser,
      },
    });
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Profile Updated",
      showConfirmButton: false,
      timer: 1500,
    });
    console.log(resp);
  } catch (error) {
    console.log(error);
  }
};

// Get all Companys Job
export const getJobs = () => async (dispatch) => {
  try {
    const resp = await Axios.get(`${BASE_URL}/api/user/getJobs`);
    const jobs = resp.data.jobs;
    dispatch(
      setShared({
        name: "jobsList",
        value: jobs,
      })
    );
    dispatch(
      setShared({
        name: "filteredjobsList",
        value: jobs,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

// Get all Companys Job
export const applyJob = (data) => async (dispatch) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.getItem("token"));
    }
    const resp = await Axios.post(`${BASE_URL}/api/user/applyJob`, data);
    const msg = resp.data.msg;
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: msg,
      showConfirmButton: false,
      timer: 1500,
    });
    dispatch(getApplications());
    dispatch(
      setShared({
        name: "showApplyBtn",
        value: false,
      })
    );
    dispatch(
      setShared({
        name: "applicationStatus",
        value: "pending",
      })
    );
  } catch (error) {
    console.log(error);
  }
};
// Get all Companys Job
export const getApplications = () => async (dispatch) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.getItem("token"));
    }
    const resp = await Axios.get(`${BASE_URL}/api/user/getApplications`);
    const applications = resp.data.applications;
    dispatch(
      setShared({
        name: "applications",
        value: applications,
      })
    );
    dispatch(
      setShared({
        name: "filteredApplications",
        value: applications,
      })
    );
  } catch (error) {
    console.log(error);
  }
};
// Get all Companys Job
export const isApplicationFound = (job) => async (dispatch) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.getItem("token"));
    }
    const resp = await Axios.get(`${BASE_URL}/api/user/getApplications`);
    const applications = resp.data.applications;
    const applicationFound = applications.find(
      (application) => application.jobId === job._id
    );
    const isapplicationFound = applicationFound ? true : false;
    dispatch(
      setShared({
        name: "applicationFound",
        value: isapplicationFound,
      })
    );
    dispatch(
      setShared({
        name: "applicationStatus",
        value: applicationFound.status,
      })
    );
  } catch (error) {
    console.log(error);
  }
};
// Helper Method to check if Object is empty or not
const isNotEmptyObject = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return true;
    }
  }
  return false;
};

// Parse Resume
export const parseResume =
  ({ file, skills, degree, jobs, isEdit }) =>
  async (dispatch) => {
    dispatch(setShared({ name: "isLoading", value: true }));
    try {
      const formData = new FormData();
      formData.append("cv", file);
      const resp = await Axios.post(`${PARSE_URL}`, formData);
      // Set Skills
      const parsedskills = resp.data.skills;
      const parsedskillsObj = parsedskills.map((skill) => ({
        label: skill,
        value: skill,
      }));
      const newSkills = [...skills, ...parsedskillsObj];
      if (isEdit) {
        dispatch(setUserProfile({ name: "skills", value: newSkills }));
      } else {
        dispatch(setShared({ name: "skills", value: newSkills }));
      }

      // Set Degree
      let Education = resp.data.Education;
      console.log(Education);
      if (Education instanceof Object) {
        if (Education.education) {
          if (isNotEmptyObject(Education.education)) {
            Education = Education.education;
          } else {
            Education = [];
          }
        } else {
          if (!isNotEmptyObject(Education)) {
            Education = [];
          }
        }
      }
      console.log(Education);
      const parsedDegrees = Education.map((degree) => ({
        label: degree,
        value: degree,
      }));
      const newDegrees = [...degree, ...parsedDegrees];
      if (isEdit) {
        dispatch(setUserProfile({ name: "degree", value: newDegrees }));
      } else {
        dispatch(setShared({ name: "degree", value: newDegrees }));
      }
      // Set Jobs
      let jobhistory = resp.data["Job History"];
      const parsedJobs = jobhistory.map((parsedJob) => {
        let parsedJobObj = {};
        const newJobId = uuidv4();
        const title = parsedJob["Job Title"];
        const company = parsedJob.Company;
        parsedJobObj.id = newJobId;
        parsedJobObj.title = title;
        parsedJobObj.company = company;
        let startDate = parsedJob["Start Date"];
        let endDate = parsedJob["End Date"];
        if (startDate !== "") {
          const [month, year] = startDate.split("-");
          startDate = new Date(`${year}-${parseInt(month)}-01`);
          parsedJobObj.startDate = startDate;
        }
        if (endDate !== "") {
          const [month, year] = endDate.split("-");
          endDate = new Date(`${year}-${parseInt(month)}-01`);
          parsedJobObj.endDate = endDate;
        }
        return parsedJobObj;
      });
      const newJobs = [...jobs, ...parsedJobs];
      // Set Raw Text
      const raw_text = resp.data.raw_text;
      if (isEdit) {
        dispatch(setUserProfile({ name: "jobs", value: newJobs }));
        dispatch(setUserProfile({ name: "raw_text", value: raw_text }));
      } else {
        dispatch(setShared({ name: "jobs", value: newJobs }));
        dispatch(setShared({ name: "raw_text", value: raw_text }));
      }
    } catch (error) {
      Swal.fire({
        icon: "info",
        title: "Could not parse resume",
        text: "Please fill the form yourself,the resume parser did not respond",
      });
      console.log(error);
    }
    dispatch(setShared({ name: "isLoading", value: false }));
  };
