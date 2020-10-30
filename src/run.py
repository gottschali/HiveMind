import threading

import http_server
import hive_server


def main():
    http_thread = threading.Thread(target=http_server.run)
    hive_thread = threading.Thread(target=hive_server.run)

    http_thread.start()
    hive_thread.start()


if __name__ == "__main__":
    main()
