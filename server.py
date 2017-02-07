import os
import random

import tornado.websocket
import tornado.ioloop
import tornado.web


CHARSET = "abcdefghijklmnopqrstuvwxyz1234567890"
SIZE = 10


def get_drawing():
    return ''.join(random.choice(CHARSET) for _ in range(SIZE))


drawings = {}


class WSHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self, d_id):
        print(drawings)
        self.d_id = d_id
        if d_id not in drawings:
            self.close()
        elif "host" not in drawings[d_id]:
            drawings[d_id]["host"] = self
            self.write_message("host")
        else:
            drawings[d_id]["clients"].append(self)
            self.write_message("client")

    def on_message(self, data):
        if drawings[self.d_id]["host"] is self:
            for client in drawings[self.d_id]["clients"]:
                client.write_message(data)

    def on_close(self):
        if self.d_id in drawings:
            if drawings[self.d_id]["host"] is self:
                for client in drawings[self.d_id]["clients"]:
                    client.close()
                del drawings[self.d_id]
            else:
                drawings[self.d_id]["clients"].remove(self)


class NewHandler(tornado.web.RequestHandler):
    def get(self):
        d_id = get_drawing()
        self.set_status(303)
        self.set_header("Location", "/drawing/" + d_id + "/")
        drawings[d_id] = {"clients": []}


class StaticHandler(tornado.web.StaticFileHandler):
    def parse_url_path(self, url_path):
        if not url_path or url_path.endswith('/'):
            url_path = url_path + 'index.html'
        return url_path


application = tornado.web.Application([
    (r"/websocket/([^/]*)/?", WSHandler),
    (r"/new/?", NewHandler),
    (r"/drawing/[^/]*/(.*)", StaticHandler, {"path": os.getcwd()+"/www"})
])

try:
    print("server starting")
    application.listen(8888)
    tornado.ioloop.IOLoop.current().start()
except KeyboardInterrupt:
    print("server exited")
