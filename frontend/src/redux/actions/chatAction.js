import {
  APPLY_USER_CHAT_SEARCH_FILTER,
  APPLY_COMPANY_CHAT_SEARCH_FILTER,
  SET_CHAT,
} from "./types";

export const setChat = (data) => async (dispatch) => {
  try {
    dispatch({ type: SET_CHAT, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const applyUserSearchFilter = () => async (dispatch) => {
  try {
    dispatch({ type: APPLY_USER_CHAT_SEARCH_FILTER });
  } catch (error) {
    console.log(error);
  }
};

export const applyCompanySearchFilter = () => async (dispatch) => {
  try {
    dispatch({ type: APPLY_COMPANY_CHAT_SEARCH_FILTER });
  } catch (error) {
    console.log(error);
  }
};

export const openChat = () => async (dispatch) => {
  try {
    dispatch({ type: "server/chat", data: { msg: "Workign" } });
  } catch (error) {
    console.log(error);
  }
};

export const findOrCreateChat = (data) => async (dispatch) => {
  try {
    dispatch({ type: "server/findOrCreateChat", data });
  } catch (error) {
    console.log(error);
  }
};

export const addMessage = (data) => async (dispatch) => {
  try {
    dispatch({ type: "server/addMessage", data });
  } catch (error) {
    console.log(error);
  }
};

export const getCompanyChats = (data) => async (dispatch) => {
  try {
    dispatch({ type: "server/getCompanyChats", data });
  } catch (error) {
    console.log(error);
  }
};

export const getUserChats = (data) => async (dispatch) => {
  try {
    dispatch({ type: "server/getUserChats", data });
  } catch (error) {
    console.log(error);
  }
};

export const establishConnection = (data) => async (dispatch) => {
  try {
    dispatch({ type: "server/connection", data });
  } catch (error) {
    console.log(error);
  }
};
