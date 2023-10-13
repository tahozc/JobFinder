import React, { Fragment, useEffect } from "react";
import "./index.css";
import jobLogo from "../../assets/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setShared } from "../../redux/actions/sharedAction";
import { setCompany } from "../../redux/actions/companyAction";
import Button from "../../shared/Button";
const JobListingItem = ({
  job,
  showButtons,
  setJob,
  isUserApplication,
  application,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setSelectedJob = () => {
    dispatch(
      setShared({
        name: "selectedJob",
        value: job,
      })
    );
    navigate("/joblistingdetail");
  };
  useEffect(() => {
    if (!job) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);
  return (
    <Fragment>
      {job && (
        <Fragment>
          <div className="job-listing-item-main">
            <div className="joblistingItem-container" onClick={setSelectedJob}>
              <img
                src={
                  job.company
                    ? job.company.image
                      ? require(`../../assets/profile/${job.company.image}`)
                      : jobLogo
                    : jobLogo
                }
                alt={"company.png"}
                className="joblistingItem-img"
              />
              <div className="joblistingItem-text-container">
                <div className="joblistingItem-text-header">
                  {job.company && job?.company.companyName.toString()}
                </div>
                <div className="joblistingItem-text-description">
                  <div className="joblistingItem-text-description-item">
                    {job.title}
                  </div>
                  <div className="joblistingItem-text-description-item">
                    <span>
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </span>
                    {job.city.toString()}, {job.country.toString()}
                  </div>
                  <div className="joblistingItem-text-description-item">
                    ${job.budget.toString()}
                  </div>
                </div>
              </div>
              <div className="joblistingItem-jobtiming-container">
                <div className="joblistingItem-jobtiming">
                  {job.type.toString()}
                </div>
                <div className="joblistingItem-postedtime">7 hours ago</div>
              </div>
            </div>{" "}
            <div className="joblistingItem-btn-container">
              {isUserApplication && application && (
                <Fragment>
                  <Button
                    text={application.status.toString().toUpperCase()}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={"joblistingItem-recommend-btn"}
                  />
                  {(application.status === "hired" ||
                    application.status === "approved") && (
                    <Button
                      text={"Chat"}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/chat");
                      }}
                      className={"alt joblistingItem-recommend-btn "}
                    />
                  )}
                </Fragment>
              )}
            </div>
            {showButtons && (
              <div className="joblistingItem-btn-container">
                <Button
                  text={"View Applicants"}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(
                      setCompany({
                        name: "selectedJobApplication",
                        value: job,
                      })
                    );
                    navigate("/jobapplicants");
                  }}
                />
                <Button
                  text={"View Recommended"}
                  className={"alt joblistingItem-recommend-btn "}
                  onClick={() => setJob(job)}
                />
              </div>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default JobListingItem;
