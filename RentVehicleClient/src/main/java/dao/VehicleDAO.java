package dao;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;

import dto.Bike;
import dto.Car;
import dto.Scooter;
import dto.Vehicle;

public class VehicleDAO {

	private static ConnectionPool connectionPool = ConnectionPool.getConnectionPool();
	
	private static final String SQL_SELECT_VEHICLE_BY_ID = "SELECT * FROM vehicle WHERE id=? AND status=?";
	private static final String SQL_SELECT_ALL_CARS = "SELECT * FROM car";
	private static final String SQL_SELECT_ALL_BIKES = "SELECT * FROM bike";
	private static final String SQL_SELECT_ALL_SCOOTERS = "SELECT * FROM scooter";
	private static final String SQL_SELECT_CAR = "SELECT * FROM car WHERE id=?";
	private static final String SQL_SELECT_MANUFACTURER = "SELECT * FROM manufacturer WHERE id=?";
	private static final String SQL_SELECT_BIKE = "SELECT * FROM bike WHERE id=?";
	private static final String SQL_SELECT_SCOOTER = "SELECT * FROM scooter WHERE id=?";
	
	
	private static void helperMethod(ArrayList<Vehicle> list,String query)
	{
		Connection connection = null;
		ResultSet rs = null;
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection,
					query, false);
			
			rs = pstmt.executeQuery();

			
			while(rs.next()){
				list.add(selectVehicleById(rs.getInt("id")));
			}
			pstmt.close();
		} catch (SQLException exp) {
			exp.printStackTrace();
		} finally {
			connectionPool.checkIn(connection);
		}
	}
	
	public static ArrayList<Vehicle> getVehicleByType(String type)
	{
		
		ArrayList<Vehicle> list=new ArrayList<Vehicle>();
		
		if(type.equals("car"))
		{
			helperMethod(list, SQL_SELECT_ALL_CARS);
		}
		else if(type.equals("bike"))
		{
			helperMethod(list, SQL_SELECT_ALL_BIKES);
		}
		else 
		{
			helperMethod(list, SQL_SELECT_ALL_SCOOTERS);
		}
		
		return list;
	}
	
	
	public static Vehicle selectVehicleById(Integer id)
	{
		Vehicle veh=null;
		Connection connection = null;
		ResultSet rs = null;
		Object values[] = {id,"free"};
		
		try {
			connection = connectionPool.checkOut();
			PreparedStatement pstmt = DAOUtil.prepareStatement(connection,
					SQL_SELECT_VEHICLE_BY_ID, false, values);
			
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
	

}
