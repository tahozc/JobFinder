import React, { Fragment, useState } from "react";
import Input from "../../shared/Input";
import Datepicker from "../../shared/Datepicker";
import { faCalendar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";

const JobHistory = ({ index, jobItem, jobs, setjobs, removeItem }) => {
  const {
    id,
    title,
    company,
    startDate,
    endDate,
    hasTitleError,
    hasCompanyError,
  } = jobItem;
  const onJobTitleChange = (e) => {
    let newValue = e.target.value;
    const updatedJobs = [...jobs];
    updatedJobs[index].title = newValue;
    updatedJobs[index].hasTitleError = false;
    setjobs(updatedJobs);
  };
  const onJobComapnyChange = (e) => {
    let newValue = e.target.value;
    const updatedJobs = [...jobs];
    updatedJobs[index].company = newValue;
    updatedJobs[index].hasCompanyError = false;
    setjobs(updatedJobs);
  };
  const onJobStartDateChange = (e) => {
    let newValue = e.target.value;
    const updatedJobs = [...jobs];
    updatedJobs[index].startDate = newValue;
    setjobs(updatedJobs);
  };
  const onJobEndDateChange = (e) => {
    let newValue = e.target.value;
    const updatedJobs = [...jobs];
    updatedJobs[index].endDate = newValue;
    setjobs(updatedJobs);
  };
  return (
    <Fragment>
      <div className="profiledetails-work-item">
        <div className="profiledetails-work-item-delete-row">
          <div
            className="profiledetails-work-item-delete"
            onClick={() => removeItem(id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </div>
        </div>
        <div className="profiledetails-row">
          <div className="profiledetails-column">
            <div className="auth-form-item ">
              <div className="auth-form-label">Enter Job Title</div>
              <Input type={"text"} value={title} onChange={onJobTitleChange} />
              <div className={`job-form-error  ${hasTitleError && "show"}`}>Title is Required</div>
            </div>
            <div className="auth-form-item">
              <div className="auth-form-label">Start Date</div>
              <Datepicker
                calendarValue={startDate}
                setCalendarValue={onJobStartDateChange}
                icon={faCalendar}
              />
            </div>
          </div>
          <div className="profiledetails-column">
            <div className="auth-form-item">
              <div className="auth-form-label">Enter Company Name</div>
              <Input
                type={"text"}
                onChange={onJobComapnyChange}
                value={company}
              />
              <div className={`job-form-error ${hasCompanyError && "show"}`}>
                Company is Required
              </div>
            </div>
            <div className="auth-form-item ">
              <div className="auth-form-label">End Date</div>
              <Datepicker
                calendarValue={endDate}
                setCalendarValue={onJobEndDateChange}
                icon={faCalendar}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default JobHistory;
