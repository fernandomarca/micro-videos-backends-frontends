package com.fullcycle.admin.catalogo.domain.exceptions;

import java.util.List;

import com.fullcycle.admin.catalogo.domain.validation.Error;

public class DomainException extends NoStackTraceException {
  private final List<Error> errors;

  protected DomainException(final String aMessage, final List<Error> anErrors) {
    super(aMessage);
    this.errors = anErrors;
  }

  public static DomainException with(final Error error) {
    return new DomainException(error.message(), List.of(error));
  }

  public static DomainException with(final List<Error> anErrors) {
    return new DomainException("", anErrors);
  }

  public List<Error> getErrors() {
    return errors;
  }
}
