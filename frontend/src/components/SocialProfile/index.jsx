import React, { useState } from "react";
import "./index.css";
import Input from "../../shared/Input";
import Datepicker from "../../shared/Datepicker";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import countryCodes from "../../constants/countryCodes";
import countries from "../../constants/countries";
import languagesList from "../../constants/languages";
import Button from "../../shared/Button";
import { useDispatch, useSelector } from "react-redux";
import { setShared } from "../../redux/actions/sharedAction";
const SocailProfile = ({ setcurrentStep }) => {
  const dispatch = useDispatch();
  const Shared = useSelector(({ Shared }) => Shared);
  const {
    firstName,
    lastName,
    birthdate,
    website,
    countryCode,
    phoneNumber,
    streetNumber,
    streetName,
    city,
    country,
    languages,
    isCompany,
    companyName,
    creationDate,
    fiscalNumber,
  } = Shared;
  const [errors, setErrors] = useState({
    firstName: { hasError: false, text: "", type: "user" },
    lastName: { hasError: false, text: "", type: "user" },
    birthdate: { hasError: false, text: "", type: "user" },
    website: { hasError: false, text: "", type: "both" },
    countryCode: { hasError: false, text: "", type: "both" },
    phoneNumber: { hasError: false, text: "", type: "both" },
    streetNumber: { hasError: false, text: "", type: "both" },
    streetName: { hasError: false, text: "", type: "both" },
    city: { hasError: false, text: "", type: "both" },
    country: { hasError: false, text: "", type: "both" },
    languages: { hasError: false, text: "", type: "both" },
    companyName: { hasError: false, text: "", type: "company" },
    creationDate: { hasError: false, text: "", type: "company" },
    fiscalNumber: { hasError: false, text: "", type: "company" },
  });

  const removeError = (key) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: { ...prevErrors[key], hasError: false, text: "" },
    }));
  };

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const isNumber = e.target.isNumber;
    const numberRegex = /^[0-9]*$/;
    if (isNumber && !numberRegex.test(value)) return;
    dispatch(
      setShared({
        name,
        value,
      })
    );
    removeError(name);
  };

  const validateFields = (data, isCompany) => {
    let hasErrors = false;
    const updatedErrors = { ...errors };

    for (const key in data) {
      const value = data[key];
      const fieldConfig = errors[key];
      const type = fieldConfig?.type;
      const fieldName = key.charAt(0).toUpperCase() + key.slice(1);

      if (!value || value.toString().trim() === "") {
        if (
          (fieldConfig?.type === "company" && isCompany) ||
          (fieldConfig?.type === "user" && !isCompany) ||
          fieldConfig?.type === "both"
        ) {
          updatedErrors[key] = {
            hasError: true,
            text: `${fieldName} is required.`,
            type,
          };
          hasErrors = true;
        }
      } else {
        updatedErrors[key] = {
          hasError: false,
          text: "",
        };
      }
    }

    setErrors(updatedErrors);
    return hasErrors;
  };

  const MoveToNextStep = () => {
    const hasErrors = validateFields(
      {
        firstName,
        lastName,
        birthdate,
        countryCode,
        phoneNumber,
        streetNumber,
        streetName,
        city,
        country,
        languages,
        companyName,
        creationDate,
        fiscalNumber,
      },
      isCompany
    );
    if (hasErrors) return;
    setcurrentStep(3);
  };
  return (
    <div className="socail-profile-container">
      <div className="socail-profile-row">
        <div className="social-profile-column">
          {isCompany ? (
            <div className="auth-form-item">
              <div className="auth-form-label">Enter CompanyName</div>
              <Input
                type={"text"}
                placeholder={"e.g Facebook"}
                name={"companyName"}
                onChange={onChange}
                value={companyName}
              />
              {errors.companyName.hasError && (
                <div className="auth-form-error">{errors.companyName.text}</div>
              )}
            </div>
          ) : (
            <div className="auth-form-item">
              <div className="auth-form-label">Enter FirstName</div>
              <Input
                type={"text"}
                placeholder={"e.g John"}
                name={"firstName"}
                onChange={onChange}
                value={firstName}
              />
              {errors.firstName.hasError && (
                <div className="auth-form-error">{errors.firstName.text}</div>
              )}
            </div>
          )}
          {isCompany ? (
            <div className="auth-form-item">
              <div className="auth-form-label">Enter CreationDate</div>
              <Datepicker
                calendarValue={creationDate}
                setCalendarValue={onChange}
                icon={faCalendar}
                name={"creationDate"}
              />
              {errors.creationDate.hasError && (
                <div className="auth-form-error">
                  {errors.creationDate.text}
                </div>
              )}
            </div>
          ) : (
            <div className="auth-form-item">
              <div className="auth-form-label">Enter Birthday</div>
              <Datepicker
                calendarValue={birthdate}
                setCalendarValue={onChange}
                icon={faCalendar}
                name={"birthdate"}
              />
              {errors.birthdate.hasError && (
                <div className="auth-form-error">{errors.birthdate.text}</div>
              )}
            </div>
          )}

          <div className="auth-form-item">
            <div className="auth-form-label">Enter Phone Number</div>
            <Select
              options={countryCodes}
              placeholder={"Select Country Code"}
              onChange={(selectedCountry) =>
                onChange({
                  target: {
                    name: "countryCode",
                    value: selectedCountry,
                  },
                })
              }
              value={countryCode}
            />
            <Input
              type={"text"}
              placeholder={"e.g 3155145092"}
              className={"dual-input"}
              name={"phoneNumber"}
              onChange={onChange}
              value={phoneNumber}
              isNumber={true}
            />
            {errors.countryCode.hasError && (
              <div className="auth-form-error">{errors.countryCode.text}</div>
            )}
            {errors.phoneNumber.hasError && (
              <div className="auth-form-error">{errors.phoneNumber.text}</div>
            )}
          </div>
          <div className="auth-form-item">
            <div className="auth-form-label">Enter City</div>
            <Input
              type={"text"}
              placeholder={"e.g New York"}
              name={"city"}
              onChange={onChange}
              value={city}
            />{" "}
            {errors.city.hasError && (
              <div className="auth-form-error">{errors.city.text}</div>
            )}
          </div>
        </div>
        <div className="social-profile-column">
          {isCompany ? (
            <div className="auth-form-item">
              <div className="auth-form-label">Enter FiscalNumber</div>
              <Input
                type={"text"}
                placeholder={"e.g 123-45-6789"}
                name={"fiscalNumber"}
                onChange={onChange}
                value={fiscalNumber}
              />
              {errors.fiscalNumber.hasError && (
                <div className="auth-form-error">
                  {errors.fiscalNumber.text}
                </div>
              )}
            </div>
          ) : (
            <div className="auth-form-item">
              <div className="auth-form-label">Enter LastName</div>
              <Input
                type={"text"}
                placeholder={"e.g Doe"}
                name={"lastName"}
                onChange={onChange}
                value={lastName}
              />
              {errors.lastName.hasError && (
                <div className="auth-form-error">{errors.lastName.text}</div>
              )}
            </div>
          )}

          <div className="auth-form-item">
            <div className="auth-form-label">Enter Website(Optional)</div>
            <Input
              type={"text"}
              placeholder={"e.g https://www.facebook.com"}
              name={"website"}
              onChange={onChange}
              value={website}
            />
          </div>
          <div className="auth-form-item">
            <div className="auth-form-label">Enter Street Number & Name</div>
            <Input
              type={"text"}
              placeholder={"Street Number e.g 3"}
              name={"streetNumber"}
              onChange={onChange}
              value={streetNumber}
              isNumber={true}
            />
            <Input
              type={"text"}
              placeholder={"Street Name e.g Baker Street"}
              className={"dual-input"}
              name={"streetName"}
              onChange={onChange}
              value={streetName}
            />
            {errors.streetNumber.hasError && (
              <div className="auth-form-error">{errors.streetNumber.text}</div>
            )}
            {errors.streetName.hasError && (
              <div className="auth-form-error">{errors.streetName.text}</div>
            )}
          </div>
          <div className="auth-form-item">
            <div className="auth-form-label">Enter Country</div>
            <Select
              options={countries}
              placeholder={"Select Country"}
              onChange={(selectedCountry) =>
                onChange({
                  target: {
                    name: "country",
                    value: selectedCountry,
                  },
                })
              }
              value={country}
            />
            {errors.country.hasError && (
              <div className="auth-form-error">{errors.country.text}</div>
            )}
          </div>
        </div>
      </div>
      <div className="socail-profile-row">
        <div className="auth-form-item social-profile-row-item">
          <div className="auth-form-label">Enter Languages</div>
          <Select
            isMulti
            options={languagesList}
            placeholder={"Select Languages"}
            onChange={(selectLanguages) =>
              onChange({
                target: {
                  name: "languages",
                  value: selectLanguages,
                },
              })
            }
            value={languages}
          />
          {errors.languages.hasError && (
            <div className="auth-form-error">{errors.languages.text}</div>
          )}
        </div>
      </div>
      <div className="socail-profile-row buttons">
        <Button
          text={"Previous"}
          className={"alt"}
          onClick={() => setcurrentStep(1)}
        />
        <Button text={"Next"} className={"alt"} onClick={MoveToNextStep} />
      </div>
    </div>
  );
};

export default SocailProfile;
