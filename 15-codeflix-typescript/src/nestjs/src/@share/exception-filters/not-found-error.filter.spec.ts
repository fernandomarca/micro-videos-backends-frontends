import { Controller, Get, INestApplication } from '@nestjs/common';
import { NotFoundErrorFilter } from './not-found-error.filter';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { NotFoundError } from '@fm/micro-videos/@seedwork/domain';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new NotFoundError('fake not found error message');
  }
}

describe('NotFoundErrorFilter Unit tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [StubController]
    }).compile();
    app = module.createNestApplication();
    app.useGlobalFilters(new NotFoundErrorFilter());
    await app.init();
  });

  it('should catch a NotFoundError', () => {
    return request(app.getHttpServer())
      .get('/stub')
      .expect(404)
      .expect({
        status: 404,
        error: 'Not Found',
        message: 'fake not found error message'
      })
  });
});
