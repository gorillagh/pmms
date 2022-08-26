export const pocketsViewReducer = (state = "list", action) => {
  switch (action.type) {
    case "VIEW_CHANGE":
      return action.payload;

    default:
      return state;
  }
};
