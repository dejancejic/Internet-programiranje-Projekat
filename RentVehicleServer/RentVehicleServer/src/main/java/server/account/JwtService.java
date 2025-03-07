package server.account;

import java.time.Duration;
import java.util.Date;
import org.springframework.http.ResponseCookie;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	@Value("${SECRET_KEY}")
	private  String SECRET_KEY;
	
	@Value("${EXPIRY_DAYS}")
	private int EXPIRY_DAYS=10;
	public String getUsernameFromToken(String token)
	{
		String mail=extractUsername(token);
		return mail;
	}
	public String extractUsername(String token)
	{
		return extractClaim(token,Claims::getSubject);
	}
	
	public boolean isValid(String token,Account client)
	{
		String username=extractUsername(token);
		return username.equals(client.getUsername()) && !isTokenExpired(token);
	}
	
	private boolean isTokenExpired(String token)
	{
		return extractExpiration(token).before(new Date());
	}
	
	
	private Date extractExpiration(String token) {
		
		return extractClaim(token, Claims::getExpiration);
	}

	public <T> T extractClaim(String token,Function<Claims, T> resolver)
	{
		Claims claims=extractAllClaims(token);
		return resolver.apply(claims);
	}
	
	
	private Claims extractAllClaims(String token)
	{
		return Jwts.
				parser().
				verifyWith(getSigningKey()).
				build().
				parseSignedClaims(token).
				getPayload();
	}
	
	public String generateToken(Account client)
	{
		String token=Jwts.
				builder().
				subject(client.getUsername()).
				issuedAt(new Date(System.currentTimeMillis())).
				expiration(new Date(System.currentTimeMillis()+24*EXPIRY_DAYS*60*60*1000)).
				signWith(getSigningKey()).
				compact();
		
		return token;
	}
	
	private SecretKey getSigningKey()
	{
		byte[] keyBytes=Decoders.BASE64.decode(SECRET_KEY);
		
		return Keys.hmacShaKeyFor(keyBytes);
	}
	
	
	
	public ResponseCookie setTokenCookie(String jwtToken,boolean invalidate)
	{
		ResponseCookie cookie=ResponseCookie.from("jwt",jwtToken)
				.httpOnly(false)
				.secure(true).
				maxAge(invalidate?Duration.ZERO:Duration.ofSeconds(EXPIRY_DAYS*86400)).
				sameSite("None").
				domain("localhost").
				path("/").build();
		
		return cookie;
	}
	
	
}
