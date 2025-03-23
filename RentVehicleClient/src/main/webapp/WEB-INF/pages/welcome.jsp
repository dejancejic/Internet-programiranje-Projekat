<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<jsp:useBean id="clientBean" class="beans.ClientBean" scope="session"></jsp:useBean>

<% if (clientBean==null || !(clientBean.isLoggedIn())) response.sendRedirect("login.jsp"); %>

<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Rent Vehicle Client</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="styles/welcome.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>

<div class="container mt-5">
    <h2 class="text-center mb-4">Choose an option</h2>
    
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        
        <div class="col">
            <div class="card text-center p-3">
                <i class="fa-solid fa-motorcycle icon"></i>
                <div class="card-body">
                    <h5 class="card-title">Rent E-Scooter</h5>
                    <a href="?action=scooter0" class="btn btn-primary">Go</a>
                </div>
            </div>
        </div>

    
        <div class="col">
            <div class="card text-center p-3">
                <i class="fa-solid fa-bicycle icon"></i>
                <div class="card-body">
                    <h5 class="card-title">Rent E-Bike</h5>
                    <a href="?action=bike0" class="btn btn-primary">Go</a>
                </div>
            </div>
        </div>

        
        <div class="col">
            <div class="card text-center p-3">
                <i class="fa-solid fa-car icon"></i>
                <div class="card-body">
                    <h5 class="card-title">Rent E-Car</h5>
                    <a href="?action=car0" class="btn btn-primary">Go</a>
                </div>
            </div>
        </div>

        <div class="col">
            <div class="card text-center p-3">
                <i class="fa-solid fa-user icon"></i>
                <div class="card-body">
                    <h5 class="card-title">Profile</h5>
                    <a href="?action=profile" class="btn btn-primary">Take a look</a>
                </div>
            </div>
        </div>
    </div>
</div>



</body>
</html>
