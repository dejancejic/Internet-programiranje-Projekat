package controller;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Paths;
import java.time.LocalDateTime;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfWriter;

import beans.ClientBean;
import beans.RentBean;
import beans.VehicleBean;
import dao.RentalDAO;
import dto.Bike;
import dto.Car;
import dto.Client;
import dto.Document;
import dto.Passport;
import dto.Rental;
import dto.Scooter;
import dto.Vehicle;



/**
 * Servlet implementation class Controller
 */
@WebServlet("/Controller")
public class Controller extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Controller() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		String address = "/WEB-INF/pages/login.jsp";
		String action = request.getParameter("action");
		HttpSession session = request.getSession();

		session.setAttribute("notification", "");
		
		
		try {
		if(action==null || action.equals(""))
		{
			address=("WEB-INF/pages/login.jsp");
		}
		else if (action.equals("logout"))
		{
			session.invalidate();
			address = "/WEB-INF/pages/login.jsp";
		}
		else if(action.equals("register"))
		{
			address="/WEB-INF/pages/register.jsp";
		}
		else if(action.equals("login"))
		{
			String username = request.getParameter("username");
			String password = request.getParameter("password");
			ClientBean clientBean = new ClientBean();
			
			if (clientBean.login(username, password)) {
				session.setAttribute("clientBean", clientBean);
				
				address = "/WEB-INF/pages/welcome.jsp";
			} else {
				session.setAttribute("notification", "Credentials are not valid!");
			}
		}
		else if(action.equals("registration"))
		{
			String username = request.getParameter("username");
			String password = request.getParameter("password");
			String name = request.getParameter("name");
			String surname = request.getParameter("surname");
			String email = request.getParameter("email");
			String phone = request.getParameter("phone");
			
			String imageBase64 = request.getParameter("profileImageBase64"); // Get the Base64 string
		    
			String number=request.getParameter("documentnumber");
			String passportNumber=request.getParameter("passportnumber");
			Document doc=null;
			
			if(number==null)
			{
				doc=new Passport(null,number,passportNumber);
			}
			else
			{
				doc=new Document(null,number);
			}
			
			
			Client cl=new Client(null,username,password,name,surname,email,phone,imageBase64,doc);
			
			
			
			ClientBean clientBean = new ClientBean();
			
			if(clientBean.register(cl))
			{
				session.setAttribute("clientBean", clientBean);
				
				address = "/WEB-INF/pages/welcome.jsp";
			}
			else {
				address = "/WEB-INF/pages/register.jsp";
				session.setAttribute("notification", "Account already exists!");
			}
		}
		else if(action.equals("welcome"))
		{
			address = "/WEB-INF/pages/welcome.jsp";
		}
		else if(action.equals("scooter"))
		{
			address = "/WEB-INF/pages/scooter.jsp";
		}
		else if(action.equals("car0") || action.equals("car1"))
		{
			session.setAttribute("carsSelected", true);
			String split[]=action.split("car");
			
			 String vehicleId = request.getParameter("vehicleId");
			 if (vehicleId != null) {
	                request.getSession().setAttribute("vehicleId", vehicleId);

	            } 
			if(split.length==2)
			{
				String num=split[1];
				if(num.equals("0"))
				{
					VehicleBean vb=new VehicleBean();
					vb.getCars();

					session.setAttribute("cars", vb.getVehicles());
				}
				
				session.setAttribute("carPosition", num);
			}
			address = "/WEB-INF/pages/car.jsp";
		}
		else if(action.equals("bike0") || action.equals("bike1"))
		{
			session.setAttribute("carsSelected", false);
			String split[]=action.split("bike");
			
			 String vehicleId = request.getParameter("vehicleId");
			 if (vehicleId != null) {
	                request.getSession().setAttribute("vehicleId", vehicleId);

	            } 
			if(split.length==2)
			{
				String num=split[1];
				if(num.equals("0"))
				{
					VehicleBean vb=new VehicleBean();
					vb.getBikes();
					
					session.setAttribute("bikes", vb.getVehicles());
				}
			
				session.setAttribute("bikePosition", num);
			}
			
			address = "/WEB-INF/pages/bike.jsp";
		}
		else if(action.equals("scooter0") || action.equals("scooter1"))
		{
			session.setAttribute("carsSelected", false);
			String split[]=action.split("scooter");
			
			 String vehicleId = request.getParameter("vehicleId");
			 if (vehicleId != null) {
	                request.getSession().setAttribute("vehicleId", vehicleId);

	            } 
			if(split.length==2)
			{
				String num=split[1];
				if(num.equals("0"))
				{
					VehicleBean vb=new VehicleBean();
					vb.getScooters();
					
					session.setAttribute("scooters", vb.getVehicles());
				}
				
				session.setAttribute("scooterPosition", num);
			}
			
			address = "/WEB-INF/pages/scooter.jsp";
		}
		else if(action.equals("profile"))
		{
			RentBean rentBean=new RentBean();
			
			ClientBean cl=(ClientBean)session.getAttribute("clientBean");
			
			rentBean.getClientRents(cl.getClient().getId());
			
			session.setAttribute("rentBean", rentBean);
			
			address = "/WEB-INF/pages/profile.jsp";
		}
		else if(action.equals("deactivate"))
		{
			ClientBean cl=(ClientBean)session.getAttribute("clientBean");
			
			 
			if(cl.setClientBlockedStatus(cl.getClient(), true))
			{
			
			session.removeAttribute("clientBean");
			address = "/WEB-INF/pages/login.jsp";
			}else 
			{
				address = "/WEB-INF/pages/profile.jsp";
			}			
		}
		else if(action.equals("changePassword"))
		{
			String oldPassword = request.getParameter("oldPassword");
            String newPassword = request.getParameter("newPassword");
            
            ClientBean cl=(ClientBean)session.getAttribute("clientBean");
			
            if(!cl.checkOldPassword(oldPassword))
            {
                request.setAttribute("error", "wrongPassword");
            }
            else if (cl.updatePassword(newPassword)) {
                request.setAttribute("success", "changed");
            } else if(!cl.updatePassword(newPassword)){
                request.setAttribute("error", "updateFailed");
            }
            
            
			address = "/WEB-INF/pages/profile.jsp";
		
		}
		else if(action.equals("ride"))
		{
			String cardNumber = request.getParameter("cardNumber");
			String expiry= request.getParameter("expiry");
			String cvv = request.getParameter("cvv");
			if(request.getParameter("licence")!=null)
			session.setAttribute("licence",request.getParameter("licence"));
			
			
			VehicleBean vb=new VehicleBean();
			String vehicleId=(String)session.getAttribute("vehicleId");
			Vehicle veh=vb.getVehicle(Integer.parseInt(vehicleId));
			Double price=0.0;
			if(veh instanceof Car)
			{
				price=((Car)veh).getPrice();
			}
			else if(veh instanceof Bike)
			{
				price=((Bike)veh).getPrice();
			}
			else if(veh instanceof Scooter)
			{
				 price=((Scooter)veh).getPrice();
			}
			session.setAttribute("price", price);
			session.setAttribute("cardNumber", cardNumber);
			session.setAttribute("expiry", expiry);
			session.setAttribute("cvv", cvv);
			
			address = "/WEB-INF/pages/ride.jsp";
		}
		else if(action.equals("startRide"))
		{
			LocalDateTime time=LocalDateTime.now();
			session.setAttribute("startTime", time);
			
			 String latitude = request.getParameter("latitude");
		        String longitude = request.getParameter("longitude");

		        if (latitude != null && longitude != null) {
		            
		            session.setAttribute("startLatitude", latitude);
		            session.setAttribute("startLongitude", longitude);
		        } 
		}
		else if(action.equals("endRide"))
		{
			LocalDateTime time=LocalDateTime.now();
			session.setAttribute("endTime", time);
			String latitude = request.getParameter("endlatitude");
	        String longitude = request.getParameter("endlongitude");
	        String price=request.getParameter("endprice");
	        if (latitude != null && longitude != null && price!=null) {
	            
	            session.setAttribute("endLatitude", latitude);
	            session.setAttribute("endLongitude", longitude);
	            session.setAttribute("endPrice", price);
	            address= "/WEB-INF/pages/welcome.jsp";
	            
	            
	        }
		
		}
		else if(action.equals("generatePDF"))
		{
			 String startLat =(String) session.getAttribute("startLatitude");
			    String startLng = (String)session.getAttribute("startLongitude");
			    String endLat = (String)session.getAttribute("endLatitude"); 
			    String endLng = (String)session.getAttribute("endLongitude");
			LocalDateTime start=(LocalDateTime)session.getAttribute("startTime");
			LocalDateTime end=(LocalDateTime)session.getAttribute("endTime");
			
			ClientBean cb=(ClientBean)session.getAttribute("clientBean");
			Integer idClient=cb.getClient().getId();
			Integer idDocument=cb.getClient().getDocument().getId();
			
			VehicleBean vb=new VehicleBean();
			String vehicleId =(String) session.getAttribute("vehicleId");
			Vehicle veh=vb.getVehicle(Integer.parseInt(vehicleId));
		
			
			Rental rental=new Rental(null,start,startLat,startLng,endLat,endLng,end,veh);
			rental.setClientId(idClient);
			rental.setDocumentId(idDocument);
			
			if(veh instanceof Car)
			{
				rental.setLicenceNumber((String)session.getAttribute("licence"));
			}

			
			RentBean rd=new RentBean();
			rd.addRent(rental);
			generatePDFReceipt(request, response,rental,cb.getClient());
			return;
		}
		else if(action.equals("logout"))
		{
			address= "/WEB-INF/pages/login.jsp";
			
			ClientBean cb=(ClientBean)session.getAttribute("clientBean");
			cb.logout();
			session.setAttribute("clientBean",cb);
		}
		}catch(Exception ex)
		{
			address= "/WEB-INF/pages/login.jsp";
		}
		
		
		
		RequestDispatcher dispatcher=request.getRequestDispatcher(address);
		dispatcher.forward(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	private void generatePDFReceipt(HttpServletRequest request, HttpServletResponse response, Rental rental,Client client) throws IOException {
	    response.setContentType("application/pdf");
	    response.setHeader("Content-Disposition", "inline; filename=ride_receipt.pdf");

	    
	    String cardNumber=(String)request.getSession().getAttribute("cardNumber");
	    
	    OutputStream out = response.getOutputStream();
	    
	    try {
	    	
	    	 BaseFont baseFont = BaseFont.createFont("C:/Windows/Fonts/arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
	         Font utf8Font = new Font(baseFont, 12, Font.NORMAL);
	         Font titleFont = new Font(baseFont, 18, Font.BOLD);
	         
	        com.itextpdf.text.Document document = new com.itextpdf.text.Document();
	        PdfWriter.getInstance(document, out);
	        document.open();


	        document.add(new Paragraph("Ride Receipt",titleFont));
	        document.add(new Paragraph("\nStart Location: " + rental.getTakenX() + ", " + rental.getTakenY(),utf8Font));
	        document.add(new Paragraph("End Location: " + rental.getLeftX() + ", " + rental.getLeftY(),utf8Font));
	        document.add(new Paragraph("Total Amount: €" + rental.calculatePrice(),utf8Font));
	        document.add(new Paragraph("Card Number: " + cardNumber,utf8Font));
	        document.add(new Paragraph("Client: " + client.getName()+" "+client.getSurname(),utf8Font));
	        if(client.getDocument() instanceof Passport)
	        {
	        	document.add(new Paragraph("Passport ID: " + ((Passport)client.getDocument()).getPassportNumber(),utf8Font));
	        }else {
	        document.add(new Paragraph("ID: " + client.getDocument().getNumber(),utf8Font));
	        }
	        if(rental.getVehicle() instanceof Car)
	        {
	        	document.add(new Paragraph("Licence Number: " + rental.getLicenceNumber(),utf8Font));
	        }
	        document.add(new Paragraph("\nThank you for choosing our services!",utf8Font));

	        document.close(); 
	    } catch (DocumentException e) {
	        throw new IOException("Error generating PDF", e);
	    } finally {
	        out.flush(); 
	        out.close(); 
	    }
	}



	

}
