package com.fullcycle.admin.catalogo.application.category.delete;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.fullcycle.admin.catalogo.domain.category.Category;
import com.fullcycle.admin.catalogo.domain.category.CategoryGateway;
import com.fullcycle.admin.catalogo.domain.category.CategoryID;

@ExtendWith(MockitoExtension.class)
public class DeleteCategoryUseCaseTest {

  @InjectMocks
  private DefaultDeleteCategoryUseCase useCase;

  @Mock
  private CategoryGateway categoryGateway;

  @BeforeEach
  void cleanUp() {
    Mockito.reset(categoryGateway);
  }

  @Test
  public void givenAValidId_whenCallsDeleteCategory_shouldBeOK() {
    final var aCategory = Category.newCategory("Filmes", "A categoria mais assistida", false);
    final var expectedId = aCategory.getId();

    doNothing().when(categoryGateway).deleteById(expectedId);
    Assertions.assertDoesNotThrow(() -> useCase.execute(expectedId.getValue()));

    Mockito.verify(categoryGateway, Mockito.times(1)).deleteById(expectedId);
  }

  @Test
  public void givenAInValidId_whenCallsDeleteCategory_shouldBeOK() {
    final var expectedId = CategoryID.from("123");

    doNothing().when(categoryGateway).deleteById(expectedId);
    Assertions.assertDoesNotThrow(() -> useCase.execute(expectedId.getValue()));

    Mockito.verify(categoryGateway, Mockito.times(1)).deleteById(expectedId);
  }

  @Test
  public void givenAValidId_whenGatewayThrowsException_shouldReturnException() {
    final var aCategory = Category.newCategory("Filmes", "A categoria mais assistida", false);
    final var expectedId = aCategory.getId();

    doThrow(new IllegalStateException("Gateway error")).when(categoryGateway).deleteById(expectedId);

    Assertions.assertThrows(IllegalStateException.class, () -> useCase.execute(expectedId.getValue()));

    Mockito.verify(categoryGateway, Mockito.times(1)).deleteById(expectedId);
  }

}