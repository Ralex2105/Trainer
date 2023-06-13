package ru.ralex2105.trainer.controllers;

import jakarta.security.auth.message.AuthException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ralex2105.trainer.jwt.JwtRequest;
import ru.ralex2105.trainer.jwt.JwtResponse;
import ru.ralex2105.trainer.jwt.JwtTokenRequest;
import ru.ralex2105.trainer.models.User;
import ru.ralex2105.trainer.services.AuthService;
import ru.ralex2105.trainer.services.UserService;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService service;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody JwtRequest authRequest) {
        try {
            final JwtResponse token = authService.login(authRequest);
            return ResponseEntity.ok(token);
        } catch (AuthException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<Object> validate(@RequestBody JwtTokenRequest token) {
        try {
            return ResponseEntity.ok(authService.validateToken(token.getToken()));
        } catch (Exception exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }

    @PostMapping("/token")
    public ResponseEntity<Object> getNewAccessToken(@RequestBody JwtTokenRequest request) {
        try {
            final JwtResponse token = authService.getAccessToken(request.getToken());
            return ResponseEntity.ok(token);
        } catch (AuthException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<Object> getNewRefreshToken(@RequestBody JwtTokenRequest request) {
        try {
            final JwtResponse token = authService.refresh(request.getToken());
            return ResponseEntity.ok(token);
        } catch (AuthException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }

    }

    @PostMapping("/registration")
    public ResponseEntity<Object> registration(@RequestBody User answer) {
        try {
            if (!service.create(answer)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Пользователь с такой почтой уже есть");
            }
            final JwtResponse token = authService.login(JwtRequest.valueOf(answer));
            return ResponseEntity.ok(token);
        } catch (AuthException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }
}
