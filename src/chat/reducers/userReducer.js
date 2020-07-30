const UserReducer = (()=>{
  /** Redux Modules **/
  const { createActions, handleActions } = ReduxActions;

  /** Default State **/
  const defaultState = {
    sid: null,
    name: DEFAULT_USER_NAME,
    room: DEFAULT_USER_ROOM,
    auth: DEFAULT_USER_AUTH,
    loggedIn: null,
  }

  /** Action Types **/
  const types = {
    SET_USER: "SET_USER",
    CLEAR_USER: "CLEAR_USER",
    SET_SID: "SET_SID",
    SET_NAME: "SET_NAME",
    SET_AUTH: "SET_AUTH",
    SET_ROOM: "SET_ROOM",
    SET_LOGGED_IN: "SET_LOGGED_IN",
  }

  /** Action Options **/
  const options = {
    prefix: "user",
    namespace: "/",
  }

  /** Actions **/
  const actions = createActions(
    {
      [types.SET_USER]: [
        user => user,
        user => { type: "string", user }
      ],
      [types.SET_SID]: [
        sid => sid,
        sid => { type: "string", sid }
      ],
      [types.SET_NAME]: [
        name => name,
        name => { type: "string", name }
      ],
      [types.SET_AUTH]: [
        auth => auth,
        auth => { type: "string", auth }
      ],
      [types.SET_ROOM]: [
        room => room,
        room => { type: "string", room }
      ],
      [types.SET_LOGGED_IN]: [
        logged_in => logged_in,
        logged_in => { type: "date", logged_in }
      ],
      [types.CLEAR_USER]: null
    }
    , options
  );

  /** Reducer **/
  const reducer = handleActions(
    new Map([
      [
        actions.setUser
        , ( state, action ) => (
          Object.assign({}, state, {
            ...action.payload
          })
        )
      ],
      [
        actions.setSid
        , ( state, action ) => (
          Object.assign({}, state, {
            sid: action.payload
          })
        )
      ],
      [
        actions.setName
        , ( state, action ) => (
          Object.assign({}, state, {
            name: action.payload
          })
        )
      ],
      [
        actions.setAuth
        , ( state, action ) => (
          Object.assign({}, state, {
            auth: action.payload
          })
        )
      ],
      [
        actions.setRoom
        , ( state, action ) => (
          Object.assign({}, state, {
            loc: action.payload
          })
        )
      ],
      [
        actions.setLoggedIn
        , ( state, action ) => (
          Object.assign({}, state, {
            loggedIn: action.payload
          })
        )
      ],
      [
        actions.clearUser
        , ( state, action ) => (
          defaultState
        )
      ],
    ])
    , defaultState
    , options
  );
  
  /** Selectors **/
  const selectors = {
    getName: state => state.user.name,
    getSid: state => state.user.sid,
    getAuth: state => state.user.auth,
    getLoc: state => state.user.loc,
    getLoggedIn: state => state.user.loggedIn,
  }
  
  /** Return **/
  return {
    defaultState,
    types,
    options,
    actions,
    reducer,
    selectors,
  }
})();