import React, { Fragment, useEffect } from "react";
import withDashboard from "../../HOC/Dashboard";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import JobListingItem from "../../components/JobListingItem";
import { getRecommendedUsers } from "../../redux/actions/companyAction";
import UserListingItem from "../../components/UserListingItem";
import { Blocks } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
const RecommendedUsers = () => {
  const Company = useSelector(({ Company }) => Company);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recommendedJob, recommendedUsers, recommendedLoader } = Company;
  console.log(recommendedJob);
  const currentUser = useSelector(({ Shared }) => Shared.currentUser);
  useEffect(() => {
    if (currentUser) {
      if (currentUser.type !== 0) {
        navigate("/");
      } else {
        if (recommendedJob) {
          const job_Id = recommendedJob._id;
          dispatch(getRecommendedUsers({ job_Id }));
        } else {
          navigate("/companyJobs");
        }
      }
    } else {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="recommendedUser-container">
      <div className="recommendedUser-layout-container">
        <div className="recommendedUser-job-container">
          <div className="recommendedUser-job-header">Selected Job:</div>
          <JobListingItem job={recommendedJob} showButtons={false} />
        </div>

        <div className="recommendedUser-items-container">
          <div className="recommendedUser-title">Recommended Users:</div>
          {recommendedLoader ? (
            <Fragment>
              {" "}
              <div className="recommended-Loader-container">
                <div className="recommended-Loader-text">
                  Generating Recommendations
                </div>
                <Blocks
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  color="#010b1d"
                  secondaryColor="#0000FF"
                />
              </div>
            </Fragment>
          ) : (
            <Fragment>
              {recommendedUsers.length > 0 ? (
                <Fragment>
                  {recommendedUsers.map((user, index) => {
                    const application = user.application;
                    return (
                      <div className="recommendedUser-item">
                        <UserListingItem
                          user={user}
                          showButtons={true}
                          key={index}
                          isRecommended={true}
                          application={application}
                          recommendedJob={recommendedJob}
                        />
                      </div>
                    );
                  })}
                </Fragment>
              ) : (
                <Fragment>
                  <div className="no-recommended-users ">No Recommended Users</div>
                </Fragment>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default withDashboard(RecommendedUsers);
