import 'reflect-metadata';

process.on('unhandledRejection', (err) => {
  fail(err);
});
