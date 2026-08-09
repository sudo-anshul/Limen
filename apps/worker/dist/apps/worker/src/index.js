import fs from 'node:fs';
import path from 'node:path';
// Load .env files synchronously before any submodules are loaded
const envPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '../../.env'),
];
for (const envPath of envPaths) {
    if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
        try {
            process.loadEnvFile(envPath);
        }
        catch {
            // ignore
        }
    }
}
async function main() {
    console.log('Limen worker booting...');
    const { createQueueWorker } = await import('./queue-worker');
    createQueueWorker();
    console.log('Launch run worker is listening for jobs.');
}
main().catch((error) => {
    console.error('Worker failed to start', error);
    process.exit(1);
});
