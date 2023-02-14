import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigModuleOptions, ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as Joi from 'joi';

type DB_SCHEMA_TYPE = {
  DB_VENDOR: 'mysql' | 'sqlite' | 'postgres',
  DB_HOST: string,
  DB_DATABASE: string,
  DB_USERNAME: string,
  DB_PASSWORD: string,
  DB_PORT: number,
  DB_LOGGING: boolean,
  DB_AUTO_LOAD_MODELS: boolean,
};

export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
  DB_VENDOR: Joi.string().required().valid('mysql', 'sqlite', 'postgres'),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().when('DB_VENDOR', {
    is: ['mysql', 'postgres'],
    then: Joi.required()
  }),
  DB_USERNAME: Joi.string().when('DB_VENDOR', {
    is: ['mysql', 'postgres'],
    then: Joi.required()
  }),
  DB_PASSWORD: Joi.string().when('DB_VENDOR', {
    is: ['mysql', 'postgres'],
    then: Joi.required()
  }),
  DB_PORT: Joi.number().integer().when('DB_VENDOR', {
    is: ['mysql', 'postgres'],
    then: Joi.required()
  }),
  DB_LOGGING: Joi.boolean().required(),
  DB_AUTO_LOAD_MODELS: Joi.boolean().required(),
};

// export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE & MAIL_SCHEMA_TYPE;
export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE;

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    // console.log(join(__dirname, '../envs/.env'));
    const { envFilePath, ...otherOptions } = options;
    return super.forRoot({
      isGlobal: true,
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath
          : [envFilePath]),
        join(__dirname, `../../envs/.env.${process.env.NODE_ENV}`),
        join(__dirname, '../../envs/.env')
      ],
      validationSchema: Joi.object({
        ...CONFIG_DB_SCHEMA,
      }),
      ...otherOptions
    });
  }
  //implementação de abstração para buscar os valores de configuração
  static getConfigValue(value: keyof CONFIG_SCHEMA_TYPE) {
    // const configService = app.get<ConfigService<CONFIG_SCHEMA_TYPE>>(ConfigService);
    const configService = new ConfigService();
    return configService.get<CONFIG_SCHEMA_TYPE[typeof value]>(value);
  };
}
