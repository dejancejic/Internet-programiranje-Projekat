<%@page import="dto.Car"%>
<%@page import="dto.Vehicle"%>
<%@page import="java.util.ArrayList"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <jsp:useBean id="clientBean" class="beans.ClientBean" scope="session"></jsp:useBean>

<% if (clientBean==null || !(clientBean.isLoggedIn())) response.sendRedirect("login.jsp"); %>

<% String carPosition=(String)request.getSession().getAttribute("carPosition");
	ArrayList<Vehicle> cars=(ArrayList<Vehicle>)request.getSession().getAttribute("cars");
	
	String vehicleId=null;
	if(carPosition!=null && carPosition.equals("1"))
	{

		vehicleId=(String)session.getAttribute("vehicleId");
		
	}
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Car rental</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="styles/car.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>

<div class="container py-4">
	<% if(carPosition.equals("0")){ %>
        <h2 class="text-center">Choose a car</h2>
        
        
        <div class="tabs">
        <%for(Vehicle car:cars){ %>
        
        <div class="wrapper"  data-id="<%= car.getId() %>">
      <span  class="badge text-bg-success bdg">Available now</span>
    <img src="data:image/png;base64,<%= car.getImage() %>" >
    <p class="manufacturer"><%=car.getManufacturer()%></p>

    <div class="row1">
        <p class="model"><%=car.getModel() %></p>
        <h6 class="amount">€<%=((Car)car).getPrice() %> <p class="day">/ day</p> </h6>
    </div>
</div>
        
        
        
        <%} %>
        
        </div>
         <% }%>
        	
        	<% if(carPosition.equals("1")){ %>
        	<form action="?action=ride" method="POST">
    <h2 class="text-center">Payment</h2>
    <div class="mb-3">
        <label for="cardNumber" class="form-label">Card number</label>
        <input type="text" name= "cardNumber" required class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" oninput="validateForm()">
    </div>
    <div class="row mb-3">
        <div class="col-md-6">
            <label for="expiry" class="form-label">Expiration date</label>
            <input type="text" name= "expiry" required class="form-control" id="expiry" placeholder="MM/YY" oninput="validateForm()">
        </div>
        <div class="col-md-6">
            <label for="cvv" class="form-label">CVC</label>
            <input type="text" name= "cvv" required class="form-control" id="cvv" placeholder="123" oninput="validateForm()">
        </div>
    </div>

    <button id="confirmPayment" class="btn btn-primary w-100" type="button" disabled onclick="enableStartRide()">Confirm payment</button>
     
     
     <div class="mt-4">
     <label for="licence" class="form-label">Licence number</label>
            <input type="text" required class="form-control" name= "licence" id="licence" placeholder="KM1223345" oninput="validateForm()">
     </div>
     
    <div class="text-center mt-4">
        <button id="startRide" disabled class="btn btn-success" type="submit">Start ride</button>
    </div>
</form>
        <%} %>
    </div>

    <script>
        function enableStartRide(){
            document.getElementById("startRide").disabled=false;
        }
    </script>
    
    <script>
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".wrapper").forEach(function (wrapper) {
            wrapper.addEventListener("click", function () {
                let vehicleId = this.getAttribute("data-id");
                fetch("Controller?action=car1", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: "vehicleId=" + encodeURIComponent(vehicleId)
                })
                .then(response => response.text())
                .then(data =>window.location.href='?action=car1')
                .catch(error => console.error("Error:", error));
            });
        });
    });
</script>


<script>
   
    function validateForm() {
        const cardNumber = document.getElementById("cardNumber").value;
        const expiry = document.getElementById("expiry").value;
        const cvv = document.getElementById("cvv").value;
        const licence = document.getElementById("licence").value;
        const confirmPaymentButton = document.getElementById("confirmPayment");

        const isCardValid = cardNumber.length === 19 && /^[0-9\s]+$/.test(cardNumber); 
        const isExpiryValid = expiry.length === 5 && /^[0-9]{2}\/[0-9]{2}$/.test(expiry); 
        const isCvvValid = cvv.length === 3 && /^[0-9]{3}$/.test(cvv);
        const isLicenceValid = licence.length ===10;
        
        confirmPaymentButton.disabled = !(isCardValid && isExpiryValid && isCvvValid && isLicenceValid);
    }
</script>
    

</body>
</html>