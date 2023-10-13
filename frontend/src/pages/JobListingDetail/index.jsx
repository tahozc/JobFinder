import React, { Fragment, useEffect, useState } from "react";
import ListingHeroHeader from "../../components/ListingHeroHeader";
import Container from "../../shared/Container";
import JobListingItem from "../../components/JobListingItem";
import Button from "../../shared/Button";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Moment from "react-moment";
import {
  applyJob,
  getApplications,
  isApplicationFound,
  setShared,
} from "../../redux/actions/sharedAction";
const JobListingDetail = () => {
  const Shared = useSelector(({ Shared }) => Shared);

  const { selectedJob, applications, showApplyBtn, applicationStatus, currentUser } =
    Shared;
  const job = selectedJob;
  const [dateFormat] = useState("DD MMM YYYY");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!job) {
      navigate("/joblistings");
      return;
    }
    if (currentUser) {
      if (currentUser.type === 1) {
        dispatch(isApplicationFound(job));
      }
    }
    // eslint-disable-next-line
  }, [applicationStatus, showApplyBtn]);
  const ApplyForJob = () => {
    if (currentUser) {
      if (currentUser.type === 1) {
        const job_id = job._id;
        dispatch(applyJob({ job_id }));
      }
    } else {
      navigate("/");
    }
  };

  return (
    job && (
      <Fragment>
        <ListingHeroHeader text={job.title} />
        <Container>
          <div className="joblistingdetail-container">
            <div className="joblistingdetail-row">
              <div className="joblistingdetail-info-container">
                <JobListingItem job={job} />
                <div className="joblistingdetail-text-container">
                  <div className="joblistingdetail-text-header">
                    Job Description
                  </div>
                  <div className="joblistingdetail-text-desc">
                    {job.description}
                  </div>
                </div>
                <div className="joblistingdetail-text-container">
                  <div className="joblistingdetail-text-header">
                    Responsibilities and Duties
                  </div>
                  <div className="joblistingdetail-text-desc">
                    {/* <div className="joblistingdetail-bullet-point">
                    <span>◉</span> System Software Development
                  </div> */}
                    {job.duties}
                  </div>
                </div>
                <div className="joblistingdetail-text-container">
                  <div className="joblistingdetail-text-header">Experience</div>
                  <div className="joblistingdetail-text-desc">
                    {" "}
                    {job.experience}
                  </div>
                </div>
                <div className="joblistingdetail-text-container">
                  <div className="joblistingdetail-text-header">
                    Job Domains
                  </div>
                  <div className="joblistingdetail-text-desc">
                    {job.domain &&
                      job.domain.map((domainItem, index) => {
                        return (
                          <div
                            className="joblistingdetail-text-desc"
                            key={index}
                          >
                            <div className="joblistingdetail-bullet-point">
                              <span>◉</span>
                              {domainItem}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <div className="joblistingdetail-text-container">
                  <div className="joblistingdetail-text-header">Skills</div>
                  <div className="joblistingdetail-text-desc">
                    {job.skills &&
                      job.skills.map((skill, index) => {
                        return (
                          <div
                            className="joblistingdetail-text-desc"
                            key={index}
                          >
                            <div className="joblistingdetail-bullet-point">
                              <span>◉</span>
                              {skill}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              <div className="joblistingdetail-apply-container">
                <div className="joblistingdetail-joboverview-container">
                  <div className="joblistingdetail-joboverview-header">
                    Job Overiew
                  </div>
                  <div className="joblistingdetail-joboverview-row">
                    <div className="joblistingdetail-joboverview-item">
                      Posted date :
                    </div>
                    <div className="joblistingdetail-joboverview-item">
                      <Moment format={dateFormat} date={job.date} />
                    </div>
                  </div>
                  <div className="joblistingdetail-joboverview-row">
                    <div className="joblistingdetail-joboverview-item">
                      Country :
                    </div>
                    <div className="joblistingdetail-joboverview-item">
                      {job.country}
                    </div>
                  </div>
                  <div className="joblistingdetail-joboverview-row">
                    <div className="joblistingdetail-joboverview-item">
                      City :
                    </div>
                    <div className="joblistingdetail-joboverview-item">
                      {job.city}
                    </div>
                  </div>
                  <div className="joblistingdetail-joboverview-row">
                    <div className="joblistingdetail-joboverview-item">
                      Job Type:
                    </div>
                    <div className="joblistingdetail-joboverview-item">
                      {" "}
                      {job.type}
                    </div>
                  </div>
                  <div className="joblistingdetail-joboverview-row">
                    <div className="joblistingdetail-joboverview-item">
                      Salary :
                    </div>
                    <div className="joblistingdetail-joboverview-item">
                      {" "}
                      ${job.budget} yearly
                    </div>
                  </div>
                  {job.deadline && (
                    <div className="joblistingdetail-joboverview-row">
                      <div className="joblistingdetail-joboverview-item">
                        Application Deadline:
                      </div>
                      <div className="joblistingdetail-joboverview-item">
                        <Moment format={dateFormat} date={job.deadline} />
                      </div>
                    </div>
                  )}

                  <div className="joblistingdetail-joboverview-row">
                    <div className="joblistingdetail-joboverview-item">
                      Start Date:
                    </div>
                    <div className="joblistingdetail-joboverview-item">
                      <Moment format={dateFormat} date={job.startDate} />
                    </div>
                  </div>
                  {job.endDate && (
                    <div className="joblistingdetail-joboverview-row">
                      <div className="joblistingdetail-joboverview-item">
                        End Date:
                      </div>
                      <div className="joblistingdetail-joboverview-item">
                        <Moment format={dateFormat} date={job.endDate} />
                      </div>
                    </div>
                  )}
                  {currentUser && currentUser?.type === 1 && (
                    <div className="joblistingdetail-applynow-btn-container">
                      {showApplyBtn ? (
                        <Button text={"Apply Now"} onClick={ApplyForJob} />
                      ) : (
                        <Button text={applicationStatus.toUpperCase()} />
                      )}
                    </div>
                  )}
                </div>
                <div className="joblistingdetail-text-header">
                  Company Information
                </div>
                <div className="joblistingdetail-text-container">
                  <div className="joblistingdetail-text-header">
                    {job.company.companyName}
                  </div>
                  <div className="joblistingdetail-text-desc">
                    {job.company.companydesc}
                  </div>
                </div>
                <div className="joblistingdetail-generalInfo-container">
                  <div className="joblistingdetail-generalInfo-item">
                    <span>Name:</span>
                    {job.company.companyName}
                  </div>
                  <div className="joblistingdetail-generalInfo-item">
                    <span>Web:</span>
                    {job.company.website}
                  </div>
                  <div className="joblistingdetail-generalInfo-item">
                    <span>Email:</span>
                    {job.company.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Fragment>
    )
  );
};

export default JobListingDetail;
