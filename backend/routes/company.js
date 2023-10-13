const express = require("express");
const router = express.Router();
const Company = require("../models/Company");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const Job = require("../models/Job");
const mongoose = require("mongoose");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const { ObjectId } = mongoose.Types;
const Application = require("../models/Application");
const Axios = require("axios");
const Conversation = require("../models/Conversation");
const MATCH_URL = "http://141.147.0.104:8500/match";
//@route    POST api/company/register
//@desc     Register a Company
//@access   Public
router.post("/register", async (req, res) => {
  try {
    const {
      email,
      password,
      companyName,
      fiscalNumber,
      creationDate,
      website,
      countryCode,
      phoneNumber,
      streetNumber,
      streetName,
      city,
      country,
      languages,
      companyExpertise,
      companydesc,
    } = req.body;
    let company = await Company.findOne({ email });

    if (company) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Company Email already exists" }] });
    }

    company = new Company({
      email,
      password,
      companyName,
      fiscalNumber,
      creationDate,
      website,
      countryCode,
      phoneNumber,
      streetNumber,
      streetName,
      city,
      country,
      languages,
      companyExpertise,
      companydesc,
    });

    const salt = await bcrypt.genSalt(10);

    company.password = await bcrypt.hash(password, salt);

    await company.save();

    const payload = {
      user: {
        id: company.id,
        userType: "0",
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return res.json({ token, user: company });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route    POST api/company/login
//@desc     Login a Company
//@access   Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let company = await Company.findOne({ email });

    if (!company) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: company.id,
        userType: "0",
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return res.json({ token, user: company });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route    POST api/company/addJob
//@desc     Add a Job
//@access   Private
router.post("/addJob", auth, async (req, res) => {
  try {
    const companyId = req.user.id;
    const isCompanyUser = req.user.userType === "0";
    const {
      title,
      type,
      city,
      country,
      hourlyRate,
      budget,
      deadline,
      startDate,
      endDate,
      domain,
      description,
      duties,
      experience,
      skills,
    } = req.body;

    if (!isCompanyUser) {
      return res.status(401).json({ msg: "Invalid Company" });
    }
    console.log(req.body);
    let jobObj = {
      companyId,
      title,
      type,
      city,
      country,
      hourlyRate,
      budget,
      startDate,
      domain: JSON.parse(domain),
      description,
      duties,
      experience,
      skills: JSON.parse(skills),
    };
    if (deadline) jobObj.deadline = deadline;
    if (endDate) jobObj.endDate = endDate;
    const job = new Job(jobObj);
    await job.save();

    res.json({ jobAdded: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//@route    POST api/company/addJob
//@desc     Add a Job
//@access   Private
router.post("/updateJob", auth, async (req, res) => {
  try {
    const companyId = req.user.id;
    const isCompanyUser = req.user.userType === "0";
    const {
      jobId,
      title,
      type,
      city,
      country,
      hourlyRate,
      budget,
      deadline,
      startDate,
      endDate,
      domain,
      description,
      duties,
      experience,
      skills,
    } = req.body;
    const companyjobId = new ObjectId(jobId);
    if (!isCompanyUser) {
      return res.status(401).json({ msg: "Invalid Company" });
    }

    const job = await Job.findOne({
      _id: new ObjectId(companyjobId),
      companyId: new ObjectId(companyId),
    });

    if (!job) {
      return res
        .status(401)
        .json({ msg: "Job not found for the specified company" });
    }
    let editJobFields = {
      title,
      type,
      city,
      country,
      hourlyRate,
      budget,
      startDate,
      domain: JSON.parse(domain),
      description,
      duties,
      experience,
      skills: JSON.parse(skills),
    };
    if (deadline) editJobFields.deadline = deadline;
    if (endDate) editJobFields.endDate = endDate;
    await Job.findByIdAndUpdate(companyjobId, { $set: editJobFields });

    res.json({ jobUpdated: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route    GET api/company/getCompanyJobs
//@desc     Get all Jobs from a Company
//@access   Private
router.get("/getCompanyJobs", auth, async (req, res) => {
  try {
    const companyId = req.user.id;
    const isCompanyUser = req.user.userType === "0";

    if (!isCompanyUser) {
      return res.status(401).json({ msg: "Invalid Company" });
    }
    const jobs = await Job.aggregate([
      {
        $match: {
          companyId: new ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: "$company",
      },
    ]);

    res.json({ jobs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route    POST api/company/getCompanyJobs
//@desc     Delete Company Job
//@access   Private
router.post("/deleteCompanyJob", auth, async (req, res) => {
  try {
    const companyIdStr = req.user.id;
    const isCompanyUser = req.user.userType === "0";
    const { jobId } = req.body;
    const companyjobId = new ObjectId(jobId);
    const companyId = new ObjectId(companyIdStr);

    if (!isCompanyUser) {
      return res.status(401).json({ msg: "Invalid Company" });
    }
    const job = await Job.findOne({
      _id: new ObjectId(companyjobId),
      companyId: new ObjectId(companyId),
    });

    if (!job) {
      return res
        .status(401)
        .json({ msg: "Job not found for the specified company" });
    }

    await Job.findByIdAndRemove(companyjobId);

    res.json({ msg: "Job Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route    POST api/company/updateCompanyProfile
//@desc     Update Company Profile
//@access   Private
router.post("/updateCompanyProfile", auth, async (req, res) => {
  try {
    const companyIdStr = req.user.id;
    const companyId = new ObjectId(companyIdStr);
    const isCompanyUser = req.user.userType === "0";
    const {
      website,
      countryCode,
      phoneNumber,
      streetNumber,
      streetName,
      city,
      country,
      languages,
      companydesc,
      companyName,
      fiscalNumber,
      creationDate,
      companyExpertise,
    } = req.body;

    if (!isCompanyUser) {
      return res.status(401).json({ msg: "Invalid Company" });
    }
    console.log(req.files);
    // If Uploaded Profile Image
    let image = null;
    if (req.files) {
      if (req.files.profileImageFile) {
        const { profileImageFile } = req.files;
        const uniqueId = uuidv4();
        image = `${uniqueId}_${profileImageFile.name}`;
        const relativePath = `../../frontend/src/assets/profile/${image}`;
        const absolutePath = path.resolve(__dirname, relativePath);
        await profileImageFile.mv(absolutePath);
      }
    }
    let editCompanyFields = {
      countryCode,
      phoneNumber,
      streetNumber,
      streetName,
      city,
      country,
      languages: JSON.parse(languages),
      companydesc,
      companyName,
      fiscalNumber,
      creationDate,
      companyExpertise: JSON.parse(companyExpertise),
    };
    if (website) editCompanyFields.website = website;
    if (image) editCompanyFields.image = image;
    const user = await Company.findByIdAndUpdate(companyId, {
      $set: editCompanyFields,
    });

    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route    GET api/company/getUsers
//@desc     Get all Users
//@access   Public
router.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route    POST api/company/getApplicantsByJob
//@desc     Get all Applicants that have applied on Job
//@access   Private
router.post("/getApplicantsByJob", auth, async (req, res) => {
  try {
    const companyIdStr = req.user.id;
    const companyId = new ObjectId(companyIdStr);
    const isCompanyUser = req.user.userType === "0";
    const { job_Id } = req.body;
    const jobId = new ObjectId(job_Id);
    if (!isCompanyUser) {
      return res.status(401).json({ msg: "Invalid Company" });
    }
    const job = await Job.findOne({ _id: jobId });
    const jobCompanyId = job.companyId;
    console.log(jobCompanyId);
    console.log(companyId);

    if (!jobCompanyId.equals(companyId)) {
      return res
        .status(401)
        .json({ msg: "This Job does not belong to your Company" });
    }

    const applications = await Application.aggregate([
      {
        $match: {
          jobId: jobId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user", // Unwind the user array
      },
    ]);
    res.json({ applications });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route    POST api/company/getApplicantsByJob
//@desc     Get all Applicants that have applied on Job
//@access   Private
router.post("/getApplicantsByJob", auth, async (req, res) => {
  try {
    const companyIdStr = req.user.id;
    const companyId = new ObjectId(companyIdStr);
    const isCompanyUser = req.user.userType === "0";
    const { job_Id } = req.body;
    const jobId = new ObjectId(job_Id);
    if (!isCompanyUser) {
      return res.status(401).json({ msg: "Invalid Company" });
    }
    console.log("jobId=");
    console.log(jobId);
    const job = await Job.findOne({ _id: jobId });
    if (!job) {
      return res.status(401).json({ msg: "Job Does not Exist" });
    }
    const jobCompanyId = job.companyId;
    console.log(jobCompanyId);
    console.log(companyId);

    if (!jobCompanyId.equals(companyId)) {
      return res
        .status(401)
        .json({ msg: "This Job does not belong to your Company" });
    }

    const applications = await Application.aggregate([
      {
        $match: {
          jobId: jobId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user", // Unwind the user array
      },
    ]);
    res.json({ applications });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

//@route    POST api/company/getApplicantsByJob
//@desc     Get all Applicants that have applied on Job
//@access   Private
router.post("/updateApplicationStatus", auth, async (req, res) => {
  try {
    const companyIdStr = req.user.id;
    const companyId = new ObjectId(companyIdStr);
    const isCompanyUser = req.user.userType === "0";
    const { application_Id, status, job_Id } = req.body;
    const applicationId = new ObjectId(application_Id);
    const jobId = new ObjectId(job_Id);
    const job = await Job.findOne({ _id: jobId });
    const jobCompanyId = job.companyId;

    if (!isCompanyUser) {
      return res.status(401).json({ msg: "Invalid Company" });
    }

    if (!jobCompanyId.equals(companyId)) {
      return res
        .status(401)
        .json({ msg: "This Job does not belong to your Company" });
    }
    let updateApplicationFields = {
      status,
    };
    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      {
        $set: updateApplicationFields,
      }
    );

    res.json({ application: updatedApplication });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route    POST api/company/getApplicantsByJob
//@desc     Get all Applicants that have applied on Job
//@access   Private
router.post("/createOrUpdateApplicationStatus", auth, async (req, res) => {
  try {
    const companyIdStr = req.user.id;
    const companyId = new ObjectId(companyIdStr);
    const isCompanyUser = req.user.userType === "0";
    const { application_Id, status, job_Id, user_Id } = req.body;
    const jobId = new ObjectId(job_Id);
    const userId = new ObjectId(user_Id);
    const job = await Job.findOne({ _id: jobId });
    const jobCompanyId = job.companyId;
    console.log({ application_Id, status, job_Id, user_Id });
    if (!isCompanyUser) {
      return res.status(401).json({ msg: "Invalid Company" });
    }

    if (!jobCompanyId.equals(companyId)) {
      return res
        .status(401)
        .json({ msg: "This Job does not belong to your Company" });
    }
    let updatedApplication;
    if (!application_Id) {
      const application = new Application({
        jobId,
        userId,
        status,
      });
      updatedApplication = await application.save();
    } else {
      const applicationId = new ObjectId(application_Id);
      let updateApplicationFields = {
        status,
      };
      updatedApplication = await Application.findByIdAndUpdate(
        applicationId,
        {
          $set: updateApplicationFields,
        },
        {
          new: true,
        }
      );
    }

    res.json({ application: updatedApplication });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//@route    POST api/company/recommendedUsers
//@desc     Recommended Users for a Job
//@access   Private
router.post("/recommendedUsers", auth, async (req, res) => {
  try {
    console.log(req.user);
    const companyIdStr = req.user.id;
    const companyId = new ObjectId(companyIdStr);
    const isCompanyUser = req.user.userType === "0";
    const { job_Id } = req.body;
    console.log(job_Id);
    const jobId = new ObjectId(job_Id);
    const job = await Job.findOne({ _id: jobId });
    const jobCompanyId = job.companyId;
    if (!isCompanyUser) {
      return res.status(401).json({ msg: "Invalid Company" });
    }

    if (!jobCompanyId.equals(companyId)) {
      return res
        .status(401)
        .json({ msg: "This Job does not belong to your Company" });
    }

    const domainArray = job.domain;
    const jobDescription = job.description;
    const jobDuties = job.duties;
    const jobExperience = job.experience;
    const document = `${jobDescription} ${jobDuties} ${jobExperience}`;

    const users = await User.find({
      workDomain: {
        $in: domainArray,
      },
    });
    let userIds = [];
    let userRawText = [];
    users.forEach((user) => {
      userIds.push(user._id);
      userRawText.push(user.raw_text);
    });
    const recommendedData = {
      data: [userIds, userRawText],
      document,
    };
    const resp = await Axios.post(MATCH_URL, recommendedData);
    const jsonObject = resp.data;
    const keyValueArray = Object.entries(jsonObject);
    keyValueArray.sort((a, b) => a[1] - b[1]);
    const sortedKeys = keyValueArray.map((item) => item[0]);

    const jobApplications = await Application.find({
      jobId: jobId,
      userId: { $in: sortedKeys },
    });

    const recommendedUsers = await User.find({ _id: { $in: sortedKeys } });

    const sortedUsers = sortedKeys.map((key) =>
      recommendedUsers.find(
        (recommendedUser) => recommendedUser._id.toString() === key
      )
    );
    const usersWithApplications = sortedUsers.map((user) => {
      const userApplication = jobApplications.find(
        (app) => app.userId.toString() === user._id.toString()
      );
      return {
        ...user._doc,
        application: userApplication || null,
      };
    });
    res.json({ users: usersWithApplications });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
