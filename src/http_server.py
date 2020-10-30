from http.server import HTTPServer, BaseHTTPRequestHandler, SimpleHTTPRequestHandler
from functools import partial


def run(server_class=HTTPServer, handler_class = SimpleHTTPRequestHandler, directory="web"):
    print("Starting http server")
    server_address = ('localhost', 8080)
    with server_class(server_address, partial(handler_class, directory=directory)) as httpd:
        httpd.serve_forever()
    print("Stopping http server")


if __name__ == "__main__":
    run()
