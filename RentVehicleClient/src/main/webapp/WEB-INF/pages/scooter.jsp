<%@page import="dto.Scooter"%>
<%@page import="dto.Vehicle"%>
<%@page import="java.util.ArrayList"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <jsp:useBean id="clientBean" class="beans.ClientBean" scope="session"></jsp:useBean>

<% if (clientBean==null || !(clientBean.isLoggedIn())){ response.sendRedirect("?action=login");return; }%>


<% String scooterPosition=(String)request.getSession().getAttribute("scooterPosition");
	ArrayList<Vehicle> scooters=(ArrayList<Vehicle>)request.getSession().getAttribute("scooters");
	
	String vehicleId=null;
	if(scooterPosition!=null && scooterPosition.equals("1"))
	{

		vehicleId=(String)session.getAttribute("vehicleId");
		
	}
%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Scooter rental</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="styles/scooter.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
<div class="container py-4">
<% if(scooterPosition.equals("0")){ %>
        <h2 class="text-center">Choose a scooter</h2>
        
        
        <div class="tabs">
        <%for(Vehicle scooter:scooters){ %>
        
        <div class="wrapper"  data-id="<%= scooter.getId() %>">
      <span  class="badge text-bg-success bdg">Available now</span>
    <img src="data:image/png;base64,<%= scooter.getImage() %>" >
    <p class="manufacturer"><%=scooter.getManufacturer()%></p>

    <div class="row1">
        <p class="model"><%=scooter.getModel() %></p>
        <h6 class="amount">€<%=((Scooter)scooter).getPrice() %> <p class="day">/ minute</p> </h6>
    </div>
    <div class="amount">
        <svg  xmlns="http://www.w3.org/2000/svg" width="50" height="25" fill="currentColor" class="bi bi-speedometer2 svgImage" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4M3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.39.39 0 0 0-.029-.518z"/>
            <path fill-rule="evenodd" d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A8 8 0 0 1 0 10m8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3"/>
          </svg>
          <h6 class="amount"><%=((Scooter)scooter).getSpeed() %> <p class="day">&nbsp;km/h</p> </h6>
    </div>
</div>
        
        
        
        <%} %>
        
        </div>
         <% }%>
         
         <% if(scooterPosition.equals("1")){ %>
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