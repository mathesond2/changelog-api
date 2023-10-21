setTimeout(() => {
  throw new Error('oopsy daisy');
}, 300);

//for uncaught errs in node
process.on('uncaughtException', (err) => {
  console.error('whoo boy! there was an error');
  console.error(err.stack);
  process.exit(1);
});

//for promise-based errs
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
  process.exit(1);
});
