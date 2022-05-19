import { DynamicModule, ForwardReference, Module, Provider, Type } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmMySqlModuleRootOptions } from '../MySqlModule';

// load encodings - JEST hack
import iconv from 'iconv-lite';
import encodings from 'iconv-lite/encodings';
iconv['encodings'] = encodings;
// load encodings - JEST hack

export const TypeOrmMySqlTestingModuleRootOptions = {
  imports: TypeOrmMySqlModuleRootOptions.imports,
  inject: TypeOrmMySqlModuleRootOptions.inject,
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
    let options: any = await TypeOrmMySqlModuleRootOptions.useFactory(configService);
    return {
      type: options.type,
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password,
      database: options.database,
      charset: options.charset,
      synchronize: true,
      dropSchema: true,
      autoLoadEntities: true,
    };
  },
};

export interface MySqlTestingModuleOptions {
  imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
  providers?: Provider[];
}

export function createMySqlTestingModule(options: MySqlTestingModuleOptions): Promise<TestingModule> {
  const imports = [TypeOrmModule.forRootAsync(TypeOrmMySqlTestingModuleRootOptions), ...options.imports];
  return Test.createTestingModule({
    imports,
    providers: options.providers ?? [],
  }).compile();
}
