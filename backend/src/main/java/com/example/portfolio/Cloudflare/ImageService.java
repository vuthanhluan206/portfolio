package com.example.portfolio.Cloudflare;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.portfolio.ImageUploadException;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final S3Client s3Client;

    @Value("${cloudflare.r2.bucket}")
    private String bucket;

    @Value("${cloudflare.r2.public-url}")
    private String publicUrl;

    // Danh sách định dạng ảnh cho phép
    private static final List<String> ALLOWED_TYPES = List.of("image/jpeg", "image/png", "image/webp");

    // Giới hạn dung lượng file: 10MB
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    public String uploadImage(MultipartFile file) {
        // kiểm tra file rỗng
        if (file == null || file.isEmpty()) {
            throw new ImageUploadException("file ảnh không được bỏ trống");
        }
        // kiểm tra định dạng file
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new ImageUploadException("file ảnh không đúng định dạng");
        }
        // kiểm tra dung lượng file
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ImageUploadException("file ảnh quá 10Mb");
        }
        // tạo tên file duy nhất tránh trùng lặp
        String extension = getFileExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + extension;
        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(fileName)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));

            return publicUrl + "/" + fileName;

        } catch (Exception e) {
            System.err.println("Lỗi upload ảnh chi tiết:");
            e.printStackTrace();
            throw new ImageUploadException("Tải ảnh lên thất bại, vui lòng thử lại: " + e.getMessage());
        }
    }

    private String getFileExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            return "";
        }
        return originalFilename.substring(originalFilename.lastIndexOf("."));
    }
}
