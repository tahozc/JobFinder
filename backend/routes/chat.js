const Conversation = require("../models/Conversation");
const mongoose = require("mongoose");
const Message = require("../models/Message");
const { ObjectId } = mongoose.Types;

const findOrCreateConversation = async ({ sender, reciever, isCompany }) => {
  try {
    let companyId = new ObjectId(sender);
    let userId = new ObjectId(reciever);

    let conversation = await Conversation.findOne({
      companyId,
      userId,
    });

    if (!conversation) {
      conversation = new Conversation({
        companyId,
        userId,
      });

      await conversation.save();
    }

    let CompanyConversation = await getCompanyChats({ companyId });

    let UserConversation = await getUserChats({ userId });

    return { CompanyConversation, UserConversation };
  } catch (err) {
    console.log(err);
  }
};

const addMessage = async ({ sender, reciever, isCompany, text }) => {
  try {
    let companyId = null;
    let userId = null;
    if (isCompany) {
      companyId = sender;
      userId = reciever;
    } else {
      userId = sender;
      companyId = reciever;
    }
    console.log({
      companyId,
      userId,
      isCompany,
      text,
    });
    let messageObj = new Message({
      companyId,
      userId,
      isCompany,
      text,
    });

    const message = await messageObj.save();
    console.log(message);
    const createdConversation = await Conversation.findOneAndUpdate(
      {
        companyId: new ObjectId(companyId),
        userId: new ObjectId(userId),
      },
      {
        $push: {
          messages: new ObjectId(message._id),
        },
      },
      {
        new: true,
      }
    );
    const conversationId = createdConversation._id;
    const conversationArray = await Conversation.aggregate([
      {
        $match: {
          _id: new ObjectId(conversationId),
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "messages",
          foreignField: "_id",
          as: "messages",
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
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]);
    const conversation = conversationArray[0];
    return { message, conversation };
  } catch (err) {
    console.log(err);
  }
};

const getCompanyChats = async ({ companyId }) => {
  try {
    const conversations = await Conversation.aggregate([
      {
        $match: {
          companyId: new ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "messages",
          foreignField: "_id",
          as: "messages",
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
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]);
    return conversations;
  } catch (error) {
    console.log(err);
  }
};

const getUserChats = async ({ userId }) => {
  try {
    const conversations = await Conversation.aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "messages",
          foreignField: "_id",
          as: "messages",
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
        $unwind: "$company", // Unwind the messages array (if needed)
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
        $unwind: "$user", // Unwind the messages array (if needed)
      },
    ]);
    return conversations;
  } catch (error) {
    console.log(err);
  }
};

module.exports = {
  findOrCreateConversation,
  addMessage,
  getCompanyChats,
  getUserChats,
};
