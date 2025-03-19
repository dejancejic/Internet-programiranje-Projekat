package server.account;

import java.io.IOException;
import jakarta.servlet.http.Cookie;
import java.util.Collection;
import java.util.Optional;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import server.client.Client;
import server.client.ClientRepository;
import org.springframework.http.HttpHeaders;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter{


	private final JwtService jwtservice;
	private final AccountDetailsServiceImpl userDetailsService;
	private final AccountRepository rpAccount; 
	private final ClientRepository rpClient;
	
	public JwtAuthenticationFilter(JwtService jwtservice,AccountDetailsServiceImpl userDetails,AccountRepository rpAccount,
			ClientRepository rpClient) {
		this.jwtservice = jwtservice;
		this.userDetailsService=userDetails;
		this.rpAccount=rpAccount;
		this.rpClient=rpClient;
	}
	
	@Override
	protected void doFilterInternal(@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response, 
			@NonNull FilterChain filterChain)
			throws ServletException, IOException {
		
		
		String username=null;
		String  token=getJwtFromRequest(request);
		if(token!=null)
		{
			username=jwtservice.extractUsername(token);
		}
		
		
		if(username!=null && SecurityContextHolder.getContext().getAuthentication()==null)
		{
			Account u =rpAccount.findByusername(username).get();
			
			Optional<Client> cl=rpClient.findById(u.getId());
			
			
			
			if(cl.isPresent() && cl.get().getBlocked()==true)
			{
				response.setHeader(HttpHeaders.SET_COOKIE, jwtservice.setTokenCookie(token, true).toString());
				filterChain.doFilter(request, response);
				return;
			}
			
			UserDetails userDetails=userDetailsService.loadUserByUsername(username);
			
			if(jwtservice.isValid(token, (Account) userDetails)) {
			UsernamePasswordAuthenticationToken authToken=
					new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
			
			
			authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
			
			SecurityContextHolder.getContext().setAuthentication(authToken);
			
		
			}
		}
		filterChain.doFilter(request, response);
	}
	
	
	public String getJwtFromRequest(HttpServletRequest request)
	{
		Cookie[] cookies=request.getCookies();

		if(cookies!=null)
		{
			for(Cookie cookie:cookies)
			{
				if("jwt".equals(cookie.getName()))
				{
					return cookie.getValue();
				}
			}
				
		}
		return null;
	}
	
	

}
