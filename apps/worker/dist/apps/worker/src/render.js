import { captureScreenshot } from './browser';
import { persistScreenshotArtifact } from './screenshots';
export async function captureRenderedEvidence({ auditRunId, url, }) {
    const screenshotResult = await captureScreenshot(url);
    const screenshotArtifact = await persistScreenshotArtifact({
        auditRunId,
        screenshot: screenshotResult.screenshot,
        sourceUrl: screenshotResult.finalUrl,
    });
    return {
        screenshotArtifactId: screenshotArtifact.id,
        renderedTitle: screenshotResult.title,
        renderedUrl: screenshotResult.finalUrl,
        viewport: screenshotResult.viewport,
    };
}
