const MessageReducer = (()=>{
  /** Redux Modules **/
  const { createActions, handleActions } = ReduxActions;

  /** Default State **/
  const defaultState = {
    limit: 30,
    data: []
  }
  
  /** Action Types **/
  const types = {
    SET_LIMIT: "SET_LIMIT",
    ADD_MESSAGE: "ADD_MESSAGE",
    ADD_MESSAGES: 'ADD_MESSAGES',
    REMOVE_MESSAGE: 'REMOVE_MESSAGE',
    CLEAR_MESSAGE: 'CLEAR_MESSAGE',
  }

  /** Action Options **/
  const options = {
    prefix: "message",
    namespace: "/",
  }

  /** Actions **/
  const actions = createActions(
    {
      [types.SET_LIMIT]: [
        limit => limit,
        limit => { type: 'number', limit }
      ],
      [types.ADD_MESSAGE]: [
        message => message,
        message => { type: 'json', message }
      ],
      [types.ADD_MESSAGES]: [
        messages => messages,
        messages => { type: 'jsonarray', messages }
      ],
      [types.REMOVE_MESSAGE]: [
        message => message,
        message => { type: 'json', message }
      ],
      [types.CLEAR_MESSAGE]: null
    }
    , options
  );

  /** Reducer **/
  const reducer = handleActions(
    new Map([
      [
        actions.setLimit,
        ( state, action ) => (
          Object.assgin({}, state, {
            limit: action.payload
          })
        )
      ],
      [
        actions.addMessage,
        ( state, action ) => (
          Object.assign({}, state, {
            data: state.data.push(action.message)
          })
        )
      ],
      [
        actions.addMessages,
        ( state, action ) => (
          Object.assign({}, state, {
            data: state.data.concat(action.message)
          })
        )
      ],
      [
        actions.removeMessage,
        ( state, action ) => (
          Object.assign({}, state, {
            data: state.data.filter(( message )=>{
              return message.id != action.payload.id;
            })
          })
        )
      ],
      [
        actions.clearMessage, 
        ( state, action ) => (
          defaultState
        )
      ]
    ])
    , defaultState
    , options
  )
  
  /** Selectors **/
  const selectors = {
    getLimit: state => state.message.limit,
    getMessages: state => state.message.data,
  }
  
  /** Return **/
  return {
    defaultState,
    options,
    types,
    actions,
    reducer,
    selectors,
  }
})();
