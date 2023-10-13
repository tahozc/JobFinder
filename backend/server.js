const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const fileupload = require("express-fileupload");
const app = express();
const socket_io = require("socket.io");
const io = socket_io();
const PORT = 8080 || process.env.PORT;
const {
  findOrCreateConversation,
  addMessage,
  getCompanyChats,
  getUserChats,
} = require("./routes/chat");
// Connect to Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(
  fileupload({
    useTempFiles: true,
  })
);
const corsOptions = {
  origin: "http://localhost:3000", // Replace this with your frontend's origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define Routes
app.use("/api/user", require("./routes/user"));
app.use("/api/company", require("./routes/company"));
app.use("/api/faker", require("./routes/faker"));

io.listen(
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
);

app.io = io.on("connection", (socket) => {
  console.log("Socket connected:" + socket.id);
  socket.on("action", async (action) => {
    if (action.type === "server/connection") {
      const { id } = action.data;
      socket.join(id.toString());
      socket.emit("action", {
        type: "SET_CHAT",
        payload: { name: "connectionEstablished", value: true },
      });
    } else if (action.type === "server/findOrCreateChat") {
      const data = action.data;
      const { sender, reciever } = data;
      const { CompanyConversation, UserConversation } =
        await findOrCreateConversation(data);
      io.to(sender).emit("action", {
        type: "SET_CHAT",
        payload: { name: "chats", value: CompanyConversation },
      });
      io.to(reciever).emit("action", {
        type: "SET_CHAT",
        payload: { name: "chats", value: UserConversation },
      });
    } else if (action.type === "server/addMessage") {
      const data = action.data;
      const { sender, reciever } = data;
      let response = await addMessage(data);
      response = response === null ? [] : response;
      io.to(sender).emit("action", {
        type: "UPDATE_MESSAGES",
        payload: { name: "chats", value: response },
      });
      io.to(reciever).emit("action", {
        type: "UPDATE_MESSAGES",
        payload: { name: "chats", value: response },
      });
    } else if (action.type === "server/getCompanyChats") {
      const data = action.data;
      let response = await getCompanyChats(data);
      response = response === null ? [] : response;
      socket.emit("action", {
        type: "SET_CONVERSATIONS",
        payload: response,
      });
    } else if (action.type === "server/getUserChats") {
      const data = action.data;
      let response = await getUserChats(data);
      response = response === null ? [] : response;
      socket.emit("action", {
        type: "SET_CONVERSATIONS",
        payload: response,
      });
    }
  });
});
