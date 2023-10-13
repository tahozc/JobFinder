import React, { Fragment } from "react";
import "./index.css";
import LogoFooter from "../../assets/logo_alt.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faDiscord,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import Container from "../../shared/Container";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <Container>
        <div className="footer-container">
          <div className="footer-row">
            <div className="footer-row-item">
              <div className="footer-row-header">About Us</div>
              <div className="footer-row-description">
                Heaven frucvitful doesn't cover lesser dvsays appear creeping
                seasons so behold.
              </div>
            </div>
            <div className="footer-row-item">
              <div className="footer-row-header">Contact Info</div>
              <div className="footer-row-description">
                Address :Your address goes here, your demo address.
              </div>
              <div className="contact-info-container">
                <div className="contract-info-item">Phone: +123456789</div>
                <div className="contract-info-item">
                  Email: jobportal@gmail.com
                </div>
              </div>
            </div>
            <div className="footer-row-item">
              <div className="footer-row-header">Important links</div>
              <div className="footer-links-container">
                <div
                  className="footer-links-item"
                  onClick={() => navigate("/")}
                >
                  Home
                </div>
                <div
                  className="footer-links-item"
                  onClick={() => navigate("/joblistings")}
                >
                  Find Jobs
                </div>
                <div
                  className="footer-links-item"
                  onClick={() => navigate("/about")}
                >
                  About
                </div>
                <div
                  className="footer-links-item"
                  onClick={() => navigate("/contact")}
                >
                  Contact
                </div>
              </div>
            </div>
            <div className="footer-row-item">
              <div className="footer-row-header">Newsletter</div>
              <div className="footer-row-description">
                Heaven fruitful doesn't over lesser in days. Appear creeping.
              </div>
            </div>
          </div>
          <div className="footer-row stat">
            <div className="footer-row-item">
              <img src={LogoFooter} alt={"footer.png"} />
            </div>
            <div className="footer-row-item">
              <div className="footer-stat-container">
                <div className="footer-stat-value">+5000</div>
                <div className="footer-stat-text">Talented Hunter</div>
              </div>
            </div>
            <div className="footer-row-item">
              {" "}
              <div className="footer-stat-container">
                <div className="footer-stat-value">451</div>
                <div className="footer-stat-text">Talented Hunter</div>
              </div>
            </div>
            <div className="footer-row-item">
              {" "}
              <div className="footer-stat-container">
                <div className="footer-stat-value">568</div>
                <div className="footer-stat-text">Talented Hunter</div>
              </div>
            </div>
          </div>
          <div className="copyright-row">
            <div className="copyright-text">
              Copyright ©2023 All rights reserved
            </div>
            <div className="copyright-brands-container">
              <div className="copyright-brand">
                <FontAwesomeIcon icon={faFacebookF} />
              </div>
              <div className="copyright-brand">
                <FontAwesomeIcon icon={faTwitter} />
              </div>
              <div className="copyright-brand">
                <FontAwesomeIcon icon={faDiscord} />
              </div>
              <div className="copyright-brand">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default Footer;
