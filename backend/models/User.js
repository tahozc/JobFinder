const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  birthdate: {
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
  resumeFileName: {
    type: String,
    required: true,
  },
  workDomain: {
    type: [String],
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  jobs: [
    {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
  ],
  degree: {
    type: [String],
    required: true,
  },
  companydesc: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    default: 1,
  },
  image: {
    type: String,
  },
  raw_text: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", UserSchema);
