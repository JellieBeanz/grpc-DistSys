package com.learn.jmdnstest;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

import javax.jmdns.JmDNS;
import javax.jmdns.ServiceEvent;
import javax.jmdns.ServiceInfo;
import javax.jmdns.ServiceListener;

// This code is adapted from https://github.com/jmdns/jmdns

public class ExampleServiceDiscovery {
    private static List<ServiceInfo> serviceInfoList = new ArrayList<ServiceInfo>();

	private static class SampleListener implements ServiceListener {
		@Override
		public void serviceAdded(ServiceEvent event) {
			System.out.println("Service added: " + event.getInfo());
		}

		@Override
		public void serviceRemoved(ServiceEvent event) {
			System.out.println("Service removed: " + event.getInfo());
		}

		@Override
		public void serviceResolved(ServiceEvent event) {
                    serviceInfoList.add(event.getInfo());
                    ServiceInfo info = event.getInfo();
                    int port = info.getPort();
                    String path = info.getNiceTextString().split("=")[1];
                    GetRequest.request("http://localhost:"+port+"/"+path);
                    System.out.println(info);
		}
	}

    private static class SampleGrpcListener implements ServiceListener {
        @Override
        public void serviceAdded(ServiceEvent event) {
            System.out.println("Grpc Service added: " + event.getInfo());
        }

        @Override
        public void serviceRemoved(ServiceEvent event) {
            System.out.println("Grpc Service removed: " + event.getInfo());
        }

        @Override
        public void serviceResolved(ServiceEvent event) {
            serviceInfoList.add(event.getInfo());
            ServiceInfo info = event.getInfo();
            int port = info.getPort();
                    /*String path = info.getNiceTextString().split("=")[1];
                    GetRequest.request("http://localhost:"+port+"/"+path);*/
            System.out.println("GRPC Service Resolved");
            System.out.println(info);
        }
    }

	public static void main(String[] args) throws InterruptedException, IOException {
		try {
			// Create a JmDNS instance
			JmDNS jmdns = JmDNS.create(InetAddress.getLocalHost());

			// Add a service listener
			jmdns.addServiceListener("_http._tcp.local.", new SampleListener());

            jmdns.addServiceListener("_grpc._tcp.local.", new SampleGrpcListener());

		} catch (UnknownHostException e) {
			System.out.println(e.getMessage());
		} catch (IOException e) {
			System.out.println(e.getMessage());
		}

        HttpServer server = HttpServer.create(new InetSocketAddress(8088), 0);
        server.createContext("/index.html", new MyHandler());
        server.setExecutor(null); // creates a default executor
        server.start();
	}

    static class MyHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            String response = "";
            for (ServiceInfo info: serviceInfoList) {
                response += ("Name: " + info.getName() + "       Port: " + info.getPort() + "         Type:" + info.getType() + "\n");
            }
            t.sendResponseHeaders(200, response.length());
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }
}