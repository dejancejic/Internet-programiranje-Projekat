<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
    <%
    	Double price=(Double)request.getSession().getAttribute("price");
    Boolean carsSelected=(Boolean)request.getSession().getAttribute("carsSelected");
    %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ride in Progress</title>
    
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    
   
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
     <link rel="stylesheet" href="styles/ride.css" />
   
</head>
<body>

    <div id="map"></div>

    <div class="container">
        
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="ride-container text-center">
                    <h2>Ride in Progress</h2>
                    
                    <div class="ride-info">
                        <p><strong>Amount for Payment: </strong>€<span id="paymentAmount"><%=price %></span></p>
                        <p><strong>Time Elapsed: </strong><span id="timeElapsed">1</span> <%if(carsSelected==true){ %>days <%}else{ %>minutes <%} %></p>
                    </div>
                    
                    <!-- End Ride Button -->
                    <button class="btn btn-danger btn-lg btn-end-ride" id="endRideButton" data-toggle="modal" data-target="#confirmModal">
                        End Ride
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="confirmModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirm Ride End</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Are you sure you want to stop the ride and end your journey?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" onclick="endRide()">Yes, End Ride</button>
                </div>
            </div>
        </div>
    </div>

    <script> 
        const paymentAmount = <%=price %>; 
        let days=1;

        let rideDuration = 1; 
        let timeInterval;

        function startRideTimer() {
            timeInterval = setInterval(function() {
                rideDuration++;
                document.getElementById("timeElapsed").innerText = rideDuration;
                getCurrentPosition();
            }, <%if(carsSelected==true){ %>15000 <%}else{ %>3600 <%} %>); 
        }

        startRideTimer();

        
    </script>

    <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
    <script>

        var map = L.map('map').setView([51.505, -0.09], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        function locateUser() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        var userLat = position.coords.latitude;
                        var userLng = position.coords.longitude;

                        map.setView([userLat, userLng], 15);

                        L.marker([userLat, userLng]).addTo(map)
                            .bindPopup("You are here!")
                            .openPopup();
                        
                        
                        fetch("Controller?action=startRide", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: "latitude=" + encodeURIComponent(userLat) + "&longitude=" + encodeURIComponent(userLng)
                        })
                        .then(response => response.text())
                        .then(data => console.log("Start location stored in session:"))
                        .catch(error => console.error("Error:", error));
                        
                    },
                    function () {
                        alert("Geolocation failed. Using default location.");
                    }
                );
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }
        
        function getCurrentPosition()
        {
        	if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        var userLat = position.coords.latitude;
                        var userLng = position.coords.longitude;

                        map.setView([userLat, userLng], 15);

                        map.eachLayer(function (layer) {
                            if (layer instanceof L.Marker) {
                                map.removeLayer(layer);
                            }
                        });
                        
                        L.marker([userLat, userLng]).addTo(map)
                            .bindPopup("You are here!")
                            .openPopup();
                            
                    },
                    function () {
                        alert("Geolocation failed. Using default location.");
                    }
                );
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }
        
        
        function sendEndRideLocation(totalPrice) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        var userLat = position.coords.latitude;
                        var userLng = position.coords.longitude;
                        
                        
                        fetch("Controller?action=endRide", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: "endlatitude=" + encodeURIComponent(userLat) +
                            "&endlongitude=" + encodeURIComponent(userLng)+
                            "&endprice=" + encodeURIComponent(totalPrice)
                        })
                        .then(response => response.text())
                        .then(data =>{
                        	window.location.href="?action=welcome"
                        	let pdfWindow = window.open("?action=generatePDF", "_blank");
                            if (!pdfWindow) {
                                alert("Please allow pop-ups to view your receipt.");
                            }			
                        })
                        .catch(error => console.error("Error:", error));
                        
                    },
                    function () {
                        alert("Geolocation failed. Using default location.");
                    }
                );
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }
        
        function endRide() {
            clearInterval(timeInterval);
            let totalAmount = paymentAmount * rideDuration;
            document.getElementById("paymentAmount").innerText = totalAmount;
            $('#confirmModal').modal('hide');
            sendEndRideLocation(totalAmount);
        }
        

        locateUser(); 
    </script>

    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.3/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

</body>
</html>

