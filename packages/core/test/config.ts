import 'jest-ts-auto-mock';
import 'reflect-metadata';

process.on('unhandledRejection', (err) => {
  fail(err);
});
