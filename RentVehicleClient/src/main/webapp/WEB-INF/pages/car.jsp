<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <jsp:useBean id="clientBean" class="beans.ClientBean" scope="session"></jsp:useBean>

<% if (!(clientBean.isLoggedIn())) response.sendRedirect("login.jsp"); %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

</body>
</html>