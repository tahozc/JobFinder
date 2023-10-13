import {
  BASE_URL,
  FILTER_JOB_APPLICATIONS,
  RESET_ADD_JOB,
  SET_ADD_JOB,
  SET_COMPANY,
  SET_EDIT_JOB,
  SET_SHARED,
  SKILL_URL,
} from "./types";
import Axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import Swal from "sweetalert2";
// Set Overall Reducer
export const setCompany = (data) => async (dispatch) => {
  try {
    dispatch({ type: SET_COMPANY, payload: data });
  } catch (error) {
    console.log(error);
  }
};
// Set Add Job Object
export const setAddJob = (data) => async (dispatch) => {
  try {
    dispatch({ type: SET_ADD_JOB, payload: data });
  } catch (error) {
    console.log(error);
  }
};

// Filter Job Application
export const filterJobApplicants = (data) => async (dispatch) => {
  try {
    dispatch({ type: FILTER_JOB_APPLICATIONS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

// Set Edit Job Object
export const setEditJob = (data) => async (dispatch) => {
  try {
    dispatch({ type: SET_EDIT_JOB, payload: data });
  } catch (error) {
    console.log(error);
  }
};

// Add a Job
export const addCompanysJob =
  ({ data, navigate }) =>
  async (dispatch) => {
    dispatch({ type: SET_SHARED, payload: { name: "isLoading", value: true } });
    try {
      if (localStorage.token) {
        setAuthToken(localStorage.getItem("token"));
      }
      data.country = data.country.value;
      data.type = data.type.value;
      data.domain = JSON.stringify(
        data.domain.map((domainItem) => domainItem.value)
      );
      const jobDescription = data.description;
      const formData = new FormData();
      formData.append("text", jobDescription);
      const skillResp = await Axios.post(`${SKILL_URL}`, formData);
      const skills = skillResp.data;
      data.skills = JSON.stringify(skills);
      console.log(data);
      await Axios.post(`${BASE_URL}/api/company/addJob`, data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Job Added",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/dashboardjoblist");
      dispatch({ type: RESET_ADD_JOB });
    } catch (error) {
      console.log(error);
    }
    dispatch({
      type: SET_SHARED,
      payload: { name: "isLoading", value: false },
    });
  };

// Update a Job
export const updateCompanysJob =
  ({ data, navigate }) =>
  async (dispatch) => {
    dispatch({
      type: SET_SHARED,
      payload: { name: "isLoading", value: true },
    });
    try {
      if (localStorage.token) {
        setAuthToken(localStorage.getItem("token"));
      }
      data.country = data.country.value;
      data.type = data.type.value;
      data.domain = JSON.stringify(
        data.domain.map((domainItem) => domainItem.value)
      );
      const jobDescription = data.description;
      const formData = new FormData();
      formData.append("text", jobDescription);
      const skillResp = await Axios.post(`${SKILL_URL}`, formData);
      const skills = skillResp.data;
      data.skills = JSON.stringify(skills);
      console.log(data);

      await Axios.post(`${BASE_URL}/api/company/updateJob`, data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Job Updated",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/dashboardjoblist");
    } catch (error) {
      console.log(error);
    }
    dispatch({
      type: SET_SHARED,
      payload: { name: "isLoading", value: false },
    });
  };

// Get all Companys Job
export const getCompanyJobs = () => async (dispatch) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.getItem("token"));
    }

    const resp = await Axios.get(`${BASE_URL}/api/company/getCompanyJobs`);
    const jobs = resp.data.jobs;
    dispatch(
      setCompany({
        name: "jobs",
        value: jobs,
      })
    );
  } catch (error) {
    console.log(error);
  }
};
// Delete a Companys Job
export const deleteCompanyjob = (data) => async (dispatch) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.getItem("token"));
    }

    await Axios.post(`${BASE_URL}/api/company/deleteCompanyJob`, data);
    dispatch(getCompanyJobs());
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Job Deleted",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get all Users
export const getUsers = (data) => async (dispatch) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.getItem("token"));
    }

    const resp = await Axios.get(`${BASE_URL}/api/company/getUsers`);
    const users = resp.data.users;
    dispatch(
      setCompany({
        name: "usersList",
        value: users,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

// Update a Job
export const getApplicantsByJob = (data) => async (dispatch) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.getItem("token"));
    }
    const resp = await Axios.post(
      `${BASE_URL}/api/company/getApplicantsByJob`,
      data
    );
    const applications = resp.data.applications;
    dispatch(
      setCompany({
        name: "jobApplicantions",
        value: applications,
      })
    );
    dispatch(
      setCompany({
        name: "filteredjobApplicantions",
        value: applications,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

// Update an application Status
export const updateApplicationStatus = (data) => async (dispatch) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.getItem("token"));
    }
    await Axios.post(`${BASE_URL}/api/company/updateApplicationStatus`, data);
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Application Status Updated",
      showConfirmButton: false,
      timer: 1500,
    });
    dispatch(getApplicantsByJob(data));
  } catch (error) {
    console.log(error);
  }
};

// Get Recommended User for a Job
export const getRecommendedUsers = (data) => async (dispatch) => {
  dispatch(setCompany({ name: "recommendedLoader", value: true }));
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.getItem("token"));
    }
    const resp = await Axios.post(
      `${BASE_URL}/api/company/recommendedUsers`,
      data
    );
    const users = resp.data.users;
    dispatch(
      setCompany({
        name: "recommendedUsers",
        value: users,
      })
    );
  } catch (error) {
    console.log(error);
  }
  dispatch(setCompany({ name: "recommendedLoader", value: false }));
};

// Update an application Status
export const createOrUpdateApplicationStatus = (data) => async (dispatch) => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.getItem("token"));
    }
    await Axios.post(
      `${BASE_URL}/api/company/createOrUpdateApplicationStatus`,
      data
    );
    console.log(data);
    dispatch(getRecommendedUsers(data));
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Application Status Updated",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.log(error.message);
  }
};
