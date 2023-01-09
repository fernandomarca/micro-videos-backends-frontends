import { EntityValidationError } from '@fm/micro-videos/@seedwork/domain';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EntityValidationErrorFilter } from './entity-validation-error.filter';
import request from 'supertest';
@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new EntityValidationError({
      field1: ['field1 is required'],
      field2: ['field2 is required'],
    })
  }
}
describe('EntityValidationErrorFilter', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [StubController]
    }).compile();
    app = module.createNestApplication();
    app.useGlobalFilters(new EntityValidationErrorFilter());
    await app.init();
  });

  it('should catch a entityValidationError', () => {
    return request(app.getHttpServer())
      .get('/stub')
      .expect(422)
      .expect({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: ['field1 is required', 'field2 is required']
      })
  });
});
