import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import creatSocketIoMiddleware from "redux-socket.io";
const io = require("socket.io-client");
const SEVER_URL = "http://localhost:8080";
let socket = io(SEVER_URL, {
  transports: ["websocket"],
});
const initialState = {};
let socketIoMiddleware = creatSocketIoMiddleware(socket, "server/");
const middleware = [thunk, socketIoMiddleware];

const persistConfig = {
  key: "root",
  storage: storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

store.getSocket = () => socket;

export default store;
