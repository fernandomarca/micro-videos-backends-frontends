package com.fullcycle.admin.catalogo.application.category.update;

import static io.vavr.API.Try;

import java.util.function.Supplier;

import com.fullcycle.admin.catalogo.domain.Validation.Error;
import com.fullcycle.admin.catalogo.domain.Validation.handler.Notification;
import com.fullcycle.admin.catalogo.domain.category.Category;
import com.fullcycle.admin.catalogo.domain.category.CategoryGateway;
import com.fullcycle.admin.catalogo.domain.category.CategoryID;
import com.fullcycle.admin.catalogo.domain.exceptions.DomainException;

import io.vavr.API;
import io.vavr.control.Either;

public class DefaultUpdateCategoryUseCase extends UpdateCategoryUseCase {

  private final CategoryGateway categoryGateway;

  public DefaultUpdateCategoryUseCase(final CategoryGateway aCategoryGateway) {
    this.categoryGateway = aCategoryGateway;
  }

  @Override
  public Either<Notification, UpdateCategoryOutput> execute(final UpdateCategoryCommand aCommand) {
    final var anId = CategoryID.from(aCommand.id());
    final var aName = aCommand.name();
    final var aDescription = aCommand.description();
    final var isActive = aCommand.isActive();

    final var aCategory = this.categoryGateway.findById(anId)
        .orElseThrow(notFound(anId));

    final var notification = Notification.create();

    aCategory.update(aName, aDescription, isActive)
        .validate(notification);

    return notification.hasError() ? API.Left(notification) : update(aCategory);
  }

  private Either<Notification, UpdateCategoryOutput> update(final Category aCategory) {
    return Try(() -> this.categoryGateway.update(aCategory))
        .toEither()
        .bimap(Notification::create, UpdateCategoryOutput::from);
  }

  private Supplier<DomainException> notFound(final CategoryID anId) {
    return () -> DomainException.with(new Error("Category with ID %s was not found".formatted(anId.getValue())));
  }

}
