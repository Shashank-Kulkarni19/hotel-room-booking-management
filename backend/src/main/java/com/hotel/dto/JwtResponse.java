package com.hotel.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * DTO for JWT authentication response
 */
@Data
@NoArgsConstructor
public class JwtResponse {
    
   
	
	public JwtResponse(String token, String type, Long id, String name, String email, String role) {
		super();
		this.token = token;
		this.type = type;
		this.id = id;
		this.name = name;
		this.email = email;
		this.role = role;
	}
	private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private String role;
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
}

