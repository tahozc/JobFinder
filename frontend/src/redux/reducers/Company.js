import {
  FILTER_JOB_APPLICATIONS,
  RESET_ADD_JOB,
  RESET_COMPANY,
  SET_ADD_JOB,
  SET_COMPANY,
  SET_EDIT_JOB,
} from "../actions/types";

const initialState = {
  addJob: {
    title: "",
    type: "",
    city: "",
    country: "",
    hourlyRate: "",
    budget: "",
    deadline: null,
    startDate: new Date(),
    endDate: null,
    domain: "",
    description: "",
    duties: "",
    experience: "",
  },
  editJob: {
    jobId: "",
    title: "",
    type: "",
    city: "",
    country: "",
    hourlyRate: "",
    budget: "",
    deadline: null,
    startDate: new Date(),
    endDate: null,
    domain: "",
    description: "",
    duties: "",
    experience: "",
  },
  jobs: [],
  paginatedJobs: [],
  currentjobPage: 1,
  totaljobPages: 1,
  jobsPerPage: 5,
  usersList: [],
  selectedUser: null,
  selectedJobApplication: null,
  jobApplicantions: [],
  filteredjobApplicantions: [],
  filterStatusText: "all",
  paginatedJobApplicantions: [],
  currentjobApplicationPage: 1,
  totaljobApplicationPages: 1,
  jobApplicationssPerPage: 5,
  recommendedJob: null,
  recommendedLoader: false,
  recommendedUsers: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_COMPANY: {
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    }
    case SET_ADD_JOB: {
      return {
        ...state,
        addJob: {
          ...state.addJob,
          [action.payload.name]: action.payload.value,
        },
      };
    }
    case SET_EDIT_JOB: {
      return {
        ...state,
        editJob: {
          ...state.editJob,
          [action.payload.name]: action.payload.value,
        },
      };
    }
    case RESET_ADD_JOB: {
      return {
        ...state,
        addJob: {
          title: "",
          type: "",
          city: "",
          country: "",
          hourlyRate: "",
          budget: "",
          deadline: new Date(),
          startDate: new Date(),
          endDate: new Date(),
          domain: "",
          description: "",
          duties: "",
          experience: "",
        },
      };
    }
    case FILTER_JOB_APPLICATIONS: {
      const { jobApplicantions } = state;
      const status = action.payload;
      const newJobApplications = jobApplicantions.filter((job) =>
        status === "all" ? true : job.status === status
      );
      return {
        ...state,
        filteredjobApplicantions: newJobApplications,
      };
    }
    case RESET_COMPANY: {
      return initialState;
    }
    default:
      return state;
  }
};
