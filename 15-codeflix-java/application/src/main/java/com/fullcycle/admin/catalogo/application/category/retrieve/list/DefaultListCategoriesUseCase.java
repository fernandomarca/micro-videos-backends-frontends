package com.fullcycle.admin.catalogo.application.category.retrieve.list;

import java.util.Objects;

import com.fullcycle.admin.catalogo.domain.category.CategoryGateway;
import com.fullcycle.admin.catalogo.domain.category.CategorySearchQuery;
import com.fullcycle.admin.catalogo.domain.pagination.Pagination;

public class DefaultListCategoriesUseCase extends ListCategoriesUseCase {

  private final CategoryGateway categoryGateway;

  public DefaultListCategoriesUseCase(final CategoryGateway categoryGateway) {
    this.categoryGateway = Objects.requireNonNull(categoryGateway);
  }

  @Override
  public Pagination<CategoryListOutput> execute(final CategorySearchQuery aQuery) {
    return this.categoryGateway.findAll(aQuery).map(CategoryListOutput::from);
  }

}
