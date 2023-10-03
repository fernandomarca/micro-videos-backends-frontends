package com.fullcycle.admin.catalogo.infrastructure.category.models;

import java.time.Instant;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.json.JacksonTester;

import com.fullcycle.admin.catalogo.JacksonTest;

@JacksonTest
public class CategoryResponseTest {
  @Autowired
  private JacksonTester<CategoryResponse> json;

  @Test
  public void testMarshall() throws Exception {
    final var expectId = "123";
    final var expectName = "Filmes";
    final var expectedDescription = "A categoria mais assistida";
    final var expectedIsActive = false;
    final var expectedCreatedAt = Instant.now();
    final var expectedUpdatedAt = Instant.now();
    final var expectedDeletedAt = Instant.now();

    final var response = new CategoryResponse(
        expectId,
        expectName,
        expectedDescription,
        expectedIsActive,
        expectedCreatedAt,
        expectedUpdatedAt,
        expectedDeletedAt);

    final var actucalJson = this.json.write(response);

    Assertions.assertThat(actucalJson).hasJsonPathValue("$.id", expectId);
    Assertions.assertThat(actucalJson).hasJsonPathValue("$.name", expectName);
    Assertions.assertThat(actucalJson).hasJsonPathValue("$.description", expectedDescription);
    Assertions.assertThat(actucalJson).hasJsonPathValue("$.is_active", expectedIsActive);
    Assertions.assertThat(actucalJson).hasJsonPathValue("$.created_at", expectedCreatedAt.toString());
    Assertions.assertThat(actucalJson).hasJsonPathValue("$.updated_at", expectedUpdatedAt.toString());
    Assertions.assertThat(actucalJson).hasJsonPathValue("$.deleted_at", expectedDeletedAt.toString());

  }

  @Test
  public void testUnMarshall() throws Exception {
    final var expectId = "123";
    final var expectName = "Filmes";
    final var expectedDescription = "A categoria mais assistida";
    final var expectedIsActive = false;
    final var expectedCreatedAt = Instant.now();
    final var expectedUpdatedAt = Instant.now();
    final var expectedDeletedAt = Instant.now();

    final var json = """
        {
          "id": "%s",
          "name": "%s",
          "description": "%s",
          "is_active": %s,
          "created_at": "%s",
          "updated_at": "%s",
          "deleted_at": "%s"
        }
        """.formatted(expectId, expectName, expectedDescription, expectedIsActive, expectedCreatedAt.toString(),
        expectedUpdatedAt.toString(),
        expectedDeletedAt.toString());

    final var actucalJson = this.json.parse(json);

    Assertions.assertThat(actucalJson).hasFieldOrPropertyWithValue("id", expectId);
    Assertions.assertThat(actucalJson).hasFieldOrPropertyWithValue("name", expectName);
    Assertions.assertThat(actucalJson).hasFieldOrPropertyWithValue("description", expectedDescription);
    Assertions.assertThat(actucalJson).hasFieldOrPropertyWithValue("active", expectedIsActive);
    Assertions.assertThat(actucalJson).hasFieldOrPropertyWithValue("createdAt", expectedCreatedAt);
    Assertions.assertThat(actucalJson).hasFieldOrPropertyWithValue("updatedAt", expectedUpdatedAt);
    Assertions.assertThat(actucalJson).hasFieldOrPropertyWithValue("deletedAt", expectedDeletedAt);

  }
}