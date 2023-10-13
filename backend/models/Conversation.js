const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("conversation", ConversationSchema);
