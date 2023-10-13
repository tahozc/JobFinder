import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faFilter,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Container from "../../shared/Container";
import Select from "react-select";
import Checkbox from "../../shared/Checkbox";
import Slider from "rc-slider";
import "react-datepicker/dist/react-datepicker.css";
import "rc-slider/assets/index.css";
import "./index.css";
import "react-calendar/dist/Calendar.css";
import Datepicker from "../../shared/Datepicker";
import JobListingItem from "../../components/JobListingItem";
import Pagination from "../../shared/Pagination";
import ListingHeroHeader from "../../components/ListingHeroHeader";
import { useSelector, useDispatch } from "react-redux";
import {
  applyJobFilter,
  getJobs,
  setShared,
} from "../../redux/actions/sharedAction";
import languagesList from "../../constants/languages";
import countries from "../../constants/countries";
import jobdomains from "../../constants/jobdomains";
import jobtypes from "../../constants/jobtypes";
import Input from "../../shared/Input";
const JobListings = () => {
  const [jobCategories] = useState([
    { value: "fullstack", label: "Full-Stack Developer" },
    { value: "ui/ux", label: "UI/UX Designer" },
    { value: "Digital Marketer", label: "Digital Marketer" },
  ]);
  const [isFullTime, setisFullTime] = useState(false);
  const [isPartTime, setisPartTime] = useState(false);
  const [isRemote, setisRemote] = useState(false);
  const [isFreelance, setisFreelance] = useState(false);
  const [salary, setSalary] = useState([0, 100000]);
  const dispatch = useDispatch();
  const Shared = useSelector(({ Shared }) => Shared);
  const {
    jobsList,
    filteredjobsList,
    paginatedJobsList,
    currentJobsListPage,
    totalJobsListPages,
    JobsListPerPage,
    jobDomainFilter,
    jobtypeFilter,
    countryFilter,
    cityFilter,
    startDateFilter,
    endDateFilter,
    maxSalarySlider,
    startSalaryFilter,
    endSalaryFilter,
  } = Shared;
  useEffect(() => {
    dispatch(getJobs());
    // eslint-disable-next-line
  }, []);
  const setTotalPages = (totalpages) => {
    dispatch(
      setShared({
        name: "totalJobsListPages",
        value: totalpages,
      })
    );
  };
  const setCurrentPage = (currentPage) => {
    dispatch(
      setShared({
        name: "currentJobsListPage",
        value: currentPage,
      })
    );
  };
  const setpaginatedItems = (paginatedItems) => {
    dispatch(
      setShared({
        name: "paginatedJobsList",
        value: paginatedItems,
      })
    );
  };
  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(
      setShared({
        name,
        value,
      })
    );
    dispatch(applyJobFilter());
  };
  const salaryRange = [startSalaryFilter, endSalaryFilter];
  return (
    <div className="joblistings-container">
      <ListingHeroHeader text={"Get Your Job"} />
      <Container>
        <div className="joblistings-row">
          <div className="joblisting-filter-column">
            <div className="joblisting-filter-header">
              <span className="joblisting-filter-header-img">
                <FontAwesomeIcon icon={faFilter} />
              </span>
              Jobs Filter
            </div>

            <div className="joblisting-filter-container">
              <div className="joblisting-filter-item">
                <div className="joblisting-filter-item-heading">
                  Job Category(upto 3)
                </div>
                <div className="joblisting-filter-item-select">
                  <Select
                    isMulti
                    options={jobdomains}
                    placeholder={"Select Job Domain"}
                    onChange={(selectedjobDomain) => {
                      if (selectedjobDomain.length <= 3) {
                        onChange({
                          target: {
                            name: "jobDomainFilter",
                            value: selectedjobDomain,
                          },
                        });
                      }
                    }}
                    value={jobDomainFilter}
                  />
                </div>
              </div>
              <div className="joblisting-filter-item">
                <div className="joblisting-filter-item-heading">Job Type</div>
                <Select
                  isClearable
                  options={jobtypes}
                  placeholder={"Select Job type"}
                  onChange={(selectedtype) => {
                    onChange({
                      target: {
                        name: "jobtypeFilter",
                        value: selectedtype,
                      },
                    });
                  }}
                  value={jobtypeFilter}
                />
                {/* <div className="joblisting-checkbox-item">
                  <Checkbox
                    text={"Freelance"}
                    checked={isFreelance}
                    setChecked={setisFreelance}
                  />
                </div> */}
              </div>
              <div className="joblisting-filter-item">
                <div className="joblisting-filter-item-heading">
                  Job Location
                </div>
                <div className="joblisting-filter-item-select">
                  <Select
                    isClearable
                    options={countries}
                    placeholder={"Select Country"}
                    onChange={(selectedCountry) =>
                      onChange({
                        target: {
                          name: "countryFilter",
                          value: selectedCountry,
                        },
                      })
                    }
                    value={countryFilter}
                  />
                  <Input
                    type={"text"}
                    placeholder={"City Name e.g New York"}
                    className={"dual-input"}
                    name={"cityFilter"}
                    onChange={onChange}
                    value={cityFilter}
                  />
                </div>
              </div>
              <div className="joblisting-filter-item">
                <div className="joblisting-filter-item-heading">
                  Job Joining
                </div>
                <div className="joblisting-filter-item-row">
                  <div className="joblisting-filter-item-column">
                    <span>Starting From</span>
                    <Datepicker
                      calendarValue={startDateFilter}
                      setCalendarValue={onChange}
                      icon={faCalendar}
                      name={"startDateFilter"}
                    />
                    <div
                      className={`joblisting-filter-item-column-reset ${
                        !startDateFilter && "isEmpty"
                      }`}
                      onClick={() => {
                        if (startDateFilter)
                          onChange({
                            target: {
                              name: "startDateFilter",
                              value: null,
                            },
                          });
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                      <span>Reset</span>
                    </div>
                  </div>
                  <div className="joblisting-filter-item-column">
                    <span>Ending At</span>
                    <Datepicker
                      calendarValue={endDateFilter}
                      setCalendarValue={onChange}
                      icon={faCalendar}
                      name={"endDateFilter"}
                    />
                    <div
                      className={`joblisting-filter-item-column-reset ${
                        !endDateFilter && "isEmpty"
                      }`}
                      onClick={() => {
                        if (endDateFilter)
                          onChange({
                            target: {
                              name: "endDateFilter",
                              value: null,
                            },
                          });
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                      <span>Reset</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="joblisting-filter-item">
                <div className="joblisting-filter-item-heading">
                  Salary Range
                </div>
                <div className="joblisting-filter-slider-container">
                  <Slider
                    range
                    min={0}
                    max={100000}
                    value={salaryRange}
                    onChange={(newSalary) => {
                      console.log(newSalary);
                      const newStartSalaryFilter = newSalary[0];
                      const newEndSalaryFilter = newSalary[1];
                      onChange({
                        target: {
                          name: "startSalaryFilter",
                          value: newStartSalaryFilter,
                        },
                      });
                      onChange({
                        target: {
                          name: "endSalaryFilter",
                          value: newEndSalaryFilter,
                        },
                      });
                    }}
                  />
                  <div className="joblisting-filter-slider-text-container">
                    <div className="joblisting-filter-slider-text">0</div>
                    <div className="joblisting-filter-slider-text">+100k</div>
                  </div>
                  <div className="joblisting-filter-slider-values">
                    Selected Range ${salary[0]} to ${salary[1]}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="joblisting-space"></div>
          <div className="joblisting-lists-column">
            <div className="joblisting-count">
              {filteredjobsList.length} Jobs found
            </div>
            <div className="joblisiting-items-list">
              {paginatedJobsList.map((job) => (
                <JobListingItem key={job._id} job={job} />
              ))}
            </div>
            <div className="joblistings-pagination-container">
              <Pagination
                currentPage={currentJobsListPage}
                setCurrentPage={setCurrentPage}
                items={filteredjobsList}
                totalPages={totalJobsListPages}
                setTotalPages={setTotalPages}
                itemsPerPage={JobsListPerPage}
                setpaginatedItems={setpaginatedItems}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default JobListings;
