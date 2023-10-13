const express = require("express");
const router = express.Router();
const User = require("../models/User");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const auth = require("../middleware/auth");
const Job = require("../models/Job");
const mongoose = require("mongoose");
const Application = require("../models/Application");
const { ObjectId } = mongoose.Types;
//@route    POST api/user/register
//@desc     Register a User
//@access   Public
router.post("/register", async (req, res) => {
  try {
    const {
      email,
      password,
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
      resumeFileName,
      workDomain,
      skills,
      jobs,
      degree,
      companydesc,
      raw_text,
    } = req.body;
    const { resumeFile = null } = req.files;
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "User Email already exists" }] });
    }

    let resumeName = null;
    if (resumeFile) {
      const uniqueId = uuidv4();
      resumeName = `${uniqueId}_${resumeFile.name}`;
      const relativePath = `../../frontend/src/assets/resume/${resumeName}`;
      const absolutePath = path.resolve(__dirname, relativePath);
      await resumeFile.mv(absolutePath);
    }
    const userObj = {
      email,
      password,
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
      languages: JSON.parse(languages),
      resumeFileName,
      workDomain: JSON.parse(workDomain),
      skills: JSON.parse(skills),
      jobs: JSON.parse(jobs),
      degree: JSON.parse(degree),
      companydesc,
      raw_text,
    };
    if (resumeName) {
      userObj.resumeFileName = resumeName;
    }

    user = new User(userObj);

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        userType: "1",
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return res.json({ token, user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route    POST api/user/login
//@desc     Register a User
//@access   Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        userType: "1",
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return res.json({ token, user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route    POST api/company/updateCompanyProfile
//@desc     Update Company Profile
//@access   Private
router.post("/updateUserProfile", auth, async (req, res) => {
  try {
    const userIdStr = req.user.id;
    const userId = new ObjectId(userIdStr);
    const isIndividual = req.user.userType === "1";
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
      workDomain,
      skills,
      jobs,
      degree,
      companydesc,
    } = req.body;

    if (!isIndividual) {
      return res.status(401).json({ msg: "Not an Individual" });
    }
    // If Uploaded Profile Image
    let image = null;
    let resumeName = null;
    if (req.files) {
      if (req.files.profileImageFile) {
        const { profileImageFile } = req.files;
        const uniqueId = uuidv4();
        image = `${uniqueId}_${profileImageFile.name}`;
        const relativePath = `../../frontend/src/assets/profile/${image}`;
        const absolutePath = path.resolve(__dirname, relativePath);
        await profileImageFile.mv(absolutePath);
      }
      // If Resume Upload
      if (req.files.resumeFile) {
        const { resumeFile } = req.files;
        const uniqueId = uuidv4();
        resumeName = `${uniqueId}_${resumeFile.name}`;
        const relativePath = `../../frontend/src/assets/resume/${resumeName}`;
        const absolutePath = path.resolve(__dirname, relativePath);
        await resumeFile.mv(absolutePath);
      }
    }

    let editUserFields = {
      firstName,
      lastName,
      birthdate,
      countryCode,
      phoneNumber,
      streetNumber,
      streetName,
      city,
      country,
      languages: JSON.parse(languages),
      workDomain: JSON.parse(workDomain),
      skills: JSON.parse(skills),
      jobs: JSON.parse(jobs),
      degree: JSON.parse(degree),
      companydesc,
    };
    if (website) editCompanyFields.website = website;
    // If Image as uploaded and Moved
    if (image) editUserFields.image = image;
    if (resumeName) editUserFields.resumeFileName = resumeName;

    const updatedUser = await User.findByIdAndUpdate(userId, {
      $set: editUserFields,
    });

    res.json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//@route    POST api/user/getJobs
//@desc     Get all Jobs
//@access   Public
router.get("/getJobs", async (req, res) => {
  try {
    const jobs = await Job.aggregate([
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

//@route    POST api/user/applyJob
//@desc     Apply for a Job
//@access   Private
router.post("/applyJob", auth, async (req, res) => {
  try {
    const userIdStr = req.user.id;
    const { job_id } = req.body;
    console.log(job_id);
    const userId = new ObjectId(userIdStr);
    const jobId = new ObjectId(job_id);
    const application = new Application({
      jobId,
      userId,
    });
    await application.save();
    res.json({ msg: "Application Submitted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route    POST api/user/getApplications
//@desc     Apply for a Job
//@access   Private
router.get("/getApplications", auth, async (req, res) => {
  try {
    const userIdStr = req.user.id;
    const userId = new ObjectId(userIdStr);
    const applications = await Application.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $lookup: {
          from: "jobs", // The name of the jobs collection
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        $unwind: "$job",
      },
      {
        $lookup: {
          from: "companies", // The name of the companies collection
          localField: "job.companyId",
          foreignField: "_id",
          as: "job.company",
        },
      },
      {
        $unwind: "$job.company",
      },
    ]);
    res.json({ applications });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
