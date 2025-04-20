package dao;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Base64;

import dto.Client;
import dto.Document;
import dto.Passport;

import org.mindrot.jbcrypt.BCrypt;

public class ClientDAO {

	private static ConnectionPool connectionPool = ConnectionPool.getConnectionPool();
	
	private static final String SQL_SELECT_BY_USERNAME_AND_PASSWORD = "SELECT * FROM account WHERE username=?";
	private static final String SQL_SELECT_CLIENT = "SELECT * FROM client WHERE id=? AND blocked=0";
	private static final String SQL_SELECT_CLIENT_PASSWORD = "SELECT password FROM account WHERE id=?";
	private static final String SQL_UPDATE_CLIENT_PASSWORD = "UPDATE account SET password=? WHERE id=?";
	private static final String SQL_SET_CLIENT_BLOCKED = "UPDATE client SET blocked=? WHERE id=?";
	private static final String SQL_CLIENT_DOCUMENT = "SELECT * FROM document WHERE id=?";
	private static final String SQL_CLIENT_PASSPORT = "SELECT * FROM passport WHERE id=?";
	private static final String SQL_INSERT_ACCOUNT = "INSERT INTO account (username, password, name, surname) VALUES (?,?,?,?)";
	private static final String SQL_INSERT_CLIENT = "INSERT INTO client (id, email, phone, image, document_id, blocked) VALUES (?,?,?,?,?,?)";
	private static final String SQL_INSERT_DOCUMENT = "INSERT INTO document (number) VALUES (?)";
	private static final String SQL_INSERT_PASSPORT = "INSERT INTO passport (id,passport_number) VALUES (?,?)";
	
	public static Client selectByUsernameAndPassword(String username, String password){
		Client user = null;
		Connection connection = null;
		ResultSet rs = null;
		Object values[] = {username};
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection,
					SQL_SELECT_BY_USERNAME_AND_PASSWORD, false, values);
			rs = pstmt.executeQuery();
			if (rs.next()){
				
				String passwordToCheck=rs.getString("password");
				
				if(BCrypt.checkpw(password, passwordToCheck))
				{
				user=selectClientById(rs.getInt("id"));
					if(user!=null) {
				user.setUsername(username);
				user.setPassword(passwordToCheck);
				user.setName(rs.getString("name"));
				user.setSurname(rs.getString("surname"));
					}
				}
			}
			
