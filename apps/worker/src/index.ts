import { createQueueWorker } from './queue-worker';

async function main() {
  console.log('Limen worker booting...');
  createQueueWorker();
  console.log('Launch run worker is listening for jobs.');
}

main().catch((error) => {
  console.error('Worker failed to start', error);
  process.exit(1);
});
