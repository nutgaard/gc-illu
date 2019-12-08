const puppeteer = require('puppeteer');

async function screenshot(page, selector, path, padding = 0) {
    console.log(`Photo: ${path}`);
    const rect = await page.evaluate(selector => {
        const element = document.querySelector(selector);
        const {x, y, width, height} = element.getBoundingClientRect();
        return {left: x, top: y, width, height, id: element.id};
    }, selector);

    return await page.screenshot({
        path,
        clip: {
            x: rect.left - padding,
            y: rect.top - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2
        }
    });
}

async function takeScreenshots(page, mode) {
    await screenshot(page, `.heap`, `img/heap-${mode}.png`);
    await screenshot(page, `#memory-before`, `img/memory-before-${mode}.png`);
    await screenshot(page, `#memory-marked`, `img/memory-marked-${mode}.png`);
    await screenshot(page, `#memory-after`, `img/memory-after-${mode}.png`);
    await screenshot(page, `#memory-after-compact`, `img/memory-after-compact-${mode}.png`);

    await screenshot(page, `#memory-partition`, `img/memory-partition-${mode}.png`);
    await screenshot(page, `#memory-partition-marked`, `img/memory-partition-marked-${mode}.png`);
    await screenshot(page, `#memory-partition-copied`, `img/memory-copied-${mode}.png`);
}

(async function() {
    const opts = {} || {slowMo: 100, headless: false};
    const browser = await puppeteer.launch(opts);
    const page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080 });

    await page.goto('http://localhost:1234');

    await takeScreenshots(page, 'light');

    await page.addStyleTag({content: 'body{background: #0E0E0E !important;}'});
    await takeScreenshots(page,'dark');

    await page.close();
    await browser.close();
})();