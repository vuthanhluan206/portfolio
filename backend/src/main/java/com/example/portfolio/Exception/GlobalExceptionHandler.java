package com.example.portfolio.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.portfolio.dto.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        // Log brief error message for debugging purposes
        log.warn("Runtime exception encountered: {}", ex.getMessage());
        
        ErrorResponse errorResponse = new ErrorResponse(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
        // Log full stack trace for internal server errors
        log.error("Unhandled exception occurred: ", ex);
        
        ErrorResponse errorResponse = new ErrorResponse("Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
