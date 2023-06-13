package ru.ralex2105.trainer.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class SQLServerException extends ResponseStatusException {
    public SQLServerException(HttpStatus status, String reason) {
        super(status, reason);
    }
}
