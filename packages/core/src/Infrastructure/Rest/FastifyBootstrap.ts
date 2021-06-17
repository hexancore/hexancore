import { FastifyAdapter } from '@nestjs/platform-fastify';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import { APP_CONFIG_PATH } from '@';
import { AllExceptionFilter } from './AllExceptionFilter';

export async function createFastifyAdapter(allExceptionFilter: AllExceptionFilter): Promise<FastifyAdapter> {
  const CERT_ROOT_DIR = path.join(APP_CONFIG_PATH, 'ssl');
  const adapter = new FastifyAdapter({
    http2: true,
    https: {
      key: fs.readFileSync(path.join(CERT_ROOT_DIR, 'ssl.key')),
      cert: fs.readFileSync(path.join(CERT_ROOT_DIR, 'ssl.crt')),
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  adapter.setErrorHandler(function(error: Error, req: FastifyRequest, res: FastifyReply) {
    allExceptionFilter.processInternalError(error, res);
  });

  await adapter.register(require('middie'));

  await adapter.register(require('fastify-multipart'), {
    limits: {
      fieldNameSize: 100,
      fieldSize: 1000000,
      fields: 10,
      fileSize: 1000000, // 1MB
      files: 1,
      headerPairs: 2000,
    },
  });

  await adapter.register(require('fastify-cookie'), {
    secret: 'test',
    parseOptions: {},
  });

  adapter.register(require('fastify-cors'), {
    // TODO fix cors
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    origin: (origin, cb) => {
      cb(null, true);
      return;
    },
    credentials: true,
    maxAge: 300,
  });

  return adapter;
}
