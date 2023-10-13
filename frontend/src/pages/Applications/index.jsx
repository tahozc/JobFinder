import React, { useEffect } from "react";
import withDashboard from "../../HOC/Dashboard";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import JobListingItem from "../../components/JobListingItem";
import Pagination from "../../shared/Pagination";
import {
  filterJobApplications,
  getApplications,
  setShared,
} from "../../redux/actions/sharedAction";
import { useNavigate } from "react-router-dom";

const Applications = () => {
  const Shared = useSelector(({ Shared }) => Shared);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    applications,
    filteredApplications,
    paginatedApplications,
    currentApplicationPage,
    totalApplicationPages,
    applicationsPerPage,
    filterStatusText,
    currentUser,
  } = Shared;

  useEffect(() => {
    if (currentUser) {
      if (currentUser.type !== 1) {
        navigate("/");
      }
      dispatch(getApplications());
    } else {
      navigate("/");
    }
    dispatch(
      setShared({
        name: "DashboardPage",
        value: "Applications",
      })
    );
  }, []);

  const setTotalPages = (totalpages) => {
    dispatch(
      setShared({
        name: "totalApplicationPages",
        value: totalpages,
      })
    );
  };
  const setCurrentPage = (currentPage) => {
    dispatch(
      setShared({
        name: "currentApplicationPage",
        value: currentPage,
      })
    );
  };
  const setpaginatedItems = (paginatedItems) => {
    dispatch(
      setShared({
        name: "paginatedApplications",
        value: paginatedItems,
      })
    );
  };
  const onJobFilterChange = (status) => {
    dispatch(filterJobApplications(status));
    dispatch(
      setShared({
        name: "filterStatusText",
        value: status,
      })
    );
  };
  return (
    <div className="applications-container">
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
      <div className="applications-item-container">
        {paginatedApplications.map((application, index) => {
          const job = application.job;
          return (
            <div className="applications-item">
              <JobListingItem
                job={job}
                key={index}
                application={application}
                isUserApplication={true}
              />{" "}
            </div>
          );
        })}
      </div>
      <div className="applications-pagination-container">
        <Pagination
          currentPage={currentApplicationPage}
          setCurrentPage={setCurrentPage}
          items={filteredApplications}
          totalPages={totalApplicationPages}
          setTotalPages={setTotalPages}
          itemsPerPage={applicationsPerPage}
          setpaginatedItems={setpaginatedItems}
        />
      </div>
    </div>
  );
};

export default withDashboard(Applications);
