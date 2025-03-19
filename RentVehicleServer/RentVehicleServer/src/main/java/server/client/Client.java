package server.client;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import server.account.Account;

@Entity
@Table(name="client")
@PrimaryKeyJoinColumn(name = "id")
public class Client extends Account{

	
	@Column(name="email")
	private String email;
	
	@Column(name="phone")
	private String phone;
	
	@Lob
    @Column(name="image",columnDefinition = "MEDIUMBLOB")
    private byte[] image;
	
	@Column(name="document_id")
	private Integer documentId;

	@Column(name="blocked")
	private Boolean blocked;



	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public byte[] getImage() {
		return image;
	}

	public void setImage(byte[] image) {
		this.image = image;
	}

	public Integer getDocumentId() {
		return documentId;
	}

	public void setDocumentId(Integer documentId) {
		this.documentId = documentId;
	}

	public Boolean getBlocked() {
		return blocked;
	}

	public void setBlocked(Boolean blocked) {
		this.blocked = blocked;
	}
	
	
	
	

}
