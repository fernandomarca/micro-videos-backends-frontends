package com.fullcycle.admin.catalogo.domain;

import java.util.Collections;
import java.util.List;

import com.fullcycle.admin.catalogo.domain.events.DomainEvent;

public abstract class AggregateRoot<ID extends Identifier> extends Entity<ID> {

  protected AggregateRoot(final ID id) {
    super(id, Collections.emptyList());
  }

  protected AggregateRoot(final ID id, final List<DomainEvent> domainEvents) {
    super(id, domainEvents);
  }
}
