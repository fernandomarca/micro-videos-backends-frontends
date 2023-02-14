package com.fullcycle.admin.catalogo.domain.Validation.handler;

import com.fullcycle.admin.catalogo.domain.Validation.Error;
import com.fullcycle.admin.catalogo.domain.Validation.ValidationHandler;
import com.fullcycle.admin.catalogo.domain.exceptions.DomainException;

import java.util.List;

public class ThrowsValidationHandler implements ValidationHandler {

    @Override
    public ValidationHandler append(Error anError) {
        throw DomainException.with(anError);
    }

    @Override
    public ValidationHandler append(ValidationHandler anHandler) {
        throw DomainException.with(anHandler.getErrors());
    }

    @Override
    public ValidationHandler validate(final Validation aValidation) {
        try{
            aValidation.validate();
        }catch (final Exception ex){
            throw DomainException.with(new Error(ex.getMessage()));
        }
        return this;
    }

    @Override
    public List<Error> getErrors() {
        return List.of();
    }


}
