package com.fullcycle.admin.catalogo.application.category.retrieve.list;

import static org.mockito.ArgumentMatchers.eq;

import java.util.List;

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
import com.fullcycle.admin.catalogo.domain.category.CategorySearchQuery;
import com.fullcycle.admin.catalogo.domain.pagination.Pagination;

@ExtendWith(MockitoExtension.class)
public class ListCategoriesUseCaseTest {

  @InjectMocks
  private DefaultListCategoriesUseCase useCase;

  @Mock
  private CategoryGateway categoryGateway;

  @BeforeEach
  void cleanUp() {
    Mockito.reset(categoryGateway);
  }

  @Test
  public void givenAValidQuery_whenCallsListCategories_thenShouldReturnAListOfCategories() {

    final var categories = List.of(Category.newCategory("Filmes", null, true),
        Category.newCategory("Series", null, true));

    final var expectedPage = 0;
    final var expectedPerPage = 10;
    final var expectedTerms = "";
    final var expectedSort = "createdAt";
    final var expectedDirection = "asc";

    final var aQuery = new CategorySearchQuery(expectedPage, expectedPerPage, expectedTerms, expectedSort,
        expectedDirection);

    final var expectedPagination = new Pagination<>(expectedPage, expectedPerPage, categories.size(),
        categories);

    final var expectedItemsCount = 2;
    final var expectedResult = expectedPagination.map(CategoryListOutput::from);

    Mockito.when(categoryGateway.findAll(eq(aQuery))).thenReturn(expectedPagination);

    final var actualResult = useCase.execute(aQuery);

    Assertions.assertEquals(expectedItemsCount, actualResult.items().size());
    Assertions.assertEquals(expectedResult, actualResult);
    Assertions.assertEquals(expectedPage, actualResult.currentPage());
    Assertions.assertEquals(expectedPerPage, actualResult.perPage());
    Assertions.assertEquals(categories.size(), actualResult.total());
  }

  @Test
  public void givenAValidQuery_whenHasNoResults_thenShouldReturnEmptyCategories() {
    final var categories = List.<Category>of();

    final var expectedPage = 0;
    final var expectedPerPage = 10;
    final var expectedTerms = "";
    final var expectedSort = "createdAt";
    final var expectedDirection = "asc";

    final var aQuery = new CategorySearchQuery(expectedPage, expectedPerPage, expectedTerms, expectedSort,
        expectedDirection);

    final var expectedPagination = new Pagination<>(expectedPage, expectedPerPage, categories.size(),
        categories);

    final var expectedItemsCount = 0;
    final var expectedResult = expectedPagination.map(CategoryListOutput::from);

    Mockito.when(categoryGateway.findAll(eq(aQuery))).thenReturn(expectedPagination);

    final var actualResult = useCase.execute(aQuery);

    Assertions.assertEquals(expectedItemsCount, actualResult.items().size());
    Assertions.assertEquals(expectedResult, actualResult);
    Assertions.assertEquals(expectedPage, actualResult.currentPage());
    Assertions.assertEquals(expectedPerPage, actualResult.perPage());
    Assertions.assertEquals(categories.size(), actualResult.total());
  }

  @Test
  public void givenAValidQuery_whenGatewayThrowsException_thenShouldThrowException() {
    final var expectedPage = 0;
    final var expectedPerPage = 10;
    final var expectedTerms = "";
    final var expectedSort = "createdAt";
    final var expectedDirection = "asc";
    final var expectedErrorMessage = "Gateway error";

    final var aQuery = new CategorySearchQuery(expectedPage, expectedPerPage, expectedTerms, expectedSort,
        expectedDirection);

    Mockito.when(categoryGateway.findAll(eq(aQuery))).thenThrow(new IllegalStateException(expectedErrorMessage));

    final var actualException = Assertions.assertThrows(IllegalStateException.class, () -> useCase.execute(aQuery));

    Assertions.assertEquals(expectedErrorMessage,actualException.getMessage());
  
  }
}
