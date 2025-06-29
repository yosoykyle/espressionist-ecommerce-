package com.espressionist_ecommerce.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
// Purpose: Service for sending email notifications, such as order confirmations.
@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender; // Injecting JavaMailSender to handle email sending

    public void sendOrderConfirmation(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage(); // Creating a new SimpleMailMessage object
        message.setTo(to); // Setting the recipient's email address
        message.setSubject(subject); // Setting the email subject
        message.setText(text); // Setting the email body text
        mailSender.send(message); // Sending the email using the JavaMailSender
    }
}
