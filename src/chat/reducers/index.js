const { combineReducers, createStore } = Redux;

/** Reducers **/
const { reducer: messageReducer } = MessageReducer;
const { reducer: userReducer } = UserReducer;

const rootReducer = combineReducers({
  user: userReducer,
  message: messageReducer,
});