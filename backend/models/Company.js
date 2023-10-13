const mongoose = require("mongoose");

const CompanySchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  fiscalNumber: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  website: {
    type: String,
  },
  countryCode: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  streetNumber: {
    type: String,
    required: true,
  },
  streetName: {
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
  languages: {
    type: [String],
    required: true,
  },
  companyExpertise: {
    type: [String],
    required: true,
  },
  companydesc: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("company", CompanySchema);
