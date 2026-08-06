import { chromium } from 'playwright';

export type ScreenshotCaptureResult = {
  finalUrl: string;
  screenshot: Buffer;
  title: string | null;
  viewport: string;
};

export async function captureScreenshot(url: string): Promise<ScreenshotCaptureResult> {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 960 },
      userAgent: 'LimenBot/0.1 (+https://github.com/sudo-anshul/Limen)',
    });

    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 45_000,
    });

    const screenshot = await page.screenshot({
      fullPage: true,
      type: 'png',
    });

    const title = await page.title().catch(() => null);

    return {
      finalUrl: page.url(),
      screenshot,
      title,
      viewport: '1440x960',
    };
  } finally {
    await browser.close();
  }
}
