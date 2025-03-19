<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rent Vehicle - Client Login</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
   	
   	<link rel="stylesheet" href="styles/login.css"> 
   
</head>
<body>

<div class="login-container">

    <h3>Client Login</h3>
    <p class="text-white-50">Sign in to rent your electric vehicle</p>

    <form action="?action=login" method="post">
        <div class="mb-3">
            <label for="email" class="form-label">Username</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa fa-user"></i></span>
                <input type="text" class="form-control" id="username" name="username" required placeholder="Enter your username">
            </div>
        </div>

        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa fa-lock"></i></span>
                <input type="password" class="form-control" id="password" name="password" required placeholder="Enter your password">
            </div>
        </div>
        
       <div class="text-center mt-3">
        <p class="text-red-50 text-decoration-none"><%=session.getAttribute("notification")!=null?session.getAttribute("notification").toString():"" %></p>
        </div>
        <div class="d-grid">
            <button type="submit" class="btn btn-success btn-login">Login</button>
        </div>

        <div class="text-center mt-3">
        <a href="?action=register" class="text-blue-50 text-decoration-none">Don't have an account? Register here!</a>
        </div>
    </form>
</div>

</body>
</html>
