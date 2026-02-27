// Try to get a temp email from mail.tm API
const https = require('https');

function fetch(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: opts.method || 'GET',
      headers: { 'Content-Type': 'application/json', ...opts.headers }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

(async () => {
  // Get available domains from mail.tm
  try {
    const r = await fetch('https://api.mail.tm/domains');
    console.log('Domains:', r.data);
    const domains = JSON.parse(r.data);
    const domain = domains['hydra:member']?.[0]?.domain || domains[0]?.domain;
    console.log('Using domain:', domain);
    
    // Create account
    const email = `taskbot${Date.now()}@${domain}`;
    const password = 'TaskBot2026!';
    const r2 = await fetch('https://api.mail.tm/accounts', {
      method: 'POST',
      body: JSON.stringify({ address: email, password })
    });
    console.log('Account:', r2.status, r2.data);
    
    // Get token
    const r3 = await fetch('https://api.mail.tm/token', {
      method: 'POST', 
      body: JSON.stringify({ address: email, password })
    });
    console.log('Token:', r3.status, r3.data);
    
    const tokenData = JSON.parse(r3.data);
    console.log('\n=== CREDENTIALS ===');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Token:', tokenData.token);
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
