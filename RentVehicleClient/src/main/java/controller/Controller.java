package controller;

import java.io.IOException;
import java.nio.file.Paths;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import beans.ClientBean;
import dto.Client;
import dto.Document;
import dto.Passport;



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
		else if(action.equals("scooter"))
		{
			address = "/WEB-INF/pages/scooter.jsp";
		}
		else if(action.equals("bike"))
		{
			address = "/WEB-INF/pages/bike.jsp";	
		}
		else if(action.equals("car"))
		{
			address = "/WEB-INF/pages/car.jsp";
		}
		else if(action.equals("profile"))
		{
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

}
