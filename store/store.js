import { createStore, combineReducers } from 'redux';
import emailReducer from '../reducers/emailReducer'; // Go up one directory level

const rootReducer = combineReducers({
  email: emailReducer,
});

const store = createStore(rootReducer);

export default store;