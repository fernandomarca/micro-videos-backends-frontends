package com.fullcycle.admin.catalogo.domain.video;

import java.util.Objects;

import com.fullcycle.admin.catalogo.domain.Identifier;
import com.fullcycle.admin.catalogo.domain.utils.IdUtils;

public class VideoCategoryID extends Identifier {
  private final String value;

  private VideoCategoryID(final String value) {
    this.value = Objects.requireNonNull(value);
  }

  public static VideoCategoryID from(final String anId) {
    return new VideoCategoryID(anId.toLowerCase());
  }

  public static VideoCategoryID unique() {
    return VideoCategoryID.from(IdUtils.uuid());
  }

  @Override
  public String getValue() {
    return value;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    final VideoCategoryID that = (VideoCategoryID) o;
    return getValue().equals(that.getValue());
  }

  @Override
  public int hashCode() {
    return Objects.hash(getValue());
  }
}
