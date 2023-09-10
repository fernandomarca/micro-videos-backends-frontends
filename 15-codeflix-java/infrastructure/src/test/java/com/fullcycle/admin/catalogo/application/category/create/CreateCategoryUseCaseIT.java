package com.fullcycle.admin.catalogo.application.category.create;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.SpyBean;

import com.fullcycle.admin.catalogo.IntegrationTest;
import com.fullcycle.admin.catalogo.domain.category.CategoryGateway;
import com.fullcycle.admin.catalogo.infrastructure.category.persistence.CategoryRepository;

@IntegrationTest
public class CreateCategoryUseCaseIT {

  @Autowired
  private CreateCategoryUseCase useCase;

  @Autowired
  private CategoryRepository categoryRepository;

  @SpyBean
  private CategoryGateway categoryGateway;

  @Test
  public void givenAValidCommand_whenCallsCreateCategory_shouldReturnCategoryId() {
    final var expectedName = "Filmes";
    final var expectedDescription = "A categoria mais assistida";
    final var expectedIsActive = true;

    Assertions.assertEquals(0, categoryRepository.count());

    final var aCommand = CreateCategoryCommand.with(expectedName, expectedDescription, expectedIsActive);

    final var actualOutput = useCase.execute(aCommand).get();

    Assertions.assertNotNull(actualOutput);
    Assertions.assertNotNull(actualOutput.id());

    Assertions.assertEquals(1, categoryRepository.count());

    final var actualCategory = categoryRepository.findById(actualOutput.id().getValue()).get();

    Assertions.assertEquals(expectedName, actualCategory.getName());
    Assertions.assertEquals(expectedDescription, actualCategory.getDescription());
    Assertions.assertEquals(expectedIsActive, actualCategory.isActive());
    Assertions.assertNotNull(actualCategory.getCreatedAt());
    Assertions.assertNotNull(actualCategory.getUpdatedAt());
    Assertions.assertNotNull(actualCategory.getDeletedAt());
  }

  @Test
  public void givenAInvalidName_whenCallsCreateCategory_thenShouldReturnDomainException() {
    final String expectedName = null;
    final var expectedDescription = "A categoria mais assistida";
    final var expectedIsActive = true;
    final var expectedErrorMessage = "'name' should not be null";
    final var expectedErrorCount = 1;

    final var aCommand = CreateCategoryCommand.with(
        expectedName,
        expectedDescription,
        expectedIsActive);

    Assertions.assertEquals(0, categoryRepository.count());

    final var notification = useCase.execute(aCommand).getLeft();

    Assertions.assertEquals(expectedErrorMessage, notification.firstError().message());
    Assertions.assertEquals(expectedErrorCount, notification.getErrors().size());

    Assertions.assertEquals(0, categoryRepository.count());

    Mockito.verify(categoryGateway, times(0)).create(any());
  }

  @Test
  public void givenAInvalidCommandWithInactiveCategory_whenCallsCreateCategory_shouldReturnInactiveCategoryId() {
    final String expectedName = "Test name";
    final var expectedDescription = "A categoria mais assistida";
    final var expectedIsActive = false;

    final var aCommand = CreateCategoryCommand.with(
        expectedName,
        expectedDescription,
        expectedIsActive);

    Assertions.assertEquals(0, categoryRepository.count());

    final var actualOutput = useCase.execute(aCommand).get();

    Assertions.assertNotNull(actualOutput);
    Assertions.assertNotNull(actualOutput.id());

    Assertions.assertEquals(1, categoryRepository.count());

    final var actualCategory = categoryRepository.findById(actualOutput.id().getValue()).get();

    Assertions.assertEquals(expectedName, actualCategory.getName());
    Assertions.assertEquals(expectedDescription, actualCategory.getDescription());
    Assertions.assertEquals(expectedIsActive, actualCategory.isActive());
    Assertions.assertNotNull(actualCategory.getCreatedAt());
    Assertions.assertNotNull(actualCategory.getUpdatedAt());
    Assertions.assertNotNull(actualCategory.getDeletedAt());

  }

  @Test
  public void givenAValidCommand_whenGatewayThrowsRandomException_shouldReturnAException() {
    final String expectedName = "Test name";
    final var expectedDescription = "A categoria mais assistida";
    final var expectedIsActive = true;
    final var expectedErrorMessage = "Gateway error";
    final var expectedErrorCount = 1;

    final var aCommand = CreateCategoryCommand.with(
        expectedName,
        expectedDescription,
        expectedIsActive);

    Mockito.doThrow(new IllegalStateException(expectedErrorMessage)).when(categoryGateway).create(any());

    // when(categoryGateway.create(any()))
    // .thenThrow(new IllegalStateException(expectedErrorMessage));

    final var notification = useCase.execute(aCommand).getLeft();

    Assertions.assertEquals(expectedErrorMessage,
        notification.firstError().message());
    Assertions.assertEquals(expectedErrorCount, notification.getErrors().size());

  }
}