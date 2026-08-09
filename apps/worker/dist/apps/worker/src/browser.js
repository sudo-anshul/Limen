import { chromium } from 'playwright';
export async function captureScreenshot(url) {
    const browser = await chromium.launch({ headless: true });
    try {
        const page = await browser.newPage({
            viewport: { width: 1440, height: 960 },
            userAgent: 'LimenBot/0.1 (+https://github.com/sudo-anshul/Limen)',
        });
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 20_000,
        });
        await page.waitForTimeout(1_200);
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
    }
    finally {
        await browser.close();
    }
}
