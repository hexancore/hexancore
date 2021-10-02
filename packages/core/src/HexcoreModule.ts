import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import path from 'path';
import * as fs from 'fs';

export const APP_HOME = process.env.APP_HOME ?? path.dirname(path.dirname(process.cwd()));
export const APP_CONFIG_PATH = path.posix.join(APP_HOME, 'config', process.env.NODE_ENV);
const ENV_FILE_PATH = path.posix.join(APP_CONFIG_PATH, '.env');

if (!fs.existsSync(ENV_FILE_PATH)) {
  throw Error('Config file is not exists: ' + ENV_FILE_PATH);
}

const ConfigModuleInstance = ConfigModule.forRoot({
  envFilePath: ENV_FILE_PATH,
  isGlobal: true,
  ignoreEnvVars: true,
});

export const IAppHome = Symbol('AppHome');
const AppHomeProvider = {
  provide: IAppHome,
  useValue: APP_HOME,
};

@Global()
@Module({
  imports: [ConfigModuleInstance],
  providers: [AppHomeProvider, ConfigService],
  exports: [ConfigModuleInstance, AppHomeProvider, ConfigService],
})
export class HexcoreModule {}
