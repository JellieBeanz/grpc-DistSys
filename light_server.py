
from concurrent import futures
import logging

import grpc

import light_pb2
import light_pb2_grpc


class Greeter(light_pb2_grpc.LightServicer):

    def turnOn(self, request, context):
        status = request.status
        return light_pb2.lightReply(message='Light is now %s!' % request.status)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    light_pb2_grpc.add_LightServicer_to_server(Greeter(), server)
    server.add_insecure_port('[::]:8003')
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig()
    serve()
