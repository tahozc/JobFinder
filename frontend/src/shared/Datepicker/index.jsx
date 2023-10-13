import React, { Fragment, useEffect, useState } from "react";
import Calendar from "react-calendar";
import Input from "../Input";
import "./index.css";
const Datepicker = ({
  calendarValue,
  setCalendarValue,
  icon,
  name,
  minDate,
}) => {
  const [options] = useState({
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  });
  const [inputValue, setInputValue] = useState(
    calendarValue ? new Date(calendarValue).toLocaleDateString(options) : ""
  );
  const [isOpen, setisOpen] = useState(false);
  const handleClick = () => {
    setisOpen(!isOpen);
  };
  useEffect(() => {
    setInputValue(
      calendarValue ? new Date(calendarValue).toLocaleDateString(options) : ""
    );
  }, [calendarValue]);

  return (
    <Fragment>
      <div className="datapicker-container">
        <div className="datepicker-input-container">
          <Input
            className={"datepicker-input"}
            value={inputValue}
            onClick={handleClick}
            placeholder={"Select Date"}
            icon={icon}
          />
        </div>
        {isOpen && (
          <div className="datapicker-calendar-container">
            <Calendar
              onChange={(date) => {
                setCalendarValue({ target: { name, value: new Date(date) } });
                const newDate = date.toLocaleDateString(options);
                setInputValue(newDate);
                setisOpen(false);
              }}
              minDate={minDate}
              value={calendarValue}
            />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Datepicker;
