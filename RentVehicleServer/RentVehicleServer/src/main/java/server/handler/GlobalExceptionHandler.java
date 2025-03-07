package server.handler;

import org.hibernate.TransactionException;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import server.exceptions.AccessDeniedException;
import server.exceptions.UserNotFoundException;
import server.exceptions.VehicleNotFoundException;



@ControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDeniedException(AccessDeniedException e) {
		
        return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
    }
	@ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException e) {
	
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }
	
	@ExceptionHandler(VehicleNotFoundException.class)
    public ResponseEntity<String> handleVehicleNotFoundException(VehicleNotFoundException e) {
	
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }

}

