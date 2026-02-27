const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'] 
  });

  // Microworkers - click Register for free from homepage
  console.log('=== MICROWORKERS ===');
  const p1 = await browser.newPage();
  try {
    await p1.goto('https://www.microworkers.com/', { timeout: 20000 });
    await p1.waitForTimeout(2000);
    await p1.click('text=Register for free', { timeout: 5000 });
    await p1.waitForTimeout(3000);
    console.log('URL:', p1.url());
    await p1.screenshot({ path: '/tmp/mw-reg2.png' });
    const inputs = await p1.$$eval('input', els => els.map(e => ({
      type: e.type, name: e.name, placeholder: e.placeholder
    })).filter(e => e.type !== 'hidden'));
    console.log('Inputs:', JSON.stringify(inputs, null, 2));
    const labels = await p1.$$eval('label', els => els.map(e => e.textContent.trim()).filter(t => t.length > 0 && t.length < 100));
    console.log('Labels:', JSON.stringify(labels));
  } catch(e) { console.log('Error:', e.message); }
  await p1.close();

  // Toloka worker registration
  console.log('\n=== TOLOKA WORKER ===');
  const p2 = await browser.newPage();
  try {
    await p2.goto('https://toloka.yandex.com/signup', { timeout: 15000 });
    await p2.waitForTimeout(3000);
    console.log('URL:', p2.url());
    await p2.screenshot({ path: '/tmp/toloka-reg.png' });
    const body = await p2.textContent('body');
    console.log('Body:', body.substring(0, 500));
  } catch(e) { 
    console.log('Toloka yandex error:', e.message);
    // Try alternate URL
    try {
      await p2.goto('https://we.toloka.ai/signup', { timeout: 15000 });
      await p2.waitForTimeout(3000);
      console.log('Alt URL:', p2.url());
      await p2.screenshot({ path: '/tmp/toloka-reg2.png' });
      const body = await p2.textContent('body');
      console.log('Body:', body.substring(0, 500));
    } catch(e2) { console.log('Alt error:', e2.message); }
  }
  await p2.close();

  // Clickworker - try direct register URL
  console.log('\n=== CLICKWORKER DIRECT ===');
  const p3 = await browser.newPage();
  try {
    await p3.goto('https://workplace.clickworker.com/en/account/sign_up', { timeout: 15000 });
    await p3.waitForTimeout(3000);
    console.log('URL:', p3.url());
    await p3.screenshot({ path: '/tmp/cw-direct.png' });
    const inputs = await p3.$$eval('input', els => els.map(e => ({
      type: e.type, name: e.name, placeholder: e.placeholder
    })).filter(e => e.type !== 'hidden'));
    console.log('Inputs:', JSON.stringify(inputs, null, 2));
  } catch(e) { console.log('Error:', e.message); }
  await p3.close();

  await browser.close();
})();
