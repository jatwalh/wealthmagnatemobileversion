import { SET_EMAIL_ALERTS, TOGGLE_EMAIL_READ_STATE } from '../actions/emailActions';

const initialState = {
  emailAlerts: [], // Initialize with an empty arrayz
};

const emailReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EMAIL_ALERTS:
      return {
        ...state,
        emailAlerts: action.emailAlerts,
      };

    case TOGGLE_EMAIL_READ_STATE:
      const updatedEmailAlerts = [...state.emailAlerts];
      updatedEmailAlerts[action.emailIndex].read = !updatedEmailAlerts[action.emailIndex].read;
      return {
        ...state,
        emailAlerts: updatedEmailAlerts,
      };

    default:
      return state;
  }
};

export default emailReducer;