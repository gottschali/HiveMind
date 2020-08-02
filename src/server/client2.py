import socket
from queue import Queue
from threading import Thread

ip = "localhost"
port = 9999

socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

socket.connect((ip, port))

input_Queue = Queue(maxsize=0)
output_Queue = Queue(maxsize=0)

def send_thread(socket,output_Queue):
    while True:
        if not output_Queue.empty():
            message = output_Queue.get()
            socket.send(message.encode("utf-8"))
            print("send: " + message)

def recv_thread(socket,input_Queue):
    while True:
        message=socket.recv(1024).decode("utf-8")
        input_Queue.put(message)
        print("recv " + message)

sendThread=Thread(target=send_thread, args=[socket, output_Queue])
recvThread=Thread(target=recv_thread, args=[socket, input_Queue])

sendThread.start()
recvThread.start()

output_Queue.put("Test")
while True:
    pass

