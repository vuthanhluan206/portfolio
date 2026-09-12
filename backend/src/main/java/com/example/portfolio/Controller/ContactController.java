package com.example.portfolio.Controller;

import com.example.portfolio.dto.ContactMessage;
import jakarta.validation.Valid;
import java.nio.charset.StandardCharsets;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    private final JavaMailSender mailSender;
    private final String sender;
    private final String recipient;

    public ContactController(
            JavaMailSender mailSender,
            @Value("${spring.mail.username}") String sender,
            @Value("${portfolio.contact.recipient}") String recipient) {
        this.mailSender = mailSender;
        this.sender = sender;
        this.recipient = recipient;
    }

    @PostMapping
    public ResponseEntity<Void> send(@Valid @RequestBody ContactMessage contact) {
        mailSender.send(mimeMessage -> {
            MimeMessageHelper email = new MimeMessageHelper(
                    mimeMessage,
                    false,
                    StandardCharsets.UTF_8.name());
            email.setFrom(sender);
            email.setTo(recipient);
            email.setReplyTo(contact.email().trim());
            email.setSubject("New message from portfolio");
            email.setText("Name: " + contact.name().trim()
                    + "\nEmail: " + contact.email().trim()
                    + "\n\nMessage:\n" + contact.message().trim());
        });

        return ResponseEntity.noContent().build();
    }
}
