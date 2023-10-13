import React, { useEffect } from "react";
import withDashboard from "../../HOC/Dashboard";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import JobListingItem from "../../components/JobListingItem";
import Pagination from "../../shared/Pagination";
import { getCompanyJobs, setCompany } from "../../redux/actions/companyAction";
import { useNavigate } from "react-router-dom";
import { setShared } from "../../redux/actions/sharedAction";

const CompanyJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(({ Shared }) => Shared.currentUser);
  useEffect(() => {
    if (currentUser) {
      if (currentUser.type !== 0) {
        navigate("/");
      } else {
        dispatch(getCompanyJobs());
      }
    } else {
      navigate("/");
    }
    dispatch(
      setShared({
        name: "DashboardPage",
        value: "Applications",
      })
    );
    // eslint-disable-next-line
  }, []);

  const Company = useSelector(({ Company }) => Company);
  const { jobs, paginatedJobs, currentjobPage, totaljobPages, jobsPerPage } =
    Company;
  const jobsToShow = jobs.length > jobsPerPage ? paginatedJobs : jobs;
  const setTotalPages = (totalpages) => {
    dispatch(
      setCompany({
        name: "totaljobPages",
        value: totalpages,
      })
    );
  };
  const setCurrentPage = (currentPage) => {
    dispatch(
      setCompany({
        name: "currentjobPage",
        value: currentPage,
      })
    );
  };
  const setpaginatedItems = (paginatedItems) => {
    dispatch(
      setCompany({
        name: "paginatedJobs",
        value: paginatedItems,
      })
    );
  };
  const setUserRecommendedJob = (job) => {
    dispatch(
      setCompany({
        name: "recommendedJob",
        value: job,
      })
    );
    navigate("/recommendedUsers");
  };
  return (
    <div className="companyjobs-container">
      <div className="companyjobs-item-container">
        {jobs.length < 1 ? (
          <div className="no-jobs-found">No Jobs Found</div>
        ) : (
          jobsToShow.map((job, index) => {
            return (
              <JobListingItem
                job={job}
                showButtons={true}
                key={index}
                setJob={setUserRecommendedJob}
              />
            );
          })
        )}
      </div>
      <div className="companyjobs-pagination-container">
        {jobs.length > jobsPerPage && (
          <div className="dashboardlist-item-pagination-container">
            <Pagination
              currentPage={currentjobPage}
              setCurrentPage={setCurrentPage}
              items={jobs}
              totalPages={totaljobPages}
              setTotalPages={setTotalPages}
              itemsPerPage={jobsPerPage}
              setpaginatedItems={setpaginatedItems}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default withDashboard(CompanyJobs);
