import React, { Fragment, useState } from "react";
import ListingHeroHeader from "../../components/ListingHeroHeader";
import Container from "../../shared/Container";
import Button from "../../shared/Button";
import "../JobListingDetail/index.css";
import "./index.css";
import { useSelector } from "react-redux";

import Moment from "react-moment";
import UserListingItem from "../../components/UserListingItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const UserDetail = () => {
  // const currentUser = useSelector(({ Shared }) => Shared.currentUser);
  const user = useSelector(({ Company }) => Company.selectedUser);
  const [dateFormat] = useState("DD MMM YYYY");
  const navigate = useNavigate("/");
  const showResume = () => {
    if (!user) {
      navigate("/");
      if (user.type === 1) {
        navigate("/");
      }
    }
    if (user.resumeFileName) {
      window.open(
        require(`../../assets/resume/${user.resumeFileName}`),
        "_blank"
      );
    }
  };
  return (
    user && (
      <Fragment>
        <ListingHeroHeader text={"Full Stack Developer"} />
        <Container>
          <div className="joblistingdetail-container">
            <div className="joblistingdetail-row">
              <div className="joblistingdetail-info-container">
                <UserListingItem user={user} />
                <div className="joblistingdetail-text-container">
                  <div className="joblistingdetail-text-header">
                    Job Description
                  </div>
                  <div className="joblistingdetail-text-desc">
                    {user.companydesc}
                  </div>
                </div>
                <div className="joblistingdetail-text-container">
                  <div className="joblistingdetail-text-header">
                    Experiences
                  </div>
                  <div className="joblistingdetail-text-desc">
                    {user.jobs.map((job, index) => (
                      <div
                        className="joblistingdetail-bullet-point"
                        key={index}
                      >
                        <span>◉</span>
                        {job.company}, {job.title}.{" "}
                        {job.startDate && (
                          <Fragment>
                            <FontAwesomeIcon icon={faCalendar} />{" "}
                            <Moment format={dateFormat} date={job.startDate} />
                          </Fragment>
                        )}
                        {job.endDate && (
                          <Moment format={dateFormat} date={job.endDate} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="joblistingdetail-text-container">
                  <div className="joblistingdetail-text-header">
                    Work Domain:
                  </div>
                  <div className="joblistingdetail-text-desc">
                    {user.workDomain.map((workDomain, index) => (
                      <div
                        className="joblistingdetail-bullet-point"
                        key={index}
                      >
                        <span>◉</span>
                        {workDomain}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="joblistingdetail-text-container">
                  <div className="joblistingdetail-text-header">Skills</div>
                  {user.skills.map((skill, index) => {
                    return (
                      <div className="joblistingdetail-text-desc" key={index}>
                        <div className="joblistingdetail-bullet-point">
                          <span>◉</span>
                          {skill}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="joblistingdetail-text-container">
                  <div className="joblistingdetail-text-header">Degrees</div>
                  {user.degree.map((degree, index) => {
                    return (
                      <div className="joblistingdetail-text-desc" key={index}>
                        <div className="joblistingdetail-bullet-point">
                          <span>◉</span>
                          {degree}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="joblistingdetail-text-container">
                  <div className="joblistingdetail-text-header">Languages</div>
                  {user.languages.map((language, index) => {
                    return (
                      <div className="joblistingdetail-text-desc" key={index}>
                        <div className="joblistingdetail-bullet-point">
                          <span>◉</span>
                          {language}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="joblistingdetail-apply-container">
                <div className="joblistingdetail-joboverview-container">
                  <div className="joblistingdetail-joboverview-header">
                    Job Overiew
                  </div>
                  <div className="joblistingdetail-joboverview-row">
                    <div className="joblistingdetail-joboverview-item">
                      Joining date :
                    </div>
                    <div className="joblistingdetail-joboverview-item">
                      <Moment format={dateFormat} date={user.date} />
                    </div>
                  </div>
                  <div className="joblistingdetail-joboverview-row">
                    <div className="joblistingdetail-joboverview-item">
                      Country :
                    </div>
                    <div className="joblistingdetail-joboverview-item">
                      {user.country}
                    </div>
                  </div>
                  <div className="joblistingdetail-joboverview-row">
                    <div className="joblistingdetail-joboverview-item">
                      City :
                    </div>
                    <div className="joblistingdetail-joboverview-item">
                      {user.city}
                    </div>
                  </div>
                  <div className="joblistingdetail-joboverview-row">
                    <div className="joblistingdetail-joboverview-item">
                      Street Number:
                    </div>
                    <div className="joblistingdetail-joboverview-item">
                      {" "}
                      {user.streetNumber}
                    </div>
                  </div>
                  <div className="joblistingdetail-joboverview-row">
                    <div className="joblistingdetail-joboverview-item">
                      Street Name :
                    </div>
                    <div className="joblistingdetail-joboverview-item">
                      {" "}
                      {user.streetName}
                    </div>
                  </div>
                  <div className="joblistingdetail-joboverview-row">
                    <div className="joblistingdetail-joboverview-item">
                      Birth date :
                    </div>
                    <div className="joblistingdetail-joboverview-item">
                      <Moment format={dateFormat} date={user.bithdate} />
                    </div>
                  </div>
                  <div className="joblistingdetail-applynow-btn-container">
                    <Button text={"View Resume"} onClick={showResume} />
                  </div>
                </div>
                <div className="joblistingdetail-text-header">
                  User Information
                </div>
                <div className="joblistingdetail-generalInfo-container">
                  <div className="joblistingdetail-generalInfo-item">
                    <span>Name:</span>
                    {`${user.firstName} ${user.lastName}`}
                  </div>
                  {user.phoneNumber && (
                    <div className="joblistingdetail-generalInfo-item">
                      <span>Phone Number:</span>
                      {`${user.countryCode} ${user.phoneNumber}`}
                    </div>
                  )}
                  {user.website && (
                    <div className="joblistingdetail-generalInfo-item">
                      <span>Web:</span>
                      {user.website}
                    </div>
                  )}
                  {user.email && (
                    <div className="joblistingdetail-generalInfo-item">
                      <span>Email:</span>
                      {user.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Fragment>
    )
  );
};

export default UserDetail;
