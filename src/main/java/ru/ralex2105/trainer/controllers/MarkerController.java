package ru.ralex2105.trainer.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ralex2105.trainer.services.MarkerService;
import ru.ralex2105.trainer.models.Marker;

import java.util.List;

@RestController
@RequestMapping("/markers")
public class MarkerController {
    @Autowired
    private MarkerService service;

    @GetMapping
    public ResponseEntity<?> getMarkers() {
        final List<Marker> markers = service.readAll();
        return markers != null &&  !markers.isEmpty()
                ? new ResponseEntity<>(markers, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Marker> read(@PathVariable(name = "id") int id) {
        final Marker obj = service.read(id);

        return obj != null
                ? new ResponseEntity<>(obj, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Marker marker) {
        service.create(marker);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable(name = "id") int id, @RequestBody Marker marker) {
        final boolean updated = service.update(marker, id);

        return updated
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") int id) {
        final boolean deleted = service.delete(id);

        return deleted
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }
}
