/**
 * Socket.io
 * Life Cycle 
 **/
 
const MySocket = props => {
  /** Arguments **/
  const {
    namespace,
    room,
    options,
  } = props;
  
  /** Reudx **/
  const { dispatch } = store;
  
  /** Reducers **/
  const {
    actions: userActions,
    selectors: userSelector,
  } = UserReducer;
  
  /** Socket Instance **/
  let socket = null;
  let events = null;
  
  /**
   * Socket Life Cycle
   */
  const init_socket = () => {
    /** Socket Instance **/
    const _socket = io( namespace, options );
    
    /** Connect **/
    _socket.on(SOCKET_CONNECT, ()=>{
      const sid = _socket.id.replace(_socket.nsp+"#", "");
      
      dispatch( userActions.setUser({
        sid,
        loggedIn: new Date(),
      }));

      console.log(SOCKET_CONNECT, { sid, _socket } );
    });

    /** Custom Reconnect **/
    _socket.on(SOCKET_CONNECT_ERROR, error => {
      console.group(SOCKET_CONNECT_ERROR);
      console.log({ 
        error,
        reconnect: {
          delay: SOCKET_RECONNECT_DELAY
        }
      });
      console.groupEnd(SOCKET_CONNECT_ERROR);
      
      /** Do Reconnection **/
      setTimeout(() => {
        _socket.connect();
      }, SOCKET_RECONNECT_DELAY);
    });

    /** Error **/
    _socket.on(SOCKET_ERROR, error => {
      console.log(SOCKET_ERROR, { error });
    });

    /** Disconnect **/
    _socket.on(SOCKET_DISCONNECT, disconnected => {
      dispatch( userActions.clearUser() );
      
      console.log(SOCKET_DISCONNECT, { disconnected });
    });
    
    return _socket;
  }
  
  /**
   * Socket Events
   */
  const init_events = () => {
    /** Socket On Event: Connected **/
    socket.on(EVENT_ON_CONNECTED, ( data ) => {
      console.log(EVENT_ON_CONNECTED, data);
    });
    
    /** Socket On Event: Receive Message **/
    socket.on(EVENT_ON_RECEIVE_MESSAGE, ( data )=>{
      Object.assign(data, {
        sid: userSelector.getSid(store.getState()),
      });
      MyUtils.makeMessage(data);
    });
    
    /** Socket On Event: Enter Room **/
    socket.on(EVENT_ON_ROOM_HELLO, ( data ) => {
      Object.assign(data, {
        sid: userSelector.getSid(store.getState()),
        message: "입장하였습니다."
      });
      MyUtils.makeMessage(data);
    });
    
    /** Socket On Event: Leave Room **/
    socket.on(EVENT_ON_ROOM_BYE, ( data ) => {
      Object.assign(data, {
        sid: userSelector.getSid(store.getState()),
        message: "퇴장하였습니다."
      });
      MyUtils.makeMessage(data);
    });
    
    /** Socket Emit Event: Send Message **/
    const emitSendMessage = ( message, callback ) => {
      if( !callback ){
        callback = ( success )=>{
          // ToDo: 
        }
      }
      socket.emit(EVENT_EMIT_SEND_MESSAGE, message, callback);
    }
    
    /** Socket Emit Event: Enter Room **/
    const emitEnterRoom = ( room, callback ) => {    
      if( !callback ){
        callback = ( success )=>{
          dispatch( userActions.setRoom(room) );
        }
      }
      socket.emit(EVENT_EMIT_ENTER_ROOM, room, callback);
    }
    
    /** Socket Emit Event: Enter Room **/
    const emitLeaveRoom = ( room, callback ) => {
      if( !callback ){
        callback = ( success )=>{
          dispatch( userActions.setRoom(now_room) );
        }
      }
      socket.emit(EVENT_EMIT_LEAVE_ROOM, room, callback);
    }  
    /** Socket Emit Event: Set Username **/
    const emitSetUsername = ( username, callback ) => {
      if( !callback ){
        callback = ( success )=>{
          dispatch( userActions.setName(username) );
        }
      }
      socket.emit(EVENT_EMIT_SET_USERNAME, username, callback);
    }
    
    /** Return Events **/
    return {
      emitSendMessage,
      emitEnterRoom,
      emitLeaveRoom,
      emitSetUsername,
    }
  }
  
  return {
    init: ()=>{
      socket = init_socket();
      events = init_events();
      
      return socket;
    },
    getSocket: ()=>( socket ),
    getEvents: ()=>( events ),
  };
}