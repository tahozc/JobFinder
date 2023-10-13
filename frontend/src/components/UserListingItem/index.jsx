import React, { Fragment, useEffect, useState } from "react";
import "../JobListingItem/index.css";
import "./index.css";
import userLogo from "../../assets/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createOrUpdateApplicationStatus,
  setCompany,
  updateApplicationStatus,
} from "../../redux/actions/companyAction";
import Button from "../../shared/Button";
import { findOrCreateChat } from "../../redux/actions/chatAction";
const UserListingItem = ({
  user,
  showButtons,
  application,
  isRecommended,
  recommendedJob,
}) => {
  console.log(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(({ Shared }) => Shared.currentUser);
  const [timePassed, setTimePassed] = useState("");
  const setSelectedUser = () => {
    dispatch(
      setCompany({
        name: "selectedUser",
        value: user,
      })
    );
    navigate("/userlistingdetail");
  };
  const changeApplicationStatus = (status) => {
    if (isRecommended) {
      const user_Id = user._id;
      const job_Id = recommendedJob._id;
      let application_Id = null;
      if (application) {
        application_Id = application._id;
      }
      dispatch(
        createOrUpdateApplicationStatus({
          user_Id,
          job_Id,
          application_Id,
          status,
        })
      );
    } else {
      if (application) {
        const application_Id = application._id;
        const job_Id = application.jobId;
        console.log({
          application_Id,
          job_Id,
          status,
        });
        dispatch(updateApplicationStatus({ application_Id, status, job_Id }));
      }
    }
  };
  const onChatClick = () => {
    if (currentUser) {
      if (currentUser.type === 0) {
        const companyId = currentUser._id;
        const userId = user._id;
        const isCompany = true;
        dispatch(
          findOrCreateChat({
            sender: companyId,
            reciever: userId,
            isCompany,
          })
        );
        navigate("/chat");
      }
    }
    // dispatch(findOrCreateChat());
  };
  function formatDate(timestamp) {
    const currentDate = new Date();
    const date = new Date(timestamp);
    const timeDifference = currentDate - date;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    } else if (months > 0) {
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else if (days > 0) {
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else {
      return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
    }
  }
  useEffect(() => {
    if (application) {
      setTimePassed(formatDate(Date.parse(application.date)));
    } else {
      setTimePassed(formatDate(Date.parse(user.date)));
    }
  }, []);

  return (
    <Fragment>
      {user && (
        <div className="job-listing-item-main" onClick={setSelectedUser}>
          <div className="joblistingItem-container">
            <img
              src={
                user.image
                  ? require(`../../assets/profile/${user.image}`)
                  : userLogo
              }
              alt={"user.png"}
              className="joblistingItem-img"
            />
            <div className="joblistingItem-text-container">
              <div className="joblistingItem-text-header">{`${user.firstName} ${user.lastName}`}</div>
              <div className="joblistingItem-text-description">
                <div className="joblistingItem-text-description-item">
                  {user.workDomain && user.workDomain[0] && (
                    <span>{user.workDomain[0]}</span>
                  )}
                </div>
                <div className="joblistingItem-text-description-item">
                  <span>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </span>
                  {user.city}, {user.country}
                </div>
                <div className="joblistingItem-text-description-item">
                  {user.streetName}
                </div>
              </div>
            </div>
            <div className="joblistingItem-jobtiming-container">
              <div className="joblistingItem-jobtiming">{`${user.phoneNumber}`}</div>
              <div className="joblistingItem-postedtime">{timePassed}</div>
            </div>
          </div>
          {showButtons && application && (
            <div className="joblistingItem-btn-container">
              {application.status === "pending" ||
                (application.status === "approved" &&
                  application.status !== "hired" && (
                    <Button
                      text={"Hire"}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeApplicationStatus("hired");
                      }}
                      className={"primary"}
                    />
                  ))}
              {application.status === "pending" && (
                <Fragment>
                  <Button
                    text={"Approve"}
                    onClick={(e) => {
                      e.stopPropagation();
                      changeApplicationStatus("approved");
                    }}
                    className={"joblistingItem-recommend-btn"}
                  />
                  <Button
                    text={"Reject"}
                    onClick={(e) => {
                      e.stopPropagation();
                      changeApplicationStatus("rejected");
                    }}
                    className={"alt joblistingItem-recommend-btn "}
                  />
                </Fragment>
              )}
              {application.status === "rejected" && (
                <Fragment>
                  <Button
                    text={"REJECTED"}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={"joblistingItem-recommend-btn "}
                    disabled={true}
                  />
                </Fragment>
              )}
              {(application.status === "hired" ||
                application.status === "approved") && (
                <Button
                  text={"Chat"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChatClick();
                  }}
                  className={"secondary joblistingItem-recommend-btn "}
                />
              )}
            </div>
          )}
          {showButtons && isRecommended && !application && (
            <div className="joblistingItem-btn-container">
              <Fragment>
                <Button
                  text={"Approve"}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeApplicationStatus("approved");
                  }}
                  className={"joblistingItem-recommend-btn"}
                />
                <Button
                  text={"Reject"}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeApplicationStatus("rejected");
                  }}
                  className={"alt joblistingItem-recommend-btn "}
                />
              </Fragment>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default UserListingItem;
