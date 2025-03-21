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
%>
<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Account</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <style>
        body {
            background-color: #f8f9fa;
        }
        .card {
            border-radius: 10px;
        }
        .profile-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #007bff;
        }
        .btn-danger {
            transition: background-color 0.3s ease-in-out;
        }
        .btn-danger:hover {
            background-color: #dc3545;
        }
    </style>
</head>
<body>

<div class="container mt-5">
    <h2 class="text-center mb-4">My Account</h2>

    <div class="row">

        <div class="col-md-4">
            <div class="card text-center p-3">
         
                <img src="data:image/png;base64,<%= client.getClient().getImage() %>" 
     alt="Profile image" class="profile-image mx-auto d-block">
                
                <h4 class="mt-3">
             
                    <%=client.getClient().getName() %> <%= client.getClient().getSurname() %>
                </h4>
                <p class="text-muted">@<%= client.getClient().getUsername() %></p>
            </div>


            <div class="card p-4 mt-2">
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
            <div class="card p-3">
                <h5 class="text-center">All Rentals</h5>

                <table class="table table-striped mt-3">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Vozilo</th>
                            <th>Datum</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                      
                        <tr>
                            <td>1</td>
                            <td>Trotinet</td>
                            <td>15.03.2025</td>
                            <td class="text-success">Završeno</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Bicikl</td>
                            <td>18.03.2025</td>
                            <td class="text-warning">U toku</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Automobil</td>
                            <td>20.03.2025</td>
                            <td class="text-danger">Otkazano</td>
                        </tr>
                    </tbody>
                </table>
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


</body>
</html>
