package com.fullcycle.admin.catalogo.infrastructure.category.persistence;

import org.hibernate.PropertyValueException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

import com.fullcycle.admin.catalogo.MySQLGatewayTest;
import com.fullcycle.admin.catalogo.domain.category.Category;

@MySQLGatewayTest
public class CategoryRepositoryTest {

  @Autowired
  private CategoryRepository categoryRepository;

  @Test
  void givenAnInvalidNullName_whenCallsSave_shouldReturnError() {
    final var expectedPropertyName = "name";
    final var expectedMessage = "not-null property references a null or transient value : com.fullcycle.admin.catalogo.infrastructure.category.persistence.CategoryJpaEntity.name";
    final var expectedName = "Filmes";
    final var expectedDescription = "A categoria mais assistida";
    final var expectedIsActive = true;

    final var aCategory = Category.newCategory(expectedName, expectedDescription, expectedIsActive);

    final var anEntity = CategoryJpaEntity.from(aCategory);
    anEntity.setName(null);

    final var actualException = Assertions.assertThrows(DataIntegrityViolationException.class,
        () -> categoryRepository.save(anEntity));

    final var actualCause = Assertions.assertInstanceOf(PropertyValueException.class, actualException.getCause());

    Assertions.assertEquals(expectedPropertyName, actualCause.getPropertyName());
    Assertions.assertEquals(expectedMessage, actualCause.getMessage());
  }

  @Test
  void givenAnInvalidNullCreatedAt_whenCallsSave_shouldReturnError() {
    final var expectedPropertyName = "createdAt";
    final var expectedMessage = "not-null property references a null or transient value : com.fullcycle.admin.catalogo.infrastructure.category.persistence.CategoryJpaEntity.createdAt";
    final var expectedName = "Filmes";
    final var expectedDescription = "A categoria mais assistida";
    final var expectedIsActive = true;

    final var aCategory = Category.newCategory(expectedName, expectedDescription, expectedIsActive);

    final var anEntity = CategoryJpaEntity.from(aCategory);
    anEntity.setCreatedAt(null);

    final var actualException = Assertions.assertThrows(DataIntegrityViolationException.class,
        () -> categoryRepository.save(anEntity));

    final var actualCause = Assertions.assertInstanceOf(PropertyValueException.class, actualException.getCause());

    Assertions.assertEquals(expectedPropertyName, actualCause.getPropertyName());
    Assertions.assertEquals(expectedMessage, actualCause.getMessage());
  }

  @Test
  void givenAnInvalidNullUpdatedAt_whenCallsSave_shouldReturnError() {
    final var expectedPropertyName = "updatedAt";
    final var expectedMessage = "not-null property references a null or transient value : com.fullcycle.admin.catalogo.infrastructure.category.persistence.CategoryJpaEntity.updatedAt";
    final var expectedName = "Filmes";
    final var expectedDescription = "A categoria mais assistida";
    final var expectedIsActive = true;

    final var aCategory = Category.newCategory(expectedName, expectedDescription, expectedIsActive);

    final var anEntity = CategoryJpaEntity.from(aCategory);
    anEntity.setUpdatedAt(null);

    final var actualException = Assertions.assertThrows(DataIntegrityViolationException.class,
        () -> categoryRepository.save(anEntity));

    final var actualCause = Assertions.assertInstanceOf(PropertyValueException.class, actualException.getCause());

    Assertions.assertEquals(expectedPropertyName, actualCause.getPropertyName());
    Assertions.assertEquals(expectedMessage, actualCause.getMessage());
  }

}
