package ru.ralex2105.trainer.services;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public abstract class DBService<T, Repository extends JpaRepository<T, Integer>> {
    @Autowired
    protected Repository repository;

    public boolean create(T obj) {
        repository.save(obj);
        return true;
    }

    @Transactional
    public List<T> readAll() {
        return repository.findAll();
    }

    public T read(int id) {
        Optional<T> obj = repository.findById(id);
        return obj.orElse(null);
    }

    public boolean update(T obj, int id) {
        return repository.existsById(id);
    }

    public boolean delete(int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
