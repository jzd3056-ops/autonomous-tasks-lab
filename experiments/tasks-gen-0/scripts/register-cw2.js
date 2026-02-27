const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'] 
  });
  const page = await browser.newPage();
  
  await page.goto('https://www.clickworker.com/clickworker/?utm_source=cw4cw#/signup', { timeout: 30000 });
  await page.waitForTimeout(3000);
  
  // Accept cookies
  try {
    await page.click('text=Accept All', { timeout: 5000 });
    await page.waitForTimeout(1000);
  } catch(e) {}
  
  // Click "Work on your desktop or notebook"
  try {
    await page.click('text=Work on your', { timeout: 5000 });
    await page.waitForTimeout(3000);
  } catch(e) {
    console.log('No desktop button found');
  }
  
  await page.screenshot({ path: '/tmp/cw-step2.png' });
  
  // Check for form fields now
  const inputs = await page.$$eval('input', els => els.map(e => ({
    type: e.type, name: e.name, id: e.id, placeholder: e.placeholder
  })));
  console.log('Inputs:', JSON.stringify(inputs, null, 2));
  
  // Get page HTML structure
  const html = await page.content();
  // Find form-related elements
  const formHtml = html.match(/<form[\s\S]*?<\/form>/gi);
  if (formHtml) {
    console.log('Found forms:', formHtml.length);
    formHtml.forEach((f, i) => console.log(`Form ${i}:`, f.substring(0, 500)));
  }
  
  // Check iframes
  const frames = page.frames();
  console.log('Frames:', frames.length);
  for (const f of frames) {
    console.log('Frame:', f.url());
  }
  
  await browser.close();
})();
