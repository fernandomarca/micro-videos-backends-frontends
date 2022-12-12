import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    // const configService = app.get<ConfigService<CONFIG_SCHEMA_TYPE>>(ConfigService);
    // const db_vender = configService.get<CONFIG_SCHEMA_TYPE['DB_VENDOR']>('DB_VENDOR');

    const db_vendor = ConfigModule.getConfigValue('DB_VENDOR', app);
    console.log(db_vendor);
  });


  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
