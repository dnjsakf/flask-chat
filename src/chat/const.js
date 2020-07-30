/**
 * Constant Variables
 */

/** Socket Options **/
const SOCKET_TIMEOUT = 60*1000;
const SOCKET_RECONNECTION = false;
const SOCKET_RECONNECT_DELAY = 5*1000;
 
/** Socket Life Cycles **/
const SOCKET_CONNECT = 'connect';
const SOCKET_CONNECT_ERROR = 'connect_error';
const SOCKET_DISCONNECT = 'disconnect';
const SOCKET_ERROR = 'error';

/** On Events **/
const EVENT_ON_CONNECTED = 'connected';

/** Emit Events **/
const EVENT_EMIT_SET_USERNAME ='set_username';
const EVENT_EMIT_SEND_MESSAGE = 'send_message';
const EVENT_ON_RECV_MESSAGE = 'recv_message';

const EVENT_EMIT_ENTER_ROOM = 'enter_room';
const EVENT_EMIT_LEAVE_ROOM = 'leave_room';

/** Namespaces **/
const NAMESPACE_CHAT = '/chat';

/** Defaults **/
const DEFAULT_USER_NAME = 'Unknown';
const DEFAULT_USER_AUTH = 'normal';
const DEFAULT_USER_ROOM = 'robby';