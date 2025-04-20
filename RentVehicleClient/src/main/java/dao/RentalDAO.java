package dao;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;

import org.mindrot.jbcrypt.BCrypt;

import dto.Bike;
import dto.Car;
import dto.Client;
import dto.Passport;
import dto.Rental;
import dto.Scooter;
import dto.Vehicle;

public class RentalDAO {

	private static ConnectionPool connectionPool = ConnectionPool.getConnectionPool();
	
	private static final String SQL_SELECT_CLIENT_RENTALS = "SELECT * FROM rent WHERE client_id=?";
	private static final String SQL_SELECT_VEHICLE = "SELECT * FROM vehicle WHERE id=?";
	private static final String SQL_SELECT_CAR = "SELECT * FROM car WHERE id=?";
	private static final String SQL_SELECT_BIKE = "SELECT * FROM bike WHERE id=?";
	private static final String SQL_SELECT_SCOOTER = "SELECT * FROM scooter WHERE id=?";
	private static final String SQL_SELECT_MANUFACTURER = "SELECT * FROM manufacturer WHERE id=?";
	private static final String SQL_INSERT_RENTAL = "INSERT INTO rent (date_time,taken_x,taken_y,left_x,left_y,duration,vehicle_id,client_id) VALUES (?,?,?,?,?,?,?,?)";
	private static final String SQL_INSERT_CAR_RENTAL = "INSERT INTO car_rent (id,licence_number,document_id) VALUES (?,?,?)";
	public static ArrayList<Rental> selectClientRentals(Integer id)
	{
		ArrayList<Rental> list=new ArrayList<Rental>();
		Connection connection = null;
		ResultSet rs = null;
		Object values[] = {id};
		
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection,
					SQL_SELECT_CLIENT_RENTALS, false, values);
			
			rs = pstmt.executeQuery();
			while (rs.next()){
				

				
				Vehicle veh=selectVehicleById(rs.getInt("vehicle_id"));
				list.add(new Rental(rs.getInt("id"),rs.getTimestamp("date_time").toLocalDateTime(),
						rs.getString("taken_x"),rs.getString("taken_y"),
						rs.getString("left_x"),rs.getString("left_y"),rs.getTimestamp("duration").toLocalDateTime(),veh));
			}
			pstmt.close();
		} catch (SQLException exp) {
			exp.printStackTrace();
			list=null;
		} finally {
			connectionPool.checkIn(connection);
		}
		
		
		return list;
	}
	
	public static Vehicle selectVehicleById(Integer id)
	{
		Vehicle veh=null;
		Connection connection = null;
		ResultSet rs = null;
		Object values[] = {id};
		
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection,
					SQL_SELECT_VEHICLE, false, values);
			
			rs = pstmt.executeQuery();
			if(rs.next()){
			if((veh=selectCarById(id))!=null)
			{
				veh.setManufacturer(((Car)veh).getManufacturer());
				veh.setModel(((Car)veh).getModel());
			}
			else if((veh=selectBikeById(id))!=null)
			{
				veh.setManufacturer(((Bike)veh).getManufacturer());
				veh.setModel(((Bike)veh).getModel());
			}else if((veh=selectScooterById(id))!=null)
			{	
				veh.setManufacturer(((Scooter)veh).getManufacturer());
				veh.setModel(((Scooter)veh).getModel());
			}
			if(veh!=null) {
			veh.setId(rs.getInt("id"));
			veh.setStatus(rs.getString("status"));
			Blob blob = rs.getBlob("image");

            if (blob != null) {
                try (InputStream inputStream = blob.getBinaryStream()) {
                    byte[] imageBytes = inputStream.readAllBytes();
                    
                    
                    String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                    
                    
                    veh.setImage(base64Image);
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }
			}
			}
			pstmt.close();
		} catch (SQLException exp) {
			exp.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
		
		
		return veh;
	}
	
	
	public static Car selectCarById(Integer id)
	{
		Car veh=null;
		Connection connection = null;
		ResultSet rs = null;
		Object values[] = {id};
		
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection,
					SQL_SELECT_CAR, false, values);
			
			rs = pstmt.executeQuery();
			
			
			if(rs.next()){
				String manufacturer=selectManufacturerById(rs.getInt("manufacturer_id"));
				veh=new Car(manufacturer,rs.getString("model"),rs.getString("car_id"),
						rs.getDate("buy_date").toLocalDate(),rs.getDouble("price"),rs.getString("description"));
			}
			pstmt.close();
		} catch (SQLException exp) {
			exp.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
		
		
		return veh;
	}
	
	
	public static Bike selectBikeById(Integer id)
	{
		Bike veh=null;
		Connection connection = null;
		ResultSet rs = null;
		Object values[] = {id};
		
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection,
					SQL_SELECT_BIKE, false, values);
			
			rs = pstmt.executeQuery();

			
			if(rs.next()){
				String manufacturer=selectManufacturerById(rs.getInt("manufacturer_id"));
				veh=new Bike(manufacturer,rs.getString("model"),rs.getString("bike_id"),
						rs.getDouble("price"),rs.getString("bike_range"));
			}
			pstmt.close();
		} catch (SQLException exp) {
			exp.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
		
		
		return veh;
	}
	
	
	public static Scooter selectScooterById(Integer id)
	{
		Scooter veh=null;
		Connection connection = null;
		ResultSet rs = null;
		Object values[] = {id};
		
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection,
					SQL_SELECT_SCOOTER, false, values);
			
			rs = pstmt.executeQuery();

			
			if(rs.next()){
				String manufacturer=selectManufacturerById(rs.getInt("manufacturer_id"));
				veh=new Scooter(manufacturer,rs.getString("model"),rs.getString("scooter_id"),
						rs.getDouble("price"),rs.getInt("speed"));
			}
			pstmt.close();
		} catch (SQLException exp) {
			exp.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
		
		
		return veh;
	}
	
	
	
	
	
	public static String selectManufacturerById(Integer id)
	{
		String manu=null;
		Connection connection = null;
		ResultSet rs = null;
		Object values[] = {id};
		
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection,
					SQL_SELECT_MANUFACTURER, false, values);
			
			rs = pstmt.executeQuery();
			
			if(rs.next()){
				manu=rs.getString("name");
				
			}
			pstmt.close();
		} catch (SQLException exp) {
			exp.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
		
		
		return manu;
	}
	
	public static Rental insertRental(Rental rental) {

		Connection connection = null;
		ResultSet generatedKeys = null;
		Object values[] = {rental.getDate(),rental.getTakenX(),rental.getTakenY(),
				rental.getLeftX(),rental.getLeftY(),rental.getDuration(),rental.getVehicle().getId(),rental.getClientId()};
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection, SQL_INSERT_RENTAL, true, values);
			
			pstmt.executeUpdate();
			generatedKeys = pstmt.getGeneratedKeys();
			
			if (generatedKeys.next())
				rental.setId(generatedKeys.getInt(1));
			
			pstmt.close();
			
			if(rental.getLicenceNumber()!=null)
			{
				rental=insertCarRental(rental);
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
			rental=null;
		} finally {
			connectionPool.checkIn(connection);
		}
		return rental;
	}
	
	
	public static Rental insertCarRental(Rental rental) {
		Connection connection = null;
		
		Object values[] = {rental.getId(),rental.getLicenceNumber(),rental.getDocumentId()};
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection, SQL_INSERT_CAR_RENTAL, false, values);
			pstmt.executeUpdate();
			
			pstmt.close();
		} catch (SQLException e) {
			e.printStackTrace();
			rental=null;
		} finally {
			connectionPool.checkIn(connection);
		}
		return rental;
	}
	
	
	
}
