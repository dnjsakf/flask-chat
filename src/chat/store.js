const { combineReducers } = Redux;

const rootReducer = combineReducers({
  user: userReducer,
});

/** Store **/
const store = Redux.createStore(
  userReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

/** Dispatch **/
const { dispatch } = store;