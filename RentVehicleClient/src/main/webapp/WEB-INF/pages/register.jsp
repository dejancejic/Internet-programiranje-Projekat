<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rent Vehicle - Client Register</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="styles/login.css"> 
    <script>
        function toggleDocumentFields() {
            var userType = document.getElementById("userType").value;
            var documentField = document.getElementById("documentField");
            var passportField = document.getElementById("passportField");
            
            if (userType === "domestic") {
                documentField.style.display = "block";
                passportField.style.display = "none";
            } else {
                documentField.style.display = "none";
                passportField.style.display = "block";
            }
        }
    </script>
    
<script>
document.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.getElementById("profileImageInput"); 
    const hiddenInput = document.getElementById("profileImageBase64"); 

    if (fileInput && hiddenInput) { 
        fileInput.addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = function() {
                    hiddenInput.value = reader.result.split(",")[1];
                };
                reader.readAsDataURL(file);
            }
        });
    } 
});  
</script>
</head>
<body>
 
<div class="login-container mt-4">
    <h3>Client Register</h3>
    <p class="text-white-50">Sign up to rent your electric vehicle</p>

    <form action="?action=registration" method="post" >
        <div class="mb-3">
            <label for="username" class="form-label">Username</label>
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
        <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa fa-user-tag"></i></span>
                <input type="text" class="form-control" id="name" name="name" required placeholder="Enter your name">
            </div>
        </div>
        
        <div class="mb-3">
            <label for="surname" class="form-label">Surname</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa fa-user-tag"></i></span>
                <input type="text" class="form-control" id="surname" name="surname" required placeholder="Enter your surname">
            </div>
        </div>
        
        <div class="mb-3">
            <label for="phone" class="form-label">Phone</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa fa-phone"></i></span>
                <input type="tel" class="form-control" id="phone" name="phone" required placeholder="Enter your phone number">
            </div>
        </div>
        
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa fa-envelope"></i></span>
                <input type="email" class="form-control" id="email" name="email" required placeholder="Enter your email">
            </div>
        </div>
        
        <div class="mb-3">
            <label for="userType" class="form-label">User Type</label>
            <select class="form-control" id="userType" name="userType" onchange="toggleDocumentFields()">
                <option value="domestic">Domestic</option>
                <option value="foreigner">Foreigner</option>
            </select>
        </div>
        
        <div class="mb-3" id="documentField">
            <label for="documentnumber" class="form-label">Document Number</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa fa-id-card"></i></span>
                <input type="text" class="form-control" id="documentnumber" name="documentnumber"  placeholder="Enter your document number">
            </div>
        </div>
        
        <div class="mb-3" id="passportField" style="display: none;">
            <label for="passportnumber" class="form-label">Passport Number</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa fa-passport"></i></span>
                <input type="text" class="form-control" id="passportnumber" name="passportnumber" placeholder="Enter your passport number">
            </div>
        </div>
        
        <div class="mb-3">
            <label for="profileImage" class="form-label">Profile Image</label>
            <div class="input-group">
           	 <input type="hidden" name="profileImageBase64" id="profileImageBase64">
                <input type="file" class="form-control" id="profileImageInput" accept="image/*">
            </div>
        </div>
         
        <div class="d-grid">
            <button type="submit" class="btn btn-success btn-login">Register</button>
        </div>
        <div class="text-center mt-3">
        <p class="text-red-50 text-decoration-none"><%=session.getAttribute("notification")!=null?session.getAttribute("notification").toString():"" %></p>
        </div>
 
        <div class="text-center mt-3">
            <a href="?action=login" class="text-blue-60 text-decoration-none have">Already have an account? Login here!</a>
        </div>
    </form>
</div>

</body>
</html>
