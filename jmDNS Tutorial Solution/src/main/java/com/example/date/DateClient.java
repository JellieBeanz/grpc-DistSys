package com.example.date;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.jmdns.JmDNS;
import javax.jmdns.ServiceEvent;
import javax.jmdns.ServiceInfo;
import javax.jmdns.ServiceListener;
import javax.swing.JOptionPane;

// This code is adapted from https://github.com/jmdns/jmdns

public class DateClient {

	private static class SampleListener implements ServiceListener {
		@Override
		public void serviceAdded(ServiceEvent event) {
			
			  
			System.out.println("Service added: " + event.getInfo());
			
			
			 try {                
                 Socket s = new Socket("localhost", 9090);
                 BufferedReader input = new BufferedReader(new InputStreamReader(s.getInputStream()));
                 String answer = input.readLine();
                 JOptionPane.showMessageDialog(null, answer);
                 System.exit(0);
             } catch (IOException ex) {
                 Logger.getLogger(DateClient.class.getName()).log(Level.SEVERE, null, ex);
             }
			 
		}

		@Override
		public void serviceRemoved(ServiceEvent event) {
			System.out.println("Service removed: " + event.getInfo());
		}

		@Override
		public void serviceResolved(ServiceEvent event) {
                    System.out.println("Service resolved: " + event.getInfo());

                    try {
                        ServiceInfo info = event.getInfo();
                        int port = info.getPort();
                        String address = info.getHostAddresses()[0];
                        Socket s = new Socket(address, port);
                        BufferedReader input = new BufferedReader(new InputStreamReader(s.getInputStream()));
                        String answer = input.readLine();
                        JOptionPane.showMessageDialog(null, answer);
                        System.exit(0);
                    } catch (IOException ex) {
                        Logger.getLogger(DateClient.class.getName()).log(Level.SEVERE, null, ex);
                    }
		}
	}

	public static void main(String[] args) throws InterruptedException {
		try {
			// Create a JmDNS instance
			JmDNS jmdns = JmDNS.create(InetAddress.getLocalHost());

			// Add a service listener
			jmdns.addServiceListener("_date._tcp.local.", new SampleListener());

		} catch (UnknownHostException e) {
			System.out.println(e.getMessage());
		} catch (IOException e) {
			System.out.println(e.getMessage());
		}
	}
}