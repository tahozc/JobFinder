import React, { Fragment } from "react";
import ListingImg from "../../assets/joblistings.jpg";
import "./index.css";
const ListingHeroHeader = ({ text }) => {
  return (
    <Fragment>
      <div className="listing-image-contaienr">
        <img src={ListingImg} className="listingImg"  alt={"listingImg.png"}/>
        <div className="listings-image-overlay">{text}</div>
      </div>
    </Fragment>
  );
};

export default ListingHeroHeader;
