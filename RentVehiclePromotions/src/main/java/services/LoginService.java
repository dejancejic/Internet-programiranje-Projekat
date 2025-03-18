package services;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.cert.X509Certificate;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import beans.UserBean;

public class LoginService implements Serializable {
    
    private static final long serialVersionUID = 1L;
    private static final String LOGIN_URL = "https://localhost:8443/login/employee";

    public UserBean loginUser(String username, String password) {    
        try {
            String jsonInput = "{ \"username\": \"" + username + "\", \"password\": \"" + password + "\" }";

            disableSSLVerification();
            // Create HTTP connection
            URL url = new URL(LOGIN_URL);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Accept", "application/json");

            // Send request body
            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonInput.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            // Read response code
            int responseCode = connection.getResponseCode();
            if (responseCode != 200) {
                System.out.println("Login failed: HTTP " + responseCode);
                return null;
            }

            // Read response body
            StringBuilder response = new StringBuilder();
            try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"))) {
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
            }

            // Convert response to string
            String responseStr = response.toString();
            System.out.println("Response: " + responseStr); // Debugging

            // Extract role
            String userRole = extractValue(responseStr, "\"role\":\"", "\"");
            String jwtToken = extractValue(responseStr, "\"token\":\"", "\"");

            if ("manager".equalsIgnoreCase(userRole)) {
                UserBean user = new UserBean();
                user.setUsername(username);
                user.setLoggedIn(true);
                user.setToken(jwtToken);
                
                return user;
            } else {
                System.out.println("Access denied: User is not a manager.");
                return null;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String extractValue(String json, String keyStart, String keyEnd) {
        int startIndex = json.indexOf(keyStart);
        if (startIndex == -1) return null;
        startIndex += keyStart.length();
        int endIndex = json.indexOf(keyEnd, startIndex);
        if (endIndex == -1) return null;
        return json.substring(startIndex, endIndex);
    }
    
    
    public static void disableSSLVerification() {
        try {
            // Create a trust manager that does not validate certificate chains
            TrustManager[] trustAllCertificates = new TrustManager[]{
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() {
                        return null;
                    }
                    public void checkClientTrusted(X509Certificate[] certs, String authType) {
                    }
                    public void checkServerTrusted(X509Certificate[] certs, String authType) {
                    }
                }
            };

            // Install the all-trusting trust manager
            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAllCertificates, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

            // Install the all-trusting host name verifier
            HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    
}
