export const footerNavReducer = (state = 0, action) => {
  switch (action.type) {
    case "FOOTER_NAVIGATION":
      return action.payload;

    default:
      return state;
  }
};
