// Try guerrillamail API
const https = require('https');
const http = require('http');

function fetch(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

(async () => {
  // Try 1rpc temp email
  try {
    const r = await fetch('https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1');
    console.log('1secmail:', r.data);
  } catch(e) { console.log('1secmail err:', e.message); }

  // Try tempmail.lol
  try {
    const r = await fetch('https://api.tempmail.lol/v2/inbox/create');
    console.log('tempmail.lol:', r.status, r.data.substring(0, 500));
  } catch(e) { console.log('tempmail.lol err:', e.message); }

  // Try guerrillamail  
  try {
    const r = await fetch('https://api.guerrillamail.com/ajax.php?f=get_email_address');
    console.log('guerrilla:', r.status, r.data.substring(0, 500));
  } catch(e) { console.log('guerrilla err:', e.message); }
})();
