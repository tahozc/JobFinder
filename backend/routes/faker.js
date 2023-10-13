const { faker } = require("@faker-js/faker");
const express = require("express");
const Job = require("../models/Job");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const router = express.Router();
const generateJob = () => {
  const job = {
    companyId: new ObjectId("651826dbe227605e07e96a73"),
    title: faker.person.jobTitle(),
    type: faker.helpers.arrayElement([
      "Full-Time",
      "Part-Time",
      "Contract",
      "Freelance",
    ]),
    city: faker.location.city(),
    country: faker.location.country(),
    hourlyRate: faker.number.int({ min: 15, max: 50 }),
    budget: faker.number.int({ min: 25000, max: 80000 }),
    deadline: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    domain: faker.helpers.arrayElement([
      "Web Development",
      "Mobile App Development",
      "UI/UX Design",
    ]),
    description: faker.lorem.paragraph(),
    duties: faker.lorem.sentence(),
    experience: faker.lorem.paragraph(2),
    skills: faker.helpers.arrayElements(
      ["Copy Writing", "ReactJS", "Angular", "Vue", "Blockchain"],
      2
    ),
    date: new Date()
  };

  return job;
};

router.get("/generateJobs", async (req, res) => {
  const count = 30;
  const jobs = [];
  for (let i = 0; i < count; i++) {
    jobs.push(generateJob());
  }
  const addedJobs = await Job.insertMany(jobs);
  res.json({ addedJobs });
});

module.exports = router;
