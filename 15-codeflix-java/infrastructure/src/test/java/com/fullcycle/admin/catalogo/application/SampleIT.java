package com.fullcycle.admin.catalogo.application;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.fullcycle.admin.catalogo.IntegrationTest;
import com.fullcycle.admin.catalogo.application.category.create.CreateCategoryUseCase;
import com.fullcycle.admin.catalogo.infrastructure.category.persistence.CategoryRepository;

@IntegrationTest
public class SampleIT {

  @Autowired
  private CreateCategoryUseCase useCase;

  @Autowired
  private CategoryRepository categoryRepository;

  @Test
  public void testInjects() {
    Assertions.assertNotNull(useCase);
    Assertions.assertNotNull(categoryRepository);

  }
}
