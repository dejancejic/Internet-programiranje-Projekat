package server.rent;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name="rent")
public class Rent {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id")
	private Integer id;
	
	@Column(name="date_time")
	private LocalDateTime dateTime;
	
	@Column(name="taken_x")
	private String takenX;
	
	@Column(name="taken_y")
	private String takenY;
	
	@Column(name="left_x")
	private String leftX;
	
	@Column(name="left_y")
	private String leftY;
	
	@Column(name="duration")
	private LocalDateTime duration;
	
	@Column(name="vehicle_id")
	private Integer vehicleId;
	
	
	@Column(name="client_id")
	private Integer clientId;
	
	@Transient
	private String clientName;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public LocalDateTime getDateTime() {
		return dateTime;
	}

	public void setDateTime(LocalDateTime dateTime) {
		this.dateTime = dateTime;
	}

	public String getTakenX() {
		return takenX;
	}

	public void setTakenX(String takenX) {
		this.takenX = takenX;
	}

	public String getTakenY() {
		return takenY;
	}

	public void setTakenY(String takenY) {
		this.takenY = takenY;
	}

	public String getLeftX() {
		return leftX;
	}

	public void setLeftX(String leftX) {
		this.leftX = leftX;
	}

	public String getLeftY() {
		return leftY;
	}

	public void setLeftY(String leftY) {
		this.leftY = leftY;
	}

	public LocalDateTime getDuration() {
		return duration;
	}

	public void setDuration(LocalDateTime duration) {
		this.duration = duration;
	}

	public Integer getVehicleId() {
		return vehicleId;
	}

	public void setVehicleId(Integer vehicleId) {
		this.vehicleId = vehicleId;
	}

	public Integer getClientId() {
		return clientId;
	}

	public void setClientId(Integer clientId) {
		this.clientId = clientId;
	}

	public String getClientName() {
		return clientName;
	}

	public void setClientName(String clientName) {
		this.clientName = clientName;
	}
	
	
	

}
