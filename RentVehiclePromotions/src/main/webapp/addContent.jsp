<%@page import="beans.UserBean"%>
<%@page import="java.time.LocalDate"%>
<%@page import="beans.PromotionBean"%>
<%@page import="beans.PostBean"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
 <jsp:useBean id="rss" class="services.RSSService" scope="application"></jsp:useBean>
<jsp:useBean id="userBean" class="beans.UserBean" scope="session"></jsp:useBean>
<%

if (userBean==null || !(userBean.isLoggedIn())){ 
	response.sendRedirect("login.jsp");
}
else{
String successMessage = null;
String errorMessage = null;

if (request.getMethod().equalsIgnoreCase("POST")) {
    String promotionTitle = request.getParameter("promotionTitle");
    String promotionDescription = request.getParameter("promotionDescription");
    String promotionDateStr = request.getParameter("promotionDate");

    if (promotionTitle != null && promotionDescription != null) {
        LocalDate promotionDate = LocalDate.now(); 
        PromotionBean newPromotion = new PromotionBean(null, promotionTitle, promotionDate, promotionDescription);

        if (!rss.addPromotion(newPromotion)) {
            errorMessage = "Failed to add promotion!";
        } else {
            successMessage = "Promotion added successfully!";
        }
    }

    String postTitle = request.getParameter("postTitle");
    String postContent = request.getParameter("postContent");

    if (postTitle != null && postContent != null) {
        PostBean newPost = new PostBean(null, postTitle, postContent);
        
        if (!rss.addPost(newPost)) {
            errorMessage = "Failed to add post!";
        } else {
            successMessage = "Post added successfully!";
        }
    }
}
request.getSession().setAttribute("successMessage", successMessage);
request.getSession().setAttribute("errorMessage", errorMessage);

response.sendRedirect("promotions.jsp");
}
%>   
    
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title></title>
</head>
<body>

</body>
</html>