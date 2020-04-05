from __future__ import print_function
import logging

import grpc

import light_pb2
import light_pb2_grpc


def run():
    # NOTE(gRPC Python Team): .close() is possible on a channel and should be
    # used in circumstances in which the with statement does not fit the needs
    # of the code.
    with grpc.insecure_channel('localhost:8003') as channel:
        stub = light_pb2_grpc.LightStub(channel)
        response = stub.turnOn(light_pb2.lightRequest(status='off'))
    print("Response received: " + response.message)


if __name__ == '__main__':
    logging.basicConfig()
    run()
