<%@page import="java.time.Duration"%>
<%@page import="java.time.LocalDateTime"%>
<%@page import="java.time.format.DateTimeFormatter"%>
<%@page import="dto.Scooter"%>
<%@page import="dto.Bike"%>
<%@page import="dto.Car"%>
<%@page import="beans.RentBean"%>
<%@page import="dto.Rental"%>
<%@page import="java.io.Console"%>
<%@page import="java.util.Base64"%>
<%@page import="beans.ClientBean"%>
<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<jsp:useBean id="clientBean" class="beans.ClientBean" scope="session"></jsp:useBean>

<% if (!(clientBean.isLoggedIn())) response.sendRedirect("login.jsp"); %>

<%
	ClientBean client=(ClientBean)request.getSession().getAttribute("clientBean");
	String error = (String) request.getAttribute("error");
	String success = (String) request.getAttribute("success");
	
	RentBean rentBean=(RentBean)request.getSession().getAttribute("rentBean");
%>
<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Account</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="styles/profile.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
</head>
<body>

<div class="container mt-5">
    <h2 class="text-center mb-4 active-tab">My Account</h2>

    <div class="row">

        <div class="col-md-4">
            <div class="card text-center p-3">
         
                <img src="data:image/png;base64,<%= client.getClient().getImage() %>" 
     alt="Profile image" class="profile-image mx-auto d-block">
                
                <h4 class="mt-3">
             
                    <%=client.getClient().getName() %> <%= client.getClient().getSurname() %>
                </h4>
                <p class="text-muted">@<%= client.getClient().getUsername() %></p>
                
                <p class="text-muted">ID: <%= client.getClient().getDocument().toString() %></p>
            </div>


            <div class="card p-4 mt-2 mb-3">
                <h5 class="text-center">Settings</h5>

         	<form method="POST" action="?action=changePassword">
            <label for="oldPassword" class="form-label">Old password:</label>
            <input type="password" class="form-control" id="oldPassword" name="oldPassword" required>
                 
            <label for="newPassword" class="form-label">New password:</label>
            <input type="password" class="form-control" id="newPassword" name="newPassword" required>
            <button type="submit" class="btn btn-primary w-100 mt-3">Change password</button>
             
            </form>
            
           
              

			<button type="submit" class="btn btn-danger w-100 mt-3" data-bs-toggle="modal" data-bs-target="#deleteAccountModal">Deactivate account</button>
            </div>
        </div>

       <div class="col-md-8">
    <div class="card p-3 mb-4">
        <h5 class="text-center">All Rentals</h5>

        <table class="table table-striped mt-3" id="rentalsTable">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Type</th>
                    <th>Vehicle</th>
                    <th>Date</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                <% 
                // Define formatter for date display
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"); 

                for (Rental r : rentBean.getRents()) { 
                    LocalDateTime startDate = r.getDate();
                    LocalDateTime endDate = r.getDuration(); // Assuming this is the return date

                    // Calculate duration difference
                    Duration duration = Duration.between(startDate, endDate);
                    long days = duration.toDays();
                    long minutes = duration.toMinutesPart(); // Only Java 9+, otherwise use (duration.toMinutes() % 60)
                %>
                <tr>
                    <td>
                        <img src="data:image/png;base64,<%= r.getVehicle().getImage() %>" 
                            alt="Vehicle" class="vehicle-image mx-auto d-block">
                    </td>
                    <td class="td1">
                        <% if (r.getVehicle() instanceof Car) { %>
                            <span class="badge text-bg-primary">Car</span>
                        <% } %>
                        <% if (r.getVehicle() instanceof Bike) { %>
                            <span class="badge text-bg-warning">Bike</span>
                        <% } %>
                        <% if (r.getVehicle() instanceof Scooter) { %>
                            <span class="badge text-bg-success">Scooter</span>
                        <% } %>
                    </td>
                    <td class="td1">
                        <%= r.getVehicle().getManufacturer() + " " + r.getVehicle().getModel() %>
                    </td>
                    <td class="td1">
                        <%= startDate.format(formatter) %> 
                    </td>
                    <td class="td1">
                        <%= days + " days, " + minutes + " minutes" %>
                    </td>
                </tr>
                <% } %>
            </tbody>
        </table>

        <!-- Bootstrap Pagination Controls -->
        <nav>
            <ul class="pagination justify-content-start" id="pagination">
                <!-- Pagination items will be added dynamically -->
            </ul>
        </nav>
    </div>
</div>
    </div>
</div>


<div class="modal fade" id="deleteAccountModal" tabindex="-1" aria-labelledby="deleteAccountModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteAccountModalLabel">Account Deactivation</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Are you sure you want to deactivate your account?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                <form action="?action=deactivate" method="post">
                    <button type="submit" class="btn btn-danger">Yes</button>
                </form>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="errorModalLabel">Error</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            <% if ("wrongPassword".equals(error)) { %>
                The old password you entered is incorrect. Please try again.
                <%} %>
                 <% if ("updateFailed".equals(error)) { %>
                Something went wrong. Please try again.
                <%} %>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title" id="successModalLabel">Success</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Your password has been successfully changed.
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        <% if ("wrongPassword".equals(error)|| "updateFailed".equals(error)) { %>
            var errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
            errorModal.show();
        <% } else if ("changed".equals(success)) { %>
            var successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();
        <% } %>
    });
</script>


<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
$(document).ready(function() {
    var rowsPerPage = 4; // Number of rows per page
    var rows = $("#rentalsTable tbody tr");
    var totalRows = rows.length;
    var totalPages = Math.ceil(totalRows / rowsPerPage);

    function showPage(page) {
        rows.hide();
        rows.slice((page - 1) * rowsPerPage, page * rowsPerPage).show();
        $(".page-item").removeClass("active");
        $("#page" + page).addClass("active");
    }

    // Generate pagination buttons
    var pagination = $("#pagination");
    pagination.append('<li class="page-item disabled" id="prevPage"><a class="page-link" href="#">Previous</a></li>');
    for (var i = 1; i <= totalPages; i++) {
        pagination.append('<li class="page-item" id="page' + i + '"><a class="page-link" href="#">' + i + '</a></li>');
    }
    pagination.append('<li class="page-item" id="nextPage"><a class="page-link" href="#">Next</a></li>');

    showPage(1); 

    $(".page-item").click(function() {
        var id = $(this).attr("id");
        if (id.startsWith("page")) {
            var pageNum = parseInt(id.replace("page", ""));
            showPage(pageNum);
        }
    });

    $("#prevPage").click(function() {
        var currentPage = $(".page-item.active").attr("id").replace("page", "");
        if (currentPage > 1) {
            showPage(parseInt(currentPage) - 1);
        }
    });

    $("#nextPage").click(function() {
        var currentPage = $(".page-item.active").attr("id").replace("page", "");
        if (currentPage < totalPages) {
            showPage(parseInt(currentPage) + 1);
        }
    });
});
</script>




</body>
</html>
