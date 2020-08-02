import socket
from queue import Queue
from threading import Thread
host="localhost"
port=9999

input_Queue = Queue(maxsize=0)
output_Queue = Queue(maxsize=0)

serverSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serverSocket.bind((host, port))

def accept(serverSocket):
    clientsList = []
    while len(clientsList) < 2:
        serverSocket.listen(5)
        connection, address = serverSocket.accept()
        clientsList.append(connection)

    return clientsList
    # for client in clientsList:
    #     client.send(("testmessage").encode("utf-8"))


def send_Thread(output_Queue, clientList):
    while True:
        if not output_Queue.empty():
            message = output_Queue.get()
            for client in clientList:
                client.send(message.encode("utf-8"))
                print("send")


def startRecv(input_Queue,clientList):
    for client in clientList:
        clientThread = Thread(target=recv_Thread, args=[input_Queue, client])
        clientThread.start()
        print("started recv")


def recv_Thread(queue,client):
    while True:
        message=client.recv(1024).decode("utf-8")
        queue.put(message)


def work(message):
    message += "WORK"
    return message

clientsList = accept(serverSocket)

sendThread = Thread(target=send_Thread, args=[output_Queue, clientsList])
sendThread.start()
startRecv(input_Queue, clientsList)
while True:
    if not input_Queue.empty():
        message = input_Queue.get()
        print("server recv" + message)
        messageBack = work(message)
        output_Queue.put(messageBack)

