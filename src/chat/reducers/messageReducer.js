const { createActions, handleActions } = ReduxActions;

const messageDefaultState = {
  limit: 30,
  data: []
}

const messageOptions = {
  prefix: "message",
  namespace: "/",
}

const ADD_MESSAGE = '