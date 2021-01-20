# SocketIO
# Flask-SocketIO
## Dependencies
### Concurrent networking libraries
- eventlet -> performant
- gevent
- flask development werkzeug server
### Message queue services
- Redis
- RabbitMQ
- Kafka

## Initialization
socketio.run(app) wraps app.run()

## Receiving
@socketio.on('event_name')
def handle_event(*args)

Reserved events
- message
- json
- connect
  return False to reject or rraise ConnectionRefusedError
- disconnect

return *args
Client callback invoked with *args

## Namespaces
namespace=namespace

class Foo(Namespace)
dispatched to 
on_ prefix (on_connect, ...)
## Sending
Use namespace of incoming messages
Unnamed events
send()

Named events
emit()

Acknowledgement callbacks
callback=ack_callback_function

## Broadcasting
broadcast=True
All clients in namespace receive it

## Rooms
-> For Game sessions

join_room()
leave_room()
room=room_id

## Error Handling
on_error(exc, namespace="/")
on_error_default(exc)
Takes exception as argument

## Debugging
SocketIO(logger=True, engineio_logger=True)
True: log to STDERR
logger obj: log to that

## Flask Context
- current_app, g
- request (shared between websockets requests)
+sid (unique session ID)
- session ("fork")

## Authentication

## Sources
- https://blog.miguelgrinberg.com/post/easy-websockets-with-flask-and-gevent
- https://flask-socketio.readthedocs.io/en/latest/
- https://github.com/miguelgrinberg/Flask-SocketIO/blob/master/example/templates/index.html
