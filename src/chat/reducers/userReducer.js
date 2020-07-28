const { createActions, handleActions } = ReduxActions;

/* Default State */
const userDefaultState = {
  sid: null,
  name: DEFAULT_USER_NAME,
  auth: DEFAULT_USER_AUTH,
  loc: DEFAULT_USER_LOC,
  loggedIn: null,
}

/* Action Option */
const userActionOption = {
  prefix: "user",
  namespace: "/",
}

/* Action Types */
const SET_USER = "SET_USER";
const CLEAR_USER = "CLEAR_USER";
const SET_SID = "SET_SID";
const SET_NAME = "SET_NAME";
const SET_AUTH = "SET_AUTH";
const SET_LOC = "SET_LOC";
const SET_LOGGED_IN = "SET_LOGGED_IN";

/* Actions */
const userActions = createActions(
  {
    [SET_USER]: [
      user => user,
      user => { type: "string", user }
    ],
    [SET_SID]: [
      sid => sid,
      sid => { type: "string", sid }
    ],
    [SET_NAME]: [
      name => name,
      name => { type: "string", name }
    ],
    [SET_AUTH]: [
      auth => auth,
      auth => { type: "string", auth }
    ],
    [SET_LOC]: [
      room => room,
      room => { type: "string", room }
    ],
    [SET_LOGGED_IN]: [
      logged_in => logged_in,
      logged_in => { type: "date", logged_in }
    ],
    [CLEAR_USER]: null
  }
  , userActionOption
);

/* Reducer */
const userReducer = handleActions(
  new Map([
    [
      userActions.setUser
      , ( state, action ) => (
        Object.assign({}, state, {
          ...action.payload
        })
      )
    ],
    [
      userActions.setSid
      , ( state, action ) => (
        Object.assign({}, state, {
          sid: action.payload
        })
      )
    ],
    [
      userActions.setName
      , ( state, action ) => (
        Object.assign({}, state, {
          name: action.payload
        })
      )
    ],
    [
      userActions.setAuth
      , ( state, action ) => (
        Object.assign({}, state, {
          auth: action.payload
        })
      )
    ],
    [
      userActions.setLoc
      , ( state, action ) => (
        Object.assign({}, state, {
          loc: action.payload
        })
      )
    ],
    [
      userActions.setLoggedIn
      , ( state, action ) => (
        Object.assign({}, state, {
          loggedIn: action.payload
        })
      )
    ],
    [
      userActions.clearUser
      , ( state, action ) => (
        userDefaultState
      )
    ],
  ])
  , userDefaultState
  , userActionOption
);
  