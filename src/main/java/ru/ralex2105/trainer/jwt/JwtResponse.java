package ru.ralex2105.trainer.jwt;

import lombok.AllArgsConstructor;
import lombok.Data;
import ru.ralex2105.trainer.models.User;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class JwtResponse implements Serializable {

    private final String type = "Bearer";
    private String accessToken;
    private String refreshToken;
    private User user;

}