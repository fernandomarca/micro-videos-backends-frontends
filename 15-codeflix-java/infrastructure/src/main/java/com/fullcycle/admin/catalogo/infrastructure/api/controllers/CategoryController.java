package com.fullcycle.admin.catalogo.infrastructure.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.fullcycle.admin.catalogo.application.category.create.CreateCategoryCommand;
import com.fullcycle.admin.catalogo.application.category.create.CreateCategoryOutput;
import com.fullcycle.admin.catalogo.application.category.create.CreateCategoryUseCase;
import com.fullcycle.admin.catalogo.application.category.delete.DeleteCategoryUseCase;
import com.fullcycle.admin.catalogo.application.category.retrieve.get.GetCategoryByIdUseCase;
import com.fullcycle.admin.catalogo.application.category.retrieve.list.ListCategoriesUseCase;
import com.fullcycle.admin.catalogo.application.category.update.UpdateCategoryCommand;
import com.fullcycle.admin.catalogo.application.category.update.UpdateCategoryOutput;
import com.fullcycle.admin.catalogo.application.category.update.UpdateCategoryUseCase;
import com.fullcycle.admin.catalogo.domain.category.CategorySearchQuery;
import com.fullcycle.admin.catalogo.domain.pagination.Pagination;
import com.fullcycle.admin.catalogo.domain.validation.handler.Notification;
import com.fullcycle.admin.catalogo.infrastructure.api.CategoryAPI;
import com.fullcycle.admin.catalogo.infrastructure.category.models.CategoryResponse;
import com.fullcycle.admin.catalogo.infrastructure.category.models.CreateCategoryRequest;
import com.fullcycle.admin.catalogo.infrastructure.category.models.UpdateCategoryRequest;
import com.fullcycle.admin.catalogo.infrastructure.category.presenters.CategoryApiPresenter;

import java.net.URI;
import java.util.Objects;
import java.util.function.Function;

@RestController
public class CategoryController implements CategoryAPI {
  private final CreateCategoryUseCase createCategoryUseCase;
  private final GetCategoryByIdUseCase getCategoryByIdUseCase;
  private final UpdateCategoryUseCase updateCategoryUseCase;
  private final DeleteCategoryUseCase deleteCategoryUseCase;
  private final ListCategoriesUseCase listCategoriesUseCase;

  public CategoryController(
      final CreateCategoryUseCase createCategoryUseCase,
      final GetCategoryByIdUseCase getCategoryByIdUseCase,
      final UpdateCategoryUseCase updateCategoryUseCase,
      final DeleteCategoryUseCase deleteCategoryUseCase,
      final ListCategoriesUseCase listCategoriesUseCase) {
    this.createCategoryUseCase = createCategoryUseCase;
    this.getCategoryByIdUseCase = getCategoryByIdUseCase;
    this.updateCategoryUseCase = updateCategoryUseCase;
    this.deleteCategoryUseCase = deleteCategoryUseCase;
    this.listCategoriesUseCase = listCategoriesUseCase;
  }

  @Override
  public ResponseEntity<?> createCategory(final CreateCategoryRequest input) {
    final var aCommand = CreateCategoryCommand.with(
        input.name(),
        input.description(),
        input.active() != null ? input.active() : true);

    final Function<Notification, ResponseEntity<?>> onError = notification -> ResponseEntity.unprocessableEntity()
        .body(notification);

    final Function<CreateCategoryOutput, ResponseEntity<?>> onSuccess = output -> ResponseEntity
        .created(URI.create("/categories/" + output.id())).body(output);

    return this.createCategoryUseCase.execute(aCommand).fold(onError, onSuccess);
  }

  @Override
  public Pagination<?> listCategories(final String search, final int page, final int perPage, final String sort,
      final String dir) {
    return listCategoriesUseCase.execute(new CategorySearchQuery(page, perPage, search, sort, dir))
        .map(CategoryApiPresenter::present);
  }

  @Override
  public CategoryResponse getById(final String id) {
    return CategoryApiPresenter.present(this.getCategoryByIdUseCase.execute(id));
  }

  @Override
  public ResponseEntity<?> updateById(final String id, final UpdateCategoryRequest input) {
    final var aCommand = UpdateCategoryCommand.with(
        id,
        input.name(),
        input.description(),
        input.active() != null ? input.active() : true);

    final Function<Notification, ResponseEntity<?>> onError = notification -> ResponseEntity.unprocessableEntity()
        .body(notification);

    final Function<UpdateCategoryOutput, ResponseEntity<?>> onSuccess = output -> ResponseEntity
        .ok(output);

    return this.updateCategoryUseCase.execute(aCommand).fold(onError, onSuccess);
  }

  @Override
  public void deleteById(final String id) {
    this.deleteCategoryUseCase.execute(id);
  }

}
