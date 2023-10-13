import { combineReducers } from "redux";
import Shared from "./Shared";
import Company from "./Company";
import Chat from "./Chat";
export default combineReducers({
  Shared: Shared,
  Company: Company,
  Chat: Chat,
});
