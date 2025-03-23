<%@page import="dto.Bike"%>
<%@page import="dto.Vehicle"%>
<%@page import="java.util.ArrayList"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <jsp:useBean id="clientBean" class="beans.ClientBean" scope="session"></jsp:useBean>

<% if (clientBean==null || !(clientBean.isLoggedIn())) response.sendRedirect("login.jsp"); %>


<% String bikePosition=(String)request.getSession().getAttribute("bikePosition");
	ArrayList<Vehicle> bikes=(ArrayList<Vehicle>)request.getSession().getAttribute("bikes");
	
	String vehicleId=null;
	if(bikePosition!=null && bikePosition.equals("1"))
	{

		vehicleId=(String)session.getAttribute("vehicleId");
		
	}
%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Bike rental</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="styles/bike.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
<div class="container py-4">
<% if(bikePosition.equals("0")){ %>
        <h2 class="text-center">Choose a bike</h2>
        
        
        <div class="tabs">
        <%for(Vehicle bike:bikes){ %>
        
        <div class="wrapper"  data-id="<%= bike.getId() %>">
      <span  class="badge text-bg-success bdg">Available now</span>
    <img src="data:image/png;base64,<%= bike.getImage() %>" >
    <p class="manufacturer"><%=bike.getManufacturer()%></p>

    <div class="row1">
        <p class="model"><%=bike.getModel() %></p>
        <h6 class="amount">€<%=((Bike)bike).getPrice() %> <p class="day">/ minute</p> </h6>
    </div>
    <div class="amount">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" fill="currentColor" class="bi bi-arrows" viewBox="0 0 16 16">
            <path d="M1.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L2.707 7.5h10.586l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L13.293 8.5H2.707l1.147 1.146a.5.5 0 0 1-.708.708z"/>
          </svg>
          <p><%=((Bike)bike).getRange() %></p>
    </div>
</div>
        
        
        
        <%} %>
        
        </div>
         <% }%>
         
         <% if(bikePosition.equals("1")){ %>
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
                fetch("Controller?action=bike1", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: "vehicleId=" + encodeURIComponent(vehicleId)
                })
                .then(response => response.text())
                .then(data =>window.location.href='?action=bike1')
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
        const confirmPaymentButton = document.getElementById("confirmPayment");

        const isCardValid = cardNumber.length === 19 && /^[0-9\s]+$/.test(cardNumber); 
        const isExpiryValid = expiry.length === 5 && /^[0-9]{2}\/[0-9]{2}$/.test(expiry); 
        const isCvvValid = cvv.length === 3 && /^[0-9]{3}$/.test(cvv);
        
        
        confirmPaymentButton.disabled = !(isCardValid && isExpiryValid && isCvvValid);
    }
</script>     

</body>
</html>