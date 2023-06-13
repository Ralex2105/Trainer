package ru.ralex2105.trainer.services;

import org.springframework.stereotype.Service;
import ru.ralex2105.trainer.repository.CategoryRepository;
import ru.ralex2105.trainer.models.Category;

@Service
public class CategoryService extends DBService<Category, CategoryRepository> {
    @Override
    public boolean update(Category obj, int id) {
        final boolean updated = super.update(obj, id);
        if (updated)
        {
            obj.setId(id);
            repository.save(obj);
        }
        return updated;
    }
}
