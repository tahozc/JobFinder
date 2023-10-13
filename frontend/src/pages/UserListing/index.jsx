import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Container from "../../shared/Container";
import Select from "react-select";
import Checkbox from "../../shared/Checkbox";
import Slider from "rc-slider";
import "react-datepicker/dist/react-datepicker.css";
import "rc-slider/assets/index.css";
import "./index.css";
import "react-calendar/dist/Calendar.css";
import Datepicker from "../../shared/Datepicker";
import Pagination from "../../shared/Pagination";
import ListingHeroHeader from "../../components/ListingHeroHeader";
import { useSelector, useDispatch } from "react-redux";
import UserListingItem from "../../components/UserListingItem";
import { getUsers } from "../../redux/actions/companyAction";
const Userlistings = () => {
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
  const usersList = useSelector(({ Company }) => Company.usersList);
  useEffect(() => {
    dispatch(getUsers());
    // eslint-disable-next-line
  }, []);

  return (
    <div className="joblistings-container">
      <ListingHeroHeader text={"Find Employees"} />
      <Container>
        <div className="joblistings-row">
          <div className="joblisting-filter-column">
            <div className="joblisting-filter-header">
              <span className="joblisting-filter-header-img">
                <FontAwesomeIcon icon={faFilter} />
              </span>
              User Filter
            </div>

            <div className="joblisting-filter-container">
              <div className="joblisting-filter-item">
                <div className="joblisting-filter-item-heading">
                  User Category
                </div>
                <div className="joblisting-filter-item-select">
                  <Select
                    options={jobCategories}
                    placeholder={"Select Job Category"}
                  />
                </div>
              </div>
              <div className="joblisting-filter-item">
                <div className="joblisting-filter-item-heading">Job Type</div>
                <div className="joblisting-checkbox-item">
                  <Checkbox
                    text={"Full Time"}
                    checked={isFullTime}
                    setChecked={setisFullTime}
                  />
                </div>
                <div className="joblisting-checkbox-item">
                  <Checkbox
                    text={"Part Time"}
                    checked={isPartTime}
                    setChecked={setisPartTime}
                  />
                </div>
                <div className="joblisting-checkbox-item">
                  <Checkbox
                    text={"Remote"}
                    checked={isRemote}
                    setChecked={setisRemote}
                  />
                </div>
                <div className="joblisting-checkbox-item">
                  <Checkbox
                    text={"Freelance"}
                    checked={isFreelance}
                    setChecked={setisFreelance}
                  />
                </div>
              </div>
              <div className="joblisting-filter-item">
                <div className="joblisting-filter-item-heading">
                  Job Location
                </div>
                <div className="joblisting-filter-item-select">
                  <Select
                    options={jobCategories}
                    placeholder={"Select Job Location"}
                  />
                </div>
              </div>
              <div className="joblisting-filter-item">
                <div className="joblisting-filter-item-heading">
                  Posted Within
                </div>
                <div className="joblisting-filter-item-row">
                  <div className="joblisting-filter-item-column">
                    <span>From</span>
                    <Datepicker />
                  </div>
                  <div className="joblisting-filter-item-column">
                    <span>To</span>
                    <Datepicker />
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
                    value={salary}
                    onChange={(newSalary) => {
                      setSalary(newSalary);
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
            <div className="joblisting-count">39,782 Jobs found</div>
            <div className="joblisiting-items-list">
              {usersList.map((user) => (
                <UserListingItem key={user._id} user={user} />
              ))}
            </div>
            <div className="joblistings-pagination-container">
              <Pagination />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Userlistings;
