const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    args: ['--no-sandbox', '--disable-dev-shm-usage'] 
  });
  const page = await browser.newPage();
  
  // Check Clickworker signup
  try {
    await page.goto('https://www.clickworker.com/clickworker/', { timeout: 15000 });
    const content = await page.textContent('body');
    console.log('=== CLICKWORKER ===');
    console.log(content.substring(0, 1000));
  } catch (e) {
    console.log('Clickworker error:', e.message);
  }

  // Check Rapidworkers signup
  try {
    await page.goto('https://rapidworkers.com/signup', { timeout: 15000 });
    const content = await page.textContent('body');
    console.log('\n=== RAPIDWORKERS ===');
    console.log(content.substring(0, 1000));
  } catch (e) {
    console.log('Rapidworkers error:', e.message);
  }

  // Check SproutGigs (formerly Picoworkers) signup
  try {
    await page.goto('https://sproutgigs.com/signup.php', { timeout: 15000 });
    const content = await page.textContent('body');
    console.log('\n=== SPROUTGIGS ===');
    console.log(content.substring(0, 1000));
  } catch (e) {
    console.log('SproutGigs error:', e.message);
  }

  // Check Microworkers signup  
  try {
    await page.goto('https://microworkers.com/register.php', { timeout: 15000 });
    const content = await page.textContent('body');
    console.log('\n=== MICROWORKERS ===');
    console.log(content.substring(0, 1000));
  } catch (e) {
    console.log('Microworkers error:', e.message);
  }

  await browser.close();
})();
