import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { addMoneyGeneralReducer, moneyChangeReducer } from "./addMoneyGeneral";
import { pocketsViewReducer } from "./pocketsViewReducer";
import { footerNavReducer } from "./footerNavReducer";

const rootReducer = combineReducers({
  user: userReducer,
  addMoney: addMoneyGeneralReducer,
  moneyChange: moneyChangeReducer,
  pocketsView: pocketsViewReducer,
  footerNav: footerNavReducer,
});

export default rootReducer;
