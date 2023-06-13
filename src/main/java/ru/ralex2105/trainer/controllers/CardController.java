package ru.ralex2105.trainer.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ralex2105.trainer.models.Card;
import ru.ralex2105.trainer.services.CardsService;
import ru.ralex2105.trainer.exceptions.ValidationException;
import ru.ralex2105.trainer.image.ImageUtil;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/cards")
public class CardController {
    @Autowired
    private CardsService cardsService;

    @GetMapping
    public ResponseEntity<?> getCards() {
        final List<Card> cards = cardsService.readAll();
        if (cards == null || cards.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        cards.forEach(task -> ImageUtil.decompressImage(task.getImage()));
        return new ResponseEntity<>(cards, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> read(@PathVariable(name = "id") int id) {
        final Card obj = cardsService.read(id);

        if (obj != null) {
            ImageUtil.decompressImage(obj.getImage());
            return new ResponseEntity<>(obj, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @PostMapping
    public ResponseEntity<?> create(@RequestBody Card card) throws IOException {
        try {
            cardsService.create(card);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (ValidationException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getReason());
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable(name = "id") int id, @RequestBody Card card) {
        final boolean updated = cardsService.update(card, id);

        return updated
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") int id) {
        final boolean deleted = cardsService.delete(id);

        return deleted
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }
}
