import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from './SnakeNamingStrategy';

export const TypeOrmMySqlModuleRootOptions = {
  imports: [ConfigModule],
  useFactory: async (config: ConfigService): Promise<TypeOrmModuleOptions> => ({
    type: 'mysql',
    host: config.get<string>('MYSQL_HOST'),
    port: Number.parseInt(config.get<string>('MYSQL_PORT')),
    username: config.get<string>('MYSQL_USERNAME'),
    password: config.get<string>('MYSQL_PASSWORD'),
    database: config.get<string>('MYSQL_DATABASE'),
    retryAttempts: Number.parseInt(config.get('MYSQL_RETRY_ATTEMPTS')),
    retryDelay: Number.parseInt(config.get('MYSQL_RETRY_DELAY')),
    charset: config.get<string>('MYSQL_CHARSET'),
    synchronize: config.get('MYSQL_SYNCHRONIZE_SCHEMA') === 'true',
    autoLoadEntities: true,
    namingStrategy: new SnakeNamingStrategy(),
    cache: config.get('MYSQL_CACHE') === 'true' ? true : false,
  }),
  inject: [ConfigService],
};

const TypOrmRoot = TypeOrmModule.forRootAsync(TypeOrmMySqlModuleRootOptions);
@Module({
  imports: [TypOrmRoot],
  exports: [TypOrmRoot],
})
export class TypeOrmMySqlModule {}
