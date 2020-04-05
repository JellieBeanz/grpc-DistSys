
package com.learn.jmdnstest;

import java.io.IOException;
import java.net.InetAddress;
import java.util.HashMap;

import javax.jmdns.JmDNS;
import javax.jmdns.ServiceInfo;

// This code is adapted from https://github.com/jmdns/jmdns
public class ExampleServiceRegistration {

    public static void main(String[] args) throws InterruptedException {

        try {
            // Create a JmDNS instance
            JmDNS jmdns = JmDNS.create(InetAddress.getLocalHost());

            // Register a service
            ServiceInfo serviceInfo = ServiceInfo.create("_grpc._tcp.local.", "node_Kettle_service", 8000, "Stream kettle info from kettle server");
            HashMap<String, String> deviceInfoMap = new HashMap<String, String>();
            deviceInfoMap.put("Turn on", "Boolean");
            deviceInfoMap.put("Call", "Callback");
            serviceInfo.setText(deviceInfoMap);
            jmdns.registerService(serviceInfo);

            Thread.sleep(5000);

            ServiceInfo serviceInfo1 = ServiceInfo.create("_grpc._tcp.local.", "node_fridge_service", 8001, "Add Remove items to the fridge");

            HashMap<String, String> deviceInfoMap1 = new HashMap<String, String>();
            deviceInfoMap1.put("AddRemove", "String");
            deviceInfoMap1.put("Set temperature level", "Num: 1-7");
            serviceInfo1.setText(deviceInfoMap1);

            jmdns.registerService(serviceInfo1);
            Thread.sleep(5000);

            ServiceInfo serviceInfo2 = ServiceInfo.create("_grpc._tcp.local.", "python_light_service", 8003, "Turn on off the light");

            HashMap<String, String> deviceInfoMap2 = new HashMap<String, String>();
            deviceInfoMap2.put("TurnON", "ON/Off");
            serviceInfo2.setText(deviceInfoMap2);

            jmdns.registerService(serviceInfo2);
            Thread.sleep(5000);

            ServiceInfo serviceInfo3 = ServiceInfo.create("_grpc._tcp.local.", "node_Dishwasher_service", 8002, "Set Dishwasher and stream the capacity to server");

            HashMap<String, String> deviceInfoMap3 = new HashMap<String, String>();
            deviceInfoMap3.put("setTimer", "string");
            deviceInfoMap3.put("setTemp", "string");
            deviceInfoMap3.put("stream capacity", "Capacity");
            serviceInfo3.setText(deviceInfoMap3);

            jmdns.registerService(serviceInfo3);
            Thread.sleep(5000);

        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }
}