			pstmt.close();
		} catch (SQLException exp) {
			exp.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
		return user;
	}
	
	private static Client selectClientById(Integer id)
	{
		Client client=null;
		Connection connection = null;
		ResultSet rs = null;
		Object values[] = {id};
		
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection,
					SQL_SELECT_CLIENT, false, values);
			rs = pstmt.executeQuery();
			if (rs.next()){
				Document document=selectClientDocument(rs.getInt("document_id"));
				
				client = new Client(rs.getInt("id"), "","","","",
						rs.getString("email"),rs.getString("phone"),null,document);
				
				 Blob blob = rs.getBlob("image");

		            if (blob != null) {
		                try (InputStream inputStream = blob.getBinaryStream()) {
		                    byte[] imageBytes = inputStream.readAllBytes();
		                    
		                    
		                    String base64Image = Base64.getEncoder().encodeToString(imageBytes);
		                    
		                    
		                    client.setImage(base64Image);
		                } catch (IOException ex) {
		                    ex.printStackTrace();
		                }
		            }
			}
			pstmt.close();
		} catch (SQLException exp) {
			exp.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
		
		
		return client;
	}
	
	public static Passport selectClientPassport(Integer id)
	{
		Passport passport=null;
		Connection connection = null;
		ResultSet rs = null;
		Object values[] = {id};
		
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection,
					SQL_CLIENT_PASSPORT, false, values);
			rs = pstmt.executeQuery();
			if (rs.next()){
				passport=new Passport(id,"",rs.getString("passport_number"));
			}
			pstmt.close();
		} catch (SQLException exp) {
			exp.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
		
		
		return passport;
	}
	
	public static Document selectClientDocument(Integer id)
	{
		Document document=null;
		Connection connection = null;
		ResultSet rs = null;
		Object values[] = {id};
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection,
					SQL_CLIENT_DOCUMENT, false, values);
			rs = pstmt.executeQuery();
			if (rs.next()){
				Passport p=selectClientPassport(id);
				if(p!=null) {
				document=p;
				document.setNumber(rs.getString("number"));
				}
				else 
				{
					document=new Document(id,rs.getString("number"));
				}
			}
			pstmt.close();
		} catch (SQLException exp) {
			exp.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
		
		return document;
	}
	
	public static Client insertAccount(Client client) {

		Connection connection = null;
		ResultSet generatedKeys = null;
		String pw=BCrypt.hashpw(client.getPassword(),BCrypt.gensalt());
		Object values[] = { client.getUsername(), pw, client.getName(), client.getSurname()};
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection, SQL_INSERT_ACCOUNT, true, values);
			
			if(!insertDocument(client.getDocument()))
			{
				return null;
			}
			
			pstmt.executeUpdate();
			generatedKeys = pstmt.getGeneratedKeys();
			
			if (generatedKeys.next())
				client.setId(generatedKeys.getInt(1));
			pstmt.close();
			
			if(insertClient(client)==null)
			{
				client=null;
			}
			
		} catch (SQLException e) {
			
			client=null;
		} finally {
			connectionPool.checkIn(connection);
		}
		return client;
	}
	
	
	public static Client insertClient(Client client) {
		Connection connection = null;
		byte[] decodedBytes = Base64.getDecoder().decode(client.getImage());
		
		Object values[] = {client.getId(), client.getEmail(), client.getPhone(), decodedBytes, client.getDocument().getId(),false};
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection, SQL_INSERT_CLIENT, false, values);
			pstmt.executeUpdate();
			
			pstmt.close();
		} catch (SQLException e) {
			
			client=null;
		} finally {
			connectionPool.checkIn(connection);
		}
		return client;
	}
	
	
	public static boolean insertDocument(Document document)
	{
		boolean result = false;
		Connection connection = null;
		ResultSet generatedKeys = null;
		Object values[] = {document.getNumber()};
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection, SQL_INSERT_DOCUMENT, true, values);
			pstmt.executeUpdate();
			generatedKeys = pstmt.getGeneratedKeys();
			if(pstmt.getUpdateCount()>0) {
				result = true;
			}
			if (generatedKeys.next())
				document.setId(generatedKeys.getInt(1));
			
			if(document.getNumber()==null)
			{
				if(!insertPassport((Passport)document))
				{
					return false;
				}	
			
			pstmt.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
		return result;
	}
	
	
	public static boolean insertPassport(Passport passport)
	{
		boolean result = false;
		Connection connection = null;
		
		Object values[] = {passport.getId(),passport.getPassportNumber()};
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection, SQL_INSERT_PASSPORT, false, values);
			pstmt.executeUpdate();
			
			pstmt.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
		return result;
	}
	
	
	public static boolean setClientBlocked(Integer id,boolean status) {
		boolean result=false;
		
		Connection connection = null;
		int num=0;
		if(status==true)
			num=1;
		
		Object values[] = {num,id};
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection, SQL_SET_CLIENT_BLOCKED, false, values);
			pstmt.executeUpdate();
			
			result=true;
			pstmt.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
		return result;
	}
	
	
	
	public static boolean checkOldPassword(Integer id,String oldPassword) {
		boolean result=false;
		
		Connection connection = null;
		ResultSet rs = null;
		Object values[] = {id};
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection, SQL_SELECT_CLIENT_PASSWORD, false, values);
			rs = pstmt.executeQuery();
			String password="";
			
			if (rs.next()) { 
	            password = rs.getString("password");
	        }
			if(BCrypt.checkpw(oldPassword, password)) {
	
			result=true;
			}
			pstmt.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
		return result;
	}
	
	
	public static boolean setClientPassword(Client client,String newPassword) {
		boolean result=false;
		
		Connection connection = null;
		String pw=BCrypt.hashpw(newPassword,BCrypt.gensalt());
		
		Object values[] = {pw,client.getId()};
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection, SQL_UPDATE_CLIENT_PASSWORD, false, values);
			pstmt.executeUpdate();
			
			result=true;
			client.setPassword(pw);
			pstmt.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
		return result;
	}
	
	
	

}
