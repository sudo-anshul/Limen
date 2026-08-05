import { launchBriefSchema } from '@limen/shared/schemas/launch-brief';

function main() {
  console.log('Limen worker booting...');
  console.log('Launch brief schema loaded:', launchBriefSchema.shape.url.description ?? 'ready');
}

main();
