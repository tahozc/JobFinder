const mongoose = require("mongoose");

const JobSchema = mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  deadline: {
    type: Date,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  domain: [String],
  description: {
    type: String,
    required: true,
  },
  duties: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  skills: [String],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("job", JobSchema);
