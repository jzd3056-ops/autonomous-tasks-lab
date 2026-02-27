const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'] 
  });

  // === TRY CLICKWORKER ===
  console.log('=== CLICKWORKER ===');
  const p1 = await browser.newPage();
  try {
    await p1.goto('https://www.clickworker.com/clickworker/?utm_source=cw4cw#/signup', { timeout: 20000 });
    await p1.waitForTimeout(2000);
    try { await p1.click('text=Accept All', { timeout: 3000 }); } catch(e) {}
    await p1.waitForTimeout(1000);
    // Click Register in the nav
    await p1.click('a:has-text("Register")', { timeout: 5000 });
    await p1.waitForTimeout(3000);
    await p1.screenshot({ path: '/tmp/cw-register.png' });
    const url = p1.url();
    console.log('URL after Register click:', url);
    const inputs = await p1.$$eval('input', els => els.map(e => ({
      type: e.type, name: e.name, id: e.id, placeholder: e.placeholder
    })).filter(e => e.type !== 'hidden' && e.name !== 'moove_gdpr_strict_cookies' && e.name !== 'moove_gdpr_performance_cookies'));
    console.log('Inputs:', JSON.stringify(inputs, null, 2));
  } catch(e) { console.log('Error:', e.message); }
  await p1.close();

  // === TRY TOLOKA ===
  console.log('\n=== TOLOKA ===');
  const p2 = await browser.newPage();
  try {
    await p2.goto('https://platform.toloka.ai/auth/signin', { timeout: 20000 });
    await p2.waitForTimeout(3000);
    await p2.screenshot({ path: '/tmp/toloka-signin.png' });
    const content = await p2.textContent('body');
    console.log('Content:', content.substring(0, 1000));
    // Look for signup link
    const links = await p2.$$eval('a', as => as.map(a => ({ href: a.href, text: a.textContent.trim() })));
    console.log('Links:', JSON.stringify(links.filter(l => l.text.length > 0 && l.text.length < 50), null, 2));
  } catch(e) { console.log('Error:', e.message); }
  await p2.close();

  // === TRY MICROWORKERS ===
  console.log('\n=== MICROWORKERS ===');
  const p3 = await browser.newPage();
  try {
    await p3.goto('https://www.microworkers.com/signup', { timeout: 20000 });
    await p3.waitForTimeout(3000);
    await p3.screenshot({ path: '/tmp/mw-signup.png' });
    const inputs = await p3.$$eval('input', els => els.map(e => ({
      type: e.type, name: e.name, id: e.id, placeholder: e.placeholder
    })).filter(e => e.type !== 'hidden'));
    console.log('Inputs:', JSON.stringify(inputs, null, 2));
  } catch(e) { console.log('Error:', e.message); }
  await p3.close();

  await browser.close();
})();
