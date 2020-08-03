/**
 * Socket.io
 * Life Cycle 
 **/
 
const MySocket = props => {
  /** Arguments **/
  const {
    host,
    namespace,
    options,
    params,
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
    const socket_uri = [host, namespace].join("/");
    const query_string = MyUtils.serialize(params);

    const __socket = io( [socket_uri, query_string].join("?") , options);
    
    /** Connect **/
    __socket.on(SOCKET_CONNECT, ()=>{
      const sid = __socket.id.replace(__socket.nsp+"#", "");
      
      dispatch(
        userActions.setUser({
          sid,
          loggedIn: new Date(),
        })
      );
      
      console.log(SOCKET_CONNECT, { sid, __socket } );
    });

    /** Custom Reconnect **/
    __socket.on(SOCKET_CONNECT_ERROR, error => {
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
        __socket.connect();
      }, SOCKET_RECONNECT_DELAY);
    });

    /** Error **/
    __socket.on(SOCKET_ERROR, error => {
      console.log(SOCKET_ERROR, { error });
    });

    /** Disconnect **/
    __socket.on(SOCKET_DISCONNECT, disconnected => {
      dispatch( userActions.clearUser() );
      
      console.log(SOCKET_DISCONNECT, { disconnected });
    });
    
    return __socket;
  }
  
  /**
   * Socket Events
   */
  const init_events = __socket => {
    /** Socket Emit Event: Send Message **/
    const emitSendMessage = ( message, callback ) => {
      if( !callback ){
        callback = ( success )=>{
          // ToDo: 
        }
      }
      __socket.emit(EVENT_EMIT_SEND_MESSAGE, message, callback);
    }
    
    /** Socket Emit Event: Enter Room **/
    const emitEnterRoom = ( room, callback ) => {    
      if( !callback ){
        callback = ( success )=>{
          dispatch( userActions.setRoom(room) );
        }
      }
      __socket.emit(EVENT_EMIT_ENTER_ROOM, room, callback);
    }
    
    /** Socket Emit Event: Enter Room **/
    const emitLeaveRoom = ( room, callback ) => {
      if( !callback ){
        callback = ( success )=>{
          dispatch( userActions.setRoom(now_room) );
        }
      }
      __socket.emit(EVENT_EMIT_LEAVE_ROOM, room, callback);
    }  

    /** Socket Emit Event: Set Username **/
    const emitSetUsername = ( username, callback ) => {
      if( !callback ){
        callback = ( success )=>{
          dispatch( userActions.setName(username) );
        }
      }
      __socket.emit(EVENT_EMIT_SET_USERNAME, username, callback);
    }

    /** Socket On Event: Connected **/
    __socket.on(EVENT_ON_CONNECTED, ( data ) => {
      console.log(EVENT_ON_CONNECTED, data);
    });
    
    /** Socket On Event: Receive Message **/
    __socket.on(EVENT_ON_RECEIVE_MESSAGE, ( data )=>{
      Object.assign(data, {
        sid: userSelector.getSid(store.getState()),
      });
      MyUtils.makeMessage(data);
    });
    
    /** Socket On Event: Enter Room **/
    __socket.on(EVENT_ON_ROOM_HELLO, ( data ) => {
      console.log( data );

      Object.assign(data, {
        sid: userSelector.getSid(store.getState()),
        message: data.room + "에 입장하였습니다."
      });
      MyUtils.makeMessage(data);
    });
    
    /** Socket On Event: Leave Room **/
    __socket.on(EVENT_ON_ROOM_BYE, ( data ) => {
      Object.assign(data, {
        sid: userSelector.getSid(store.getState()),
        message: data.room + "를 퇴장하였습니다."
      });
      MyUtils.makeMessage(data);
    });
    
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
      events = init_events(socket);
      
      return socket;
    },
    getSocket: ()=>( socket ),
    getEvents: ()=>( events ),
  };
}