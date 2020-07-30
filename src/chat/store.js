const CreateStore = reducer =>{  
  /** Redux Modules **/
  const { createStore } = Redux;
  
  /** Store **/
  const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
}