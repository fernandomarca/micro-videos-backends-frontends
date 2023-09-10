package com.fullcycle.admin.catalogo.infrastructure.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.fullcycle.admin.catalogo.domain.pagination.Pagination;
import com.fullcycle.admin.catalogo.infrastructure.api.CategoryAPI;

@RestController
public class CategoryController implements CategoryAPI {

  @Override
  public ResponseEntity<?> createCategory() {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'createCategory'");
  }

  @Override
  public Pagination<?> listCategories(String search, int page, int perPage, String sort, String dir) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'listCategories'");
  }

}
