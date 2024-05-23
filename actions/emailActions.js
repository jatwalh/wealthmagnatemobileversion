// Action types
export const SET_EMAIL_ALERTS = 'SET_EMAIL_ALERTS';
export const TOGGLE_EMAIL_READ_STATE = 'TOGGLE_EMAIL_READ_STATE';

// Action creators
export const setEmailAlerts = (emailAlerts) => ({
  type: SET_EMAIL_ALERTS,
  emailAlerts,
});

export const toggleEmailReadState = (emailIndex) => ({
  type: TOGGLE_EMAIL_READ_STATE,
  emailIndex,
});