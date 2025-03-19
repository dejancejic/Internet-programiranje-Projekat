package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import dto.Client;
import dto.Document;
import dto.Passport;

import org.mindrot.jbcrypt.BCrypt;

public class ClientDAO {

	private static ConnectionPool connectionPool = ConnectionPool.getConnectionPool();
	
	private static final String SQL_SELECT_BY_USERNAME_AND_PASSWORD = "SELECT * FROM account WHERE username=?";
	private static final String SQL_SELECT_CLIENT = "SELECT * FROM client WHERE id=?";
	private static final String SQL_CLIENT_DOCUMENT = "SELECT * FROM document WHERE id=?";
	private static final String SQL_CLIENT_PASSPORT = "SELECT * FROM passport WHERE id=?";
	private static final String SQL_INSERT_ACCOUNT = "INSERT INTO account (username, password, name, surname) VALUES (?,?,?,?)";
	private static final String SQL_INSERT_CLIENT = "INSERT INTO client (id, email, phone, image, document_id, blocked) VALUES (?,?,?,?,?,?)";
	
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
				user.setUsername(username);
				user.setPassword(passwordToCheck);
				user.setName(rs.getString("name"));
				user.setSurname(rs.getString("surname"));
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
						rs.getString("email"),rs.getString("phone"),rs.getString("image"),document);
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
	
	public static boolean insertAccount(Client client) {
		boolean result = false;
		Connection connection = null;
		ResultSet generatedKeys = null;
		Object values[] = { client.getUsername(), client.getPassword(), client.getName(), client.getSurname()};
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection, SQL_INSERT_ACCOUNT, true, values);
			pstmt.executeUpdate();
			generatedKeys = pstmt.getGeneratedKeys();
			if(pstmt.getUpdateCount()>0) {
				result = true;
			}
			if (generatedKeys.next())
				client.setId(generatedKeys.getInt(1));
			pstmt.close();
			
			insertClient(client);
			
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
		return result;
	}
	
	
	public static boolean insertClient(Client client) {
		boolean result = false;
		Connection connection = null;
		
		Object values[] = {client.getId(), client.getEmail(), client.getPhone(), client.getImage(), client.getDocument().getId(),false};
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection, SQL_INSERT_CLIENT, false, values);
			pstmt.executeUpdate();
			
			pstmt.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
		return result;
	}
	
	
	
	
	
	

}
