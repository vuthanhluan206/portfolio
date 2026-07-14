package com.example.portfolio;

// Exception riêng để phân biệt lỗi upload ảnh với các lỗi khác trong hệ thống
public class ImageUploadException extends RuntimeException {
    public ImageUploadException(String message, Throwable cause) {
        super(message, cause);
    }

    public ImageUploadException(String message) {
        super(message);
    }
}
