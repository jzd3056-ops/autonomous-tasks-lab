const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    args: ['--no-sandbox', '--disable-dev-shm-usage'] 
  });
  const page = await browser.newPage();
  
  // Check Clickworker registration form
  try {
    await page.goto('https://www.clickworker.com/clickworker/?utm_source=cw4cw#/signup', { timeout: 20000 });
    await page.waitForTimeout(3000);
    const content = await page.textContent('body');
    console.log('=== CLICKWORKER SIGNUP ===');
    console.log(content.substring(0, 2000));
  } catch (e) {
    console.log('Clickworker signup error:', e.message);
  }

  // Check Toloka worker signup
  try {
    await page.goto('https://toloka.ai/tolokers/', { timeout: 15000 });
    await page.waitForTimeout(2000);
    const content = await page.textContent('body');
    console.log('\n=== TOLOKA ===');
    console.log(content.substring(0, 1500));
  } catch (e) {
    console.log('Toloka error:', e.message);
  }

  // Microworkers proper signup
  try {
    await page.goto('https://www.microworkers.com/', { timeout: 15000 });
    await page.waitForTimeout(2000);
    // Look for signup link
    const links = await page.$$eval('a', as => as.map(a => ({href: a.href, text: a.textContent.trim()})).filter(a => a.text.toLowerCase().includes('register') || a.text.toLowerCase().includes('sign')));
    console.log('\n=== MICROWORKERS LINKS ===');
    console.log(JSON.stringify(links, null, 2));
  } catch (e) {
    console.log('Microworkers error:', e.message);
  }

  await browser.close();
})();
