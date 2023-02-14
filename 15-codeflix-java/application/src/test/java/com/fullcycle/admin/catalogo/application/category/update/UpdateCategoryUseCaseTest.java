package com.fullcycle.admin.catalogo.application.category.update;

import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.util.Objects;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.fullcycle.admin.catalogo.domain.category.Category;
import com.fullcycle.admin.catalogo.domain.category.CategoryGateway;

@ExtendWith(MockitoExtension.class)
public class UpdateCategoryUseCaseTest {

  @InjectMocks
  private DefaultUpdateCategoryUseCase useCase;

  @Mock
  private CategoryGateway categoryGateway;

  @Test
  public void givenAValidCommand_whenCallsUpdateCategory_shouldReturnCategoryId() {
    final var aCategory = Category.newCategory("Film", null, true);

    final var expectedName = "Filmes";
    final var expectedDescription = "category more watch";
    final var expectedIsActive = true;

    final var expectedId = aCategory.getId();

    final var aCommand = UpdateCategoryCommand.with(
        expectedId.getValue(),
        expectedName,
        expectedDescription,
        expectedIsActive);

    when(categoryGateway.findById(eq(expectedId)))
        .thenReturn(Optional.of(aCategory.clone()));

    when(categoryGateway.update(any())).thenAnswer(returnsFirstArg());

    final var actualOutput = useCase.execute(aCommand).get();

    Assertions.assertNotNull(actualOutput);
    Assertions.assertNotNull(actualOutput.id());

    Mockito.verify(categoryGateway, times(1)).findById(expectedId);

    Mockito.verify(categoryGateway, times(1))
        .update(argThat(aUpdatedCategory -> Objects.equals(expectedName, aUpdatedCategory.getName())
            && Objects.equals(expectedDescription, aUpdatedCategory.getDescription())
            && Objects.equals(expectedIsActive, aUpdatedCategory.isActive())
            && Objects.equals(expectedId, aUpdatedCategory.getId())
            && Objects.equals(aCategory.getCreatedAt(), aUpdatedCategory.getCreatedAt())
            && aCategory.getUpdatedAt().isBefore(aUpdatedCategory.getUpdatedAt())
            && Objects.isNull(aUpdatedCategory.getDeletedAt())));
  }
}
