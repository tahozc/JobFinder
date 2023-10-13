import React, { useEffect } from "react";
import withDashboard from "../../HOC/Dashboard";
import JobListingItem from "../../components/JobListingItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../../shared/Button";
import Pagination from "../../shared/Pagination";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCompanyjob,
  getCompanyJobs,
  setCompany,
} from "../../redux/actions/companyAction";
import { useNavigate } from "react-router-dom";
import countries from "../../constants/countries";
import { setShared } from "../../redux/actions/sharedAction";
import Swal from "sweetalert2";
const DashboardJobList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Company = useSelector(({ Company }) => Company);
  const { jobs, paginatedJobs, currentjobPage, totaljobPages, jobsPerPage } =
    Company;
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
        value: "Companys Jobs",
      })
    );
    // eslint-disable-next-line
  }, []);
  const setEditJobObject = (job) => {
    let editJob = job;
    editJob.jobId = editJob._id;
    const { domain, country, type } = editJob;
    editJob.domain = domain.map((domainItem) => {
      return { label: domainItem, value: domainItem };
    });
    editJob.type = { label: type, value: type };
    const selectedCountry = countries.find(
      (countryItem) => countryItem.value === country
    );
    editJob.country = selectedCountry;
    delete editJob.company;
    dispatch(
      setCompany({
        name: "editJob",
        value: editJob,
      })
    );
    navigate("/editjob");
  };
  const showConfirmationModal = () => {
    return new Promise((resolve) => {
      Swal({
        title: "Are you sure?",
        text: "You want to perform this action?",
        icon: "warning",
        buttons: ["No", "Yes"],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          resolve(true); // User clicked "Yes"
        } else {
          resolve(false); // User clicked "No"
        }
      });
    });
  };
  const deleteJobItem = async (job) => {
    const jobId = job._id;
    Swal.fire({
      title: `Are you sure you want to delete the Job(${job.title})?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCompanyjob({ jobId }));
      }
    });
  };
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
  return (
    <div className="dashboardlist-container">
      <div className="dashboardlist-items-container">
        <div className="dashboardlist-items-add-container">
          <Button text={"Add Job"} onClick={() => navigate("/createjob")} />
        </div>
        {jobs.length < 1 ? (
          <div className="no-jobs-found">No Jobs Found</div>
        ) : (
          paginatedJobs.map((job, index) => (
            <div className="dashboardlist-item" key={index}>
              <JobListingItem job={job} />
              <div
                className="dashboardlist-item-icon edit"
                onClick={() => setEditJobObject(job)}
              >
                <FontAwesomeIcon icon={faPencil} />
              </div>
              <div
                className="dashboardlist-item-icon delete"
                onClick={() => deleteJobItem(job)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </div>
          ))
        )}

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
      </div>
    </div>
  );
};

export default withDashboard(DashboardJobList);
