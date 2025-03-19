package services;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Locale;

import beans.PostBean;
import beans.PromotionBean;

import org.w3c.dom.*;
import javax.xml.parsers.*;
import java.io.*;
import java.net.*;

public class RSSService implements Serializable{
	
	private static final long serialVersionUID = 1L;

		
	private  ArrayList<PromotionBean> promotions = new ArrayList<PromotionBean>();
	private  ArrayList<PostBean> posts = new ArrayList<PostBean>();
	
	private static final String SERVER_URL = "https://localhost:8443/";
	private static final String SERVER_RSS_URL = SERVER_URL+"rss";
	private static final String SERVER_POSTS_URL =SERVER_URL+"post/add";
	private static final String SERVER_PROMOTIONS_URL =SERVER_URL+"promotions/add";
	
	
	public void loadRssFeed() {
	    try {
	     
	        LoginService.disableSSLVerification();

	        promotions.clear();
	        posts.clear();

	  
	        URL url = new URL(SERVER_RSS_URL);
	        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
	        
	 
	        connection.setConnectTimeout(5000);
	        connection.setReadTimeout(5000);


	        InputStream inputStream = connection.getInputStream();  


	        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
	        DocumentBuilder builder = factory.newDocumentBuilder();
	        Document document = builder.parse(inputStream);

	  
	        document.getDocumentElement().normalize();

	
	        NodeList channelNodes = document.getElementsByTagName("channel");

	        if (channelNodes.getLength() > 0) {
	            Node channelNode = channelNodes.item(0);
	            Element channelElement = (Element) channelNode;

	       
	            NodeList itemNodes = channelElement.getElementsByTagName("item");

	            for (int i = 0; i < itemNodes.getLength(); i++) {
	         
	                Node itemNode = itemNodes.item(i);
	                Element itemElement = (Element) itemNode;

	                String title = getElementValue(itemElement, "title");
	                //String link = getElementValue(itemElement, "link");
	                String description = getElementValue(itemElement, "description");
	                String pubDateStr = getElementValue(itemElement, "pubDate");
	              
	                if (title.startsWith("Promotion:")) {
	                	LocalDate parsedDate = parseRssDate(pubDateStr);
	                    PromotionBean promotion = new PromotionBean(null, title.substring(10), parsedDate, description);
	                    promotions.add(promotion);
	                } else {
	        
	                    PostBean post = new PostBean(null, title, description);
	                    posts.add(post);
	                }
	            }
	        }

	     
	        inputStream.close();

	    } catch (Exception e) {
	        e.printStackTrace(); 
	    }
	}
	
	
	private LocalDate parseRssDate(String dateStr) {
	    if (dateStr == null || dateStr.isEmpty()) {
	        return null;
	    }
	    try {
	        DateTimeFormatter formatter = DateTimeFormatter.RFC_1123_DATE_TIME.withLocale(Locale.ENGLISH);
	        return LocalDate.parse(dateStr, formatter);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return null;
	    }
	}


   
    private String getElementValue(Element element, String tagName) {
        NodeList nodeList = element.getElementsByTagName(tagName);
        if (nodeList.getLength() > 0) {
            Node node = nodeList.item(0);
            return node.getTextContent();
        }
        return "";
    }
	
	
	
	 
	public ArrayList<PromotionBean> getPromotions() {
		
		loadRssFeed();
		return promotions;
	}
	
	
	
	public void setPromotions(ArrayList<PromotionBean> promotions) {
		this.promotions = promotions;
	}
	public ArrayList<PostBean> getPosts() {	
		return posts;
	}
	public void setPosts(ArrayList<PostBean> posts) {
		this.posts = posts;
	}
	
	public boolean addPost(PostBean post) {
	    try {
	        LoginService.disableSSLVerification();
	        
	       
	        String postData = "{"
	                + "\"title\": \"" + post.getTitle() + "\","
	                + "\"content\": \"" + post.getContent() + "\""
	                + "}";

	        // Send POST request to server
	        URL url = new URL(SERVER_POSTS_URL);
	        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
	        connection.setRequestMethod("POST");
	        connection.setDoOutput(true);
	        connection.setConnectTimeout(5000);
	        connection.setReadTimeout(5000);

	     
	        connection.setRequestProperty("Content-Type", "application/json");

	
	        try (DataOutputStream outputStream = new DataOutputStream(connection.getOutputStream())) {
	            outputStream.writeBytes(postData);
	            outputStream.flush();
	        }

	   
	        int responseCode = connection.getResponseCode();
	        if (responseCode == HttpURLConnection.HTTP_OK) {
	          
	            return posts.add(post);
	        } else {
	            System.out.println("Failed to add post. Response code: " + responseCode);
	            return false;
	        }

	    } catch (Exception e) {
	        e.printStackTrace(); 
	        return false;
	    }
	}


	public boolean addPromotion(PromotionBean promotion) {
	    try {
	        LoginService.disableSSLVerification();
	        
	 
	        String postData = "{"
	                + "\"title\": \"" + promotion.getTitle() + "\","
	                + "\"description\": \"" + promotion.getDescription() + "\","
	                + "\"date\": \"" + promotion.getDate().toString() + "\""
	                + "}";

	      
	        URL url = new URL(SERVER_PROMOTIONS_URL);
	        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
	        connection.setRequestMethod("POST");
	        connection.setDoOutput(true);
	        connection.setConnectTimeout(5000);
	        connection.setReadTimeout(5000);


	        connection.setRequestProperty("Content-Type", "application/json");

	        // Send the data
	        try (DataOutputStream outputStream = new DataOutputStream(connection.getOutputStream())) {
	            outputStream.writeBytes(postData);
	            outputStream.flush();
	        }

	       
	        int responseCode = connection.getResponseCode();
	        if (responseCode == HttpURLConnection.HTTP_OK) {
	            // Successfully added the promotion, return true
	            return promotions.add(promotion);
	        } else {
	            System.out.println("Failed to add promotion. Response code: " + responseCode);
	            return false;
	        }

	    } catch (Exception e) {
	        e.printStackTrace();  
	        return false;
	    }
	}

	
	
	
	

	

}
