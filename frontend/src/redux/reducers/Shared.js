import {
  APPLY_JOB_FILTER,
  FILTER_USER_JOB_APPLICATIONS,
  RESET_SHARED,
  SET_PROFILE_FORM,
  SET_SHARED,
  SET_USER_PROFILE,
  UPDATE_PROFILE_FORM,
} from "../actions/types";
import moment from "moment";
const initialState = {
  DashboardPage: "",
  isSidebarOpen: false,
  isCompany: true,
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  companyName: "",
  fiscalNumber: "",
  creationDate: new Date(),
  birthdate: new Date(),
  website: "",
  countryCode: "",
  phoneNumber: "",
  streetNumber: "",
  streetName: "",
  city: "",
  country: "",
  languages: "",
  resumeFile: null,
  resumeFileName: "",
  workDomain: [],
  skills: [],
  jobs: [],
  degree: [],
  companydesc: "",
  companyExpertise: "",
  currentUser: null,
  jobsList: [],
  filteredjobsList: [],
  paginatedJobsList: [],
  currentJobsListPage: 1,
  totalJobsListPages: 1,
  JobsListPerPage: 5,
  selectedJob: null,
  applications: [],
  applicationFound: false,
  filteredApplications: [],
  filterStatusText: "all",
  paginatedApplications: [],
  currentApplicationPage: 1,
  totalApplicationPages: 1,
  applicationsPerPage: 5,
  isLoading: false,
  raw_text: "",
  showApplyBtn: true,
  applicationStatus: "",
  profileForm: {
    firstName: "",
    lastName: "",
    companyName: "",
    fiscalNumber: "",
    creationDate: new Date(),
    birthdate: new Date(),
    website: "",
    countryCode: "",
    phoneNumber: "",
    streetNumber: "",
    streetName: "",
    city: "",
    country: "",
    languages: "",
    resumeFileName: "",
    resumeFileName: "",
    workDomain: "",
    skills: "",
    jobs: [],
    degree: "",
    companydesc: "",
    companyExpertise: "",
    image: "",
    profileImageFile: null,
    raw_text: "",
  },
  maxSalarySlider: 100000,
  // Filters
  jobDomainFilter: [],
  jobtypeFilter: null,
  countryFilter: null,
  cityFilter: "",
  startDateFilter: null,
  endDateFilter: null,
  startSalaryFilter: 0,
  endSalaryFilter: 100000,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SHARED: {
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    }
    case SET_USER_PROFILE: {
      return {
        ...state,
        profileForm: {
          ...state.profileForm,
          [action.payload.name]: action.payload.value,
        },
      };
    }
    case SET_PROFILE_FORM: {
      return {
        ...state,
        profileForm: {
          ...state.profileForm,
          [action.payload.name]: action.payload.value,
        },
      };
    }
    case UPDATE_PROFILE_FORM:
      const updatedProfileForm = { ...state.profileForm };
      Object.keys(updatedProfileForm).forEach((key) => {
        if (action.payload.hasOwnProperty(key)) {
          updatedProfileForm[key] = action.payload[key];
        }
      });
      return {
        ...state,
        profileForm: updatedProfileForm,
      };
    case APPLY_JOB_FILTER:
      const {
        jobDomainFilter,
        jobtypeFilter,
        countryFilter,
        cityFilter,
        startDateFilter,
        endDateFilter,
        startSalaryFilter,
        endSalaryFilter,
        maxSalarySlider,
      } = state;
      const cityRegex = new RegExp(cityFilter, "i");
      const filteredJobs = state.jobsList.filter((job) => {
        // Job Domain Filter
        const domainFilter =
          jobDomainFilter.length === 0 ||
          job.domain.some((domain) =>
            jobDomainFilter.some((filter) => filter.value === domain)
          );
        // Job Type Filter
        const jobtype =
          jobtypeFilter === null || jobtypeFilter.value === job.type;
        // Job Country Filter
        const countryMatch =
          countryFilter === null || countryFilter.value === job.country;
        // Job City Filter
        const cityMatch = cityFilter === "" || cityRegex.test(job.city);
        // Job StartDate Filter
        const startDateMatch =
          startDateFilter === null ||
          new Date(job.startDate) >= new Date(startDateFilter);

        // Job endDate(optional) Filter
        const endDateMatch =
          endDateFilter === null ||
          (job.endDate
            ? new Date(job.endDate) <= new Date(endDateFilter)
            : true);
        // Salary Filter
        const startSalaryMatch = job.budget >= startSalaryFilter;
        const endSalaryMatch =
          endSalaryFilter === maxSalarySlider
            ? true
            : job.budget <= endSalaryFilter;

        const salaryMatch = startSalaryMatch && endSalaryMatch;

        return (
          domainFilter &&
          jobtype &&
          countryMatch &&
          cityMatch &&
          startDateMatch &&
          endDateMatch &&
          salaryMatch
        );
      });
      return { ...state, filteredjobsList: filteredJobs };
    case RESET_SHARED: {
      return initialState;
    }
    case FILTER_USER_JOB_APPLICATIONS: {
      const { applications } = state;
      const status = action.payload;
      const newApplications = applications.filter((application) => {
        return status === "all" ? true : application.status === status;
      });
      return {
        ...state,
        filteredApplications: newApplications,
      };
    }
    default:
      return state;
  }
};
