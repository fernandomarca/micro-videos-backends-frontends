package com.fullcycle.admin.catalogo.application.category.delete;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;

import java.util.Arrays;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.SpyBean;

import com.fullcycle.admin.catalogo.IntegrationTest;
import com.fullcycle.admin.catalogo.domain.category.Category;
import com.fullcycle.admin.catalogo.domain.category.CategoryGateway;
import com.fullcycle.admin.catalogo.domain.category.CategoryID;
import com.fullcycle.admin.catalogo.infrastructure.category.persistence.CategoryJpaEntity;
import com.fullcycle.admin.catalogo.infrastructure.category.persistence.CategoryRepository;

@IntegrationTest
public class DeleteCategoryUseCaseIT {

  @Autowired
  private DeleteCategoryUseCase useCase;

  @Autowired
  private CategoryRepository categoryRepository;

  @SpyBean
  private CategoryGateway categoryGateway;

  @Test
  public void givenAValidId_whenCallsDeleteCategory_shouldBeOK() {
    final var aCategory = Category.newCategory("Filmes", "A categoria mais assistida", false);
    final var expectedId = aCategory.getId();

    save(aCategory);

    Assertions.assertEquals(1, categoryRepository.count());

    Assertions.assertDoesNotThrow(() -> useCase.execute(expectedId.getValue()));

    Assertions.assertEquals(0, categoryRepository.count());

  }

  @Test
  public void givenAInValidId_whenCallsDeleteCategory_shouldBeOK() {
    final var expectedId = CategoryID.from("123");

    Assertions.assertEquals(0, categoryRepository.count());

    Assertions.assertDoesNotThrow(() -> useCase.execute(expectedId.getValue()));

    Assertions.assertEquals(0, categoryRepository.count());
  }

  @Test
  public void givenAValidId_whenGatewayThrowsException_shouldReturnException() {
    final var aCategory = Category.newCategory("Filmes", "A categoria mais assistida", false);
    final var expectedId = aCategory.getId();

    doThrow(new IllegalStateException("Gateway error")).when(categoryGateway).deleteById(expectedId);

    Assertions.assertThrows(IllegalStateException.class, () -> useCase.execute(expectedId.getValue()));

    Mockito.verify(categoryGateway, Mockito.times(1)).deleteById(expectedId);
  }

  private void save(final Category... aCategory) {
    categoryRepository.saveAllAndFlush(
        Arrays.stream(aCategory)
            .map(CategoryJpaEntity::from)
            .toList());
  }

}
