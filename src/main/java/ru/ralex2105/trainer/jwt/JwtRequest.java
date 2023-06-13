package ru.ralex2105.trainer.jwt;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import ru.ralex2105.trainer.models.User;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
public class JwtRequest implements Serializable {

    private String email;
    private String password;

    public static JwtRequest valueOf(User user) {
        return new JwtRequest(user.getEmail(), user.getPassword());
    }
}