package com.example.portfolio;

import com.example.portfolio.Controller.ContactController;
import com.example.portfolio.dto.ContactMessage;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import java.util.Locale;
import java.util.Properties;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@SpringBootTest
class PortfolioApplicationTests {
    @Test
    void contextLoads() {
    }

    @Test
    void sendsUtf8ContactMessageToConfiguredRecipient() throws Exception {
        JavaMailSender mailSender = mock(JavaMailSender.class);
        ContactController controller = new ContactController(
                mailSender,
                "vuthanhluan4326@gmail.com",
                "vuthanhluan4326@gmail.com");

        controller.send(new ContactMessage(
                "Vũ Thành Luân",
                "lvu31908@gmail.com",
                "xin chào",
                ""));

        var email = org.mockito.ArgumentCaptor.forClass(MimeMessagePreparator.class);
        verify(mailSender).send(email.capture());

        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        email.getValue().prepare(mimeMessage);
        mimeMessage.saveChanges();

        assertEquals("vuthanhluan4326@gmail.com", mimeMessage.getAllRecipients()[0].toString());
        assertEquals("lvu31908@gmail.com", mimeMessage.getReplyTo()[0].toString());
        assertTrue(mimeMessage.getContentType().toLowerCase(Locale.ROOT).contains("charset=utf-8"));
        assertTrue(mimeMessage.getContent().toString().contains("Vũ Thành Luân"));
        assertTrue(mimeMessage.getContent().toString().contains("xin chào"));
    }
}
