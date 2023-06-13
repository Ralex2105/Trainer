package ru.ralex2105.trainer.services;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.security.auth.message.AuthException;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import ru.ralex2105.trainer.jwt.JwtAuthentication;
import ru.ralex2105.trainer.jwt.JwtRequest;
import ru.ralex2105.trainer.jwt.JwtResponse;
import ru.ralex2105.trainer.models.JwtToken;
import ru.ralex2105.trainer.models.User;
import ru.ralex2105.trainer.providers.JwtProvider;
import ru.ralex2105.trainer.repository.JwtRepository;
import ru.shoichi.trainer.models.*;

import javax.crypto.SecretKey;

@Slf4j
@Component
public final class AuthService {

    @Autowired
    private UserService service;
    @Autowired
    private JwtProvider jwtProvider;

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private JwtRepository jwtRepository;

    @Autowired
    @Lazy
    public void setPasswordEncoder(BCryptPasswordEncoder passwordEncoder) {
        bCryptPasswordEncoder = passwordEncoder;
    }

    private final SecretKey jwtSecret;

    public AuthService(@Value("${jwt.secret}") String secret) {
        this.jwtSecret = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public JwtResponse login(@NonNull JwtRequest authRequest) throws AuthException {
        final User user = service.findByEmail(authRequest.getEmail());
        if (user == null) {
            throw new AuthException("Пользователь с такой почтой не найден");
        }
        if (bCryptPasswordEncoder.matches(authRequest.getPassword(), user.getPassword()) ||
                authRequest.getPassword().equals(user.getPassword())) {
            final String accessToken = jwtProvider.generateAccessToken(user);
            final String refreshToken = jwtProvider.generateRefreshToken(user);
            JwtToken token = jwtRepository.findByEmail(user.getEmail());
            if (token != null) {
                token.setName(refreshToken);
                jwtRepository.save(token);
            } else {
                jwtRepository.save(new JwtToken(-1, user.getEmail(), refreshToken));
            }
            return new JwtResponse(accessToken, refreshToken, user);
        } else {
            throw new AuthException("Неправильный пароль");
        }
    }

    public JwtResponse getAccessToken(@NonNull String refreshToken) throws AuthException {
        if (jwtProvider.validateRefreshToken(refreshToken)) {
            final Claims claims = jwtProvider.getRefreshClaims(refreshToken);
            final String email = claims.getSubject();
            JwtToken token = jwtRepository.findByEmail(email);
            if (token == null) {
                throw new AuthException("На такого пользователя токен не зарегестрирован");
            }
            final String saveRefreshToken = token.getName();
            if (saveRefreshToken != null && saveRefreshToken.equals(refreshToken)) {
                final User user = service.findByEmail(email);
                if (user == null) {
                    throw new AuthException("Пользователь не найден");
                }
                final String accessToken = jwtProvider.generateAccessToken(user);
                return new JwtResponse(accessToken, null, null);
            }
        }
        return new JwtResponse(null, null, null);
    }

    public JwtResponse refresh(@NonNull String refreshToken) throws AuthException {
        if (jwtProvider.validateRefreshToken(refreshToken)) {
            final Claims claims = jwtProvider.getRefreshClaims(refreshToken);
            final String email = claims.getSubject();
            final String saveRefreshToken = jwtRepository.findByEmail(email).getName();
            if (saveRefreshToken != null && saveRefreshToken.equals(refreshToken)) {
                final User user = service.findByEmail(email);
                if (user == null) {
                    throw new AuthException("Пользователь не найден");
                }
                final String accessToken = jwtProvider.generateAccessToken(user);
                final String newRefreshToken = jwtProvider.generateRefreshToken(user);
                JwtToken token = jwtRepository.findByEmail(email);
                token.setName(newRefreshToken);
                jwtRepository.save(token);
                return new JwtResponse(accessToken, newRefreshToken, user);
            }
        }
        throw new AuthException("Невалидный JWT токен");
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(jwtSecret)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException expEx) {
            log.error("Token expired", expEx);
        } catch (UnsupportedJwtException unsEx) {
            log.error("Unsupported jwt", unsEx);
        } catch (MalformedJwtException mjEx) {
            log.error("Malformed jwt", mjEx);
        } catch (SignatureException sEx) {
            log.error("Invalid signature", sEx);
        } catch (Exception e) {
            log.error("invalid token", e);
        }
        return false;
    }

    public Claims getClaims(@NonNull String token) {
        return Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public JwtAuthentication getAuthentication() {
        return (JwtAuthentication) SecurityContextHolder.getContext().getAuthentication();
    }

}