export const addMoneyGeneralReducer = (state = false, action) => {
  switch (action.type) {
    case "ADD_MONEY":
      return action.payload;
    case "CLOSE_ADD_MONEY":
      return action.payload;
    default:
      return state;
  }
};

export const moneyChangeReducer = (state = false, action) => {
  switch (action.type) {
    case "MONEY_CHANGE":
      return action.payload;
    default:
      return state;
  }
};
