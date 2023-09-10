package com.fullcycle.admin.catalogo.infrastructure.category;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import com.fullcycle.admin.catalogo.domain.category.Category;
import com.fullcycle.admin.catalogo.domain.category.CategoryGateway;
import com.fullcycle.admin.catalogo.domain.category.CategoryID;
import com.fullcycle.admin.catalogo.domain.category.CategorySearchQuery;
import com.fullcycle.admin.catalogo.domain.pagination.Pagination;
import com.fullcycle.admin.catalogo.infrastructure.category.persistence.CategoryJpaEntity;
import com.fullcycle.admin.catalogo.infrastructure.category.persistence.CategoryRepository;
import com.fullcycle.admin.catalogo.infrastructure.utils.SpecificationUtils;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import static com.fullcycle.admin.catalogo.infrastructure.utils.SpecificationUtils.like;

@Component
public class CategoryMySQLGateway implements CategoryGateway {
  private final CategoryRepository repository;

  public CategoryMySQLGateway(final CategoryRepository repository) {
    this.repository = repository;
  }

  @Override
  public Category create(final Category aCategory) {
    return save(aCategory);
  }

  @Override
  public void deleteById(final CategoryID anId) {
    final String anIdValue = anId.getValue();
    if (this.repository.existsById(anIdValue)) {
      this.repository.deleteById(anIdValue);
    }
  }

  @Override
  public Optional<Category> findById(final CategoryID anId) {
    return this.repository.findById(anId.getValue()).map(CategoryJpaEntity::toAggregate);
  }

  @Override
  public Category update(final Category aCategory) {
    return save(aCategory);
  }

  @Override
  public Pagination<Category> findAll(CategorySearchQuery aQuery) {

    final var page = PageRequest.of(
        aQuery.page(),
        aQuery.perPage(),
        Sort.by(Direction.fromString(aQuery.direction()), aQuery.sort()));

    final var specifications = Optional.ofNullable(aQuery.terms())
        .filter(str -> !str.isBlank())
        .map(str -> SpecificationUtils.<CategoryJpaEntity>like("name", str)
            .or(like("description", str)))
        .orElse(null);

    final var example = Example.of(
        CategoryJpaEntity.from(Category.newCategory(aQuery.terms(), aQuery.terms(), true)),
        ExampleMatcher.matchingAny().withIgnoreCase()
            .withMatcher("name", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase())
            .withMatcher("description", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase()));

    final var pageResult = this.repository.findAll(example, page);

    return new Pagination<>(pageResult.getNumber(), pageResult.getSize(),
        pageResult.getTotalElements(),
        pageResult.map(CategoryJpaEntity::toAggregate).toList());
  }

  private Category save(final Category aCategory) {
    return this.repository.save(CategoryJpaEntity.from(aCategory)).toAggregate();
  }

}
