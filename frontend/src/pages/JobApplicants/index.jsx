import React, { useEffect } from "react";
import withDashboard from "../../HOC/Dashboard";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import UserListingItem from "../../components/UserListingItem";
import Pagination from "../../shared/Pagination";
import {
  filterJobApplicants,
  getApplicantsByJob,
  setCompany,
} from "../../redux/actions/companyAction";
import { useNavigate } from "react-router-dom";

const JobApplicants = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Company = useSelector(({ Company }) => Company);
  const {
    jobApplicantions,
    filteredjobApplicantions,
    filterStatusText,
    paginatedJobApplicantions,
    currentjobApplicationPage,
    totaljobApplicationPages,
    jobApplicationssPerPage,
    selectedJobApplication,
  } = Company;
  const currentUser = useSelector(({ Shared }) => Shared.currentUser);
  useEffect(() => {
    if (currentUser) {
      if (currentUser.type !== 0) {
        navigate("/");
      } else {
        if (selectedJobApplication) {
          const job_Id = selectedJobApplication._id;
          dispatch(getApplicantsByJob({ job_Id }));
        } else {
          navigate("/companyJobs");
        }
      }
    } else {
      navigate("/");
    }

    // eslint-disable-next-line
  }, []);
  const setTotalPages = (totalpages) => {
    dispatch(
      setCompany({
        name: "totaljobApplicationPages",
        value: totalpages,
      })
    );
  };
  const setCurrentPage = (currentPage) => {
    dispatch(
      setCompany({
        name: "currentjobApplicationPage",
        value: currentPage,
      })
    );
  };
  const setpaginatedItems = (paginatedItems) => {
    dispatch(
      setCompany({
        name: "paginatedJobApplicantions",
        value: paginatedItems,
      })
    );
  };
  const onJobFilterChange = (status) => {
    dispatch(filterJobApplicants(status));
    dispatch(
      setCompany({
        name: "filterStatusText",
        value: status,
      })
    );
  };
  return (
    selectedJobApplication && (
      <div className="jobapplicants-container">
        <div className="auth-accordian-container">
          <div className="auth-accordian-row">
            <div
              className={`auth-accordian-item ${
                filterStatusText === "all" && "selected"
              }`}
              onClick={() => onJobFilterChange("all")}
            >
              All
            </div>
            <div
              className={`auth-accordian-item ${
                filterStatusText === "pending" && "selected"
              }`}
              onClick={() => onJobFilterChange("pending")}
            >
              Pending
            </div>
            <div
              className={`auth-accordian-item ${
                filterStatusText === "approved" && "selected"
              }`}
              onClick={() => onJobFilterChange("approved")}
            >
              Approved
            </div>
            <div
              className={`auth-accordian-item ${
                filterStatusText === "hired" && "selected"
              }`}
              onClick={() => onJobFilterChange("hired")}
            >
              Hired
            </div>{" "}
            <div
              className={`auth-accordian-item ${
                filterStatusText === "rejected" && "selected"
              }`}
              onClick={() => onJobFilterChange("rejected")}
            >
              Rejected
            </div>
          </div>
        </div>
        <div className="jobapplicants-items-container">
          {paginatedJobApplicantions.map((application, index) => {
            const user = application.user;
            return (
              <div className="jobapplicants-item">
                <UserListingItem
                  user={user}
                  showButtons={true}
                  application={application}
                  key={index}
                />
              </div>
            );
          })}
        </div>
        <div className="applications-pagination-container">
          <div className="dashboardlist-item-pagination-container">
            <Pagination
              currentPage={currentjobApplicationPage}
              setCurrentPage={setCurrentPage}
              items={filteredjobApplicantions}
              totalPages={totaljobApplicationPages}
              setTotalPages={setTotalPages}
              itemsPerPage={jobApplicationssPerPage}
              setpaginatedItems={setpaginatedItems}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default withDashboard(JobApplicants);
