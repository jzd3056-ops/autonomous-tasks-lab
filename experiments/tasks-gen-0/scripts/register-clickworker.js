const { chromium } = require('playwright');
const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

(async () => {
  // Get guerrillamail address
  const gm = await fetch('https://api.guerrillamail.com/ajax.php?f=get_email_address');
  const email = gm.email_addr;
  const sid = gm.sid_token;
  console.log('Email:', email);

  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'] 
  });
  const page = await browser.newPage();
  
  // Go to Clickworker signup
  await page.goto('https://www.clickworker.com/clickworker/?utm_source=cw4cw#/signup', { timeout: 30000 });
  await page.waitForTimeout(5000);
  
  // Screenshot to see the form
  await page.screenshot({ path: '/tmp/cw-signup.png' });
  
  // Look for form fields
  const inputs = await page.$$eval('input', els => els.map(e => ({
    type: e.type, name: e.name, id: e.id, placeholder: e.placeholder, class: e.className
  })));
  console.log('Form inputs:', JSON.stringify(inputs, null, 2));
  
  const selects = await page.$$eval('select', els => els.map(e => ({
    name: e.name, id: e.id, options: [...e.options].map(o => o.value).slice(0, 5)
  })));
  console.log('Selects:', JSON.stringify(selects, null, 2));

  const buttons = await page.$$eval('button', els => els.map(e => ({
    text: e.textContent.trim(), type: e.type
  })));
  console.log('Buttons:', JSON.stringify(buttons, null, 2));

  await browser.close();
})();
