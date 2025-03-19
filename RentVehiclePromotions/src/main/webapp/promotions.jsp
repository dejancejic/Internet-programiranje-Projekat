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

	boolean isPost=false;
	
		if(request.getSession()!=null && (request.getSession().getAttribute("successMessage")!=null || request.getSession().getAttribute("errorMessage")!=null))
		{
			if(request.getSession().getAttribute("successMessage")!=null &&
				((String)request.getSession().getAttribute("successMessage")).contains("Post"))
			{
				isPost=true;
			}else if(request.getSession().getAttribute("errorMessage")!=null &&
				((String)request.getSession().getAttribute("errorMessage")).contains("post"))
			{
				isPost=true;
			}
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
    <h3 id="promotions-tab" class="tab <%= isPost ? "" : "active-tab" %>" onclick="javascript:switchTab('promotions')">Promotions</h3>
    <h3 id="posts-tab" class="tab <%= isPost ? "active-tab" : "" %>" onclick="javascript:switchTab('posts')">Posts</h3>
  </div>
  <h2 class="mess" id="successMessage"><%=request.getSession().getAttribute("successMessage")!=null?request.getSession().getAttribute("successMessage"):"" %> </h2>

	<h2 class="mess" id="failMessage"><%= request.getSession().getAttribute("errorMessage")!=null?request.getSession().getAttribute("errorMessage"):"" %> </h2>
</div>


  

<div class="search col">
  <input id="searchInput" type="text" class="search-bar" onkeyup="javascript:search()" placeholder="Search by title or content..." />
   <div class="buttons">
      <button id="addPromotionBtn" type="button" class="button" 
    style="display: <%= isPost ? "none" : "block" %>;" 
    data-bs-toggle="modal" data-bs-target="#addPromotionModal">
    Add new promotion &nbsp;&nbsp;<span class="badge text-bg-warning bdge">+</span>
</button>

<button id="addPostBtn" type="button" class="button" 
    style="display: <%= isPost ? "block" : "none" %>;" 
    data-bs-toggle="modal" data-bs-target="#addPostModal">
    Add new post &nbsp; <span class="badge text-bg-warning bdge">+</span>
</button>
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
        <form action="addContent.jsp" method="POST">
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
        <form action="addContent.jsp" method="POST" >
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
  <p id="promotionsCount" style="display: <%= isPost ? "none" : "block" %>;"  class="p"><%= rss.getPromotions().size() %></p>
  <p id="postsCount" class="p" style="display: <%= isPost ? "block" : "none" %>;"><%= rss.getPosts().size() %></p>
  <p id="showDivPromotions" style="display: <%= isPost ? "none" : "block" %>;" class="p">promotions to show</p>
  <p id="showDivPosts" style="display: <%= isPost ? "block" : "none" %>;" class="p">posts to show</p>
</div>

<div class="rw1">
    <div class="tabs" id="promotionsDiv" style="display: <%= isPost ? "none" : "flex" %>;" >
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

    <div class="tabs" id="postsDiv" style="display: <%= isPost ? "flex" : "none" %>;">
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
