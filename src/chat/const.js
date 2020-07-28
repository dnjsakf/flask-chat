/**
 * Constant Variables
 */
 
// Life Cycle
const SOCKET_CONNECT = 'connect';
const SOCKET_CONNECT_ERROR = 'connect_error';
const SOCKET_DISCONNECT = 'disconnect';
const SOCKET_ERROR = 'error';

// Options
const SOCKET_TIMEOUT = 60*1000;
const SOCKET_RECONNECTION = false;
const SOCKET_RECONNECT_DELAY = 5*1000;

// On Events
const EVENT_ON_CONNECTED = 'connected';

// Emit Events
const EVENT_EMIT_SET_USERNAME ='set_username';
const EVENT_EMIT_SEND_MESSAGE = 'send_message';
const EVENT_EMIT_RECV_MESSAGE = 'recv_message';

// Namespace
const NAMESPACE_CHAT = '/chat';

// Default
const DEFAULT_USER_NAME = 'Unknown';
const DEFAULT_USER_AUTH = 'normal';
const DEFAULT_USER_LOC = 'robby';