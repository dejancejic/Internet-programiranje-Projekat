<%@page import="beans.UserBean"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<jsp:useBean id="userBean" class="beans.UserBean" scope="session"></jsp:useBean>
<jsp:useBean id="userManager" class="services.LoginService" scope="application"></jsp:useBean>

<%
    String errorMessage = null;
    if ("POST".equalsIgnoreCase(request.getMethod())) {
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        UserBean user = userManager.loginUser(username, password);
        
        if (user != null) {
            session.setAttribute("userBean", user);
           	
            session.setAttribute("jwt", user.getToken()); // Store JWT token
            response.sendRedirect("promotions.jsp"); // Redirect on success
            return;
        } else {
            errorMessage = "Invalid username or password. Only managers can access this app!";
        }
    }
%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rental Promotions</title>
    <link href="styles/login.css" type="text/css" rel="stylesheet">
    <script src="scripts/login.js"></script>
</head>
<body onload="javascript:init()">

<div class="app">
    <div class="login-container">
        <div class="login-box">
            <div class="login-snip">
                <input id="tab-1" type="radio" name="tab" class="sign-in" checked>
                <label for="tab-1" class="tab">Promotions Login</label>
                <input id="tab-2" type="radio" name="tab" class="sign-up">
                <label for="tab-2" class="tab"></label>
                <div class="login-space">
                    <div class="login">
                        <form method="post">
                            <div class="group">
                                <label for="user" class="label form-label" >Username</label>
                                <input id="user" name="username" autocomplete="off" type="text" class="input" onkeydown="javascript:handleEnter(event, 'pass')" placeholder="Enter your username">
                            </div>
                            <div class="group">
                                <label for="pass" class="label form-label">Password</label>
                                <input id="pass" name="password" type="password" class="input"  placeholder="Enter your password">
                            </div>
                            <div class="group">
                                <button type="submit" class="button">Sign in</button>
                            </div>
                        </form>
                        
                        <% if (errorMessage != null) { %>
                            <p style="color: red;"><%= errorMessage %></p>
                        <% } %>

                        <div class="hr"></div>
                        <div class="foot"></div>
                        <div class="spinner-container" id="spinnerContainer" style="display:none">
                            <div class="spinner"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

