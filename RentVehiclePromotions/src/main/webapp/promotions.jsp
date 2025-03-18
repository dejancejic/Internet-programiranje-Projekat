<%@page import="java.time.ZoneId"%>
<%@page import="java.util.Date"%>
<%@page import="java.time.LocalDate"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="beans.PostBean"%>
<%@page import="beans.PromotionBean"%>
<%@page import="services.RSSService"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<jsp:useBean id="userBean" class="beans.UserBean" scope="session"></jsp:useBean>
<jsp:useBean id="promotionBean" class="beans.PromotionBean" scope="session"></jsp:useBean>
<jsp:useBean id="postBean" class="beans.PostBean" scope="session"></jsp:useBean>
<jsp:useBean id="rss" class="services.RSSService" scope="application"></jsp:useBean>

<% if (!(userBean.isLoggedIn())) response.sendRedirect("login.jsp");

String successMessage = null;
String errorMessage = null;

if (request.getMethod().equalsIgnoreCase("POST")) {
    String promotionTitle = request.getParameter("promotionTitle");
    String promotionDescription = request.getParameter("promotionDescription");
    String promotionDateStr = request.getParameter("promotionDate");
    
    if (promotionTitle != null && promotionDescription != null) {
        LocalDate promotionDate = LocalDate.now();
        PromotionBean newPromotion = new PromotionBean(null,promotionTitle,promotionDate,promotionDescription);

        if (rss.addPromotion(newPromotion) == false) {
            errorMessage = "Failed to add promotion!";
        } else {
            successMessage = "Promotion added successfully!";
        }
    }
    
    // Handle Post form submission
    String postTitle = request.getParameter("postTitle");
    String postContent = request.getParameter("postContent");
    
    if (postTitle != null && postContent != null) {
        PostBean newPost = new PostBean(null,postTitle, postContent);
        rss.addPost(newPost); 
        
        if (rss.addPost(newPost) == false) {
            errorMessage = "Failed to add post!";
        } else {
            successMessage = "Post added successfully!";
        }
    }
    
    request.setAttribute("successMessage", successMessage);
    request.setAttribute("errorMessage", errorMessage);
}

%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Promotions</title>
<link href="styles/promotions.css" type="text/css" rel="stylesheet">
<script src="scripts/promotions.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>

<button class="col end button" type="button" onclick="logout()">Logout</button> 
<div class="top col">
  <div class="col switcher">
    <h3 id="promotions-tab" class="tab active-tab" onclick="javascript:switchTab('promotions')">Promotions</h3>
    <h3 id="posts-tab" class="tab" onclick="javascript:switchTab('posts')">Posts</h3>
  </div>
  <h2 class="mess" id="successMessage"><%=request.getAttribute("successMessage")!=null?request.getAttribute("successMessage"):"" %> </h2>

	<h2 class="mess" id="failMessage"><%= request.getAttribute("errorMessage")!=null?request.getAttribute("errorMessage"):"" %> </h2>
</div>


  

<div class="search col">
  <input id="searchInput" type="text" class="search-bar" onkeyup="javascript:search()" placeholder="Search by title or content..." />
   <div class="buttons">
      <button id="addPromotionBtn" type="button" class="button" data-bs-toggle="modal" data-bs-target="#addPromotionModal">Add new promotion &nbsp;&nbsp;<span class="badge text-bg-warning bdge">+</span></button>
      <button id="addPostBtn" type="button" class="button" style="display:none" data-bs-toggle="modal" data-bs-target="#addPostModal">Add new post &nbsp; <span class="badge text-bg-warning bdge">+</span></button>
  </div>
</div>

<!-- Modal for adding promotion -->
<div class="modal fade" id="addPromotionModal" tabindex="-1" aria-labelledby="addPromotionModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="addPromotionModalLabel">Add New Promotion</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form action="promotions.jsp" method="POST">
          <div class="mb-3">
            <label for="promotionTitle" class="form-label">Title</label>
            <input type="text" class="form-control" id="promotionTitle" name="promotionTitle" required>
          </div>
          <div class="mb-3">
            <label for="promotionDescription" class="form-label">Description</label>
            <textarea class="form-control" id="promotionDescription" name="promotionDescription" rows="3" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Add Promotion</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- Modal for adding post -->
<div class="modal fade" id="addPostModal" tabindex="-1" aria-labelledby="addPostModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="addPostModalLabel">Add New Post</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form action="promotions.jsp" method="POST" >
          <div class="mb-3">
            <label for="postTitle" class="form-label">Title</label>
            <input type="text" class="form-control" id="postTitle" name="postTitle" required>
          </div>
          <div class="mb-3">
            <label for="postContent" class="form-label">Content</label>
            <textarea class="form-control" id="postContent" name="postContent" rows="3" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Add Post</button>
        </form>
      </div>
    </div>
  </div>
</div>



<div class="rw">
  <p id="promotionsCount" class="p"><%= rss.getPromotions().size() %></p>
  <p id="postsCount" class="p" style="display:none"><%= rss.getPosts().size() %></p>
  <p id="showDiv" class="p">promotions to show</p>
</div>

<div class="rw1">
    <div class="tabs" id="promotionsDiv">
    <% for (PromotionBean promotion : rss.getPromotions()) { %>
        <div class="tab-item">
            <div class="rw2">
                <h2 class="h2"><%= promotion.getTitle() %></h2>
                <%
                    LocalDate localDate = promotion.getDate();
                    Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
                    SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy.");
                    String formattedDate = sdf.format(date);
                %>
                <p class="p1"><%= formattedDate %></p>
            </div>
            <p><%= promotion.getDescription() %></p>
        </div>
    <% } %>
    </div>

    <div class="tabs" id="postsDiv" style="display:none">
    <% for (PostBean post : rss.getPosts()) { %>
        <div class="tab-item">
            <h2><%= post.getTitle() %></h2>
            <p><%= post.getContent() %></p>
        </div>
    <% } %>
    </div>
</div>


</body>

</html>
