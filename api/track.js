const DEFAULT_DB_URL = 'https://shamil-shabbirmaanak.aws-ap-south-1.turso.io';
const DEFAULT_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTQwNDQwMjksImlkIjoiMDFhMWI1NWItNGMwMS03OGU5LWJhZmMtMWM0ZmRkM2U1NmQ3Iiwia2lkIjoicnNxM3J2QXI5MFloTkV0SGltMjhrRjVoUzBTbG1xcHc0M3JOVFRCaEZPUSIsInJpZCI6IjQ4YTc5ZTc2LTYzOGItNDU4MC05NTMwLTY4ODljZWEyZjZiMiJ9.ty5We6KcqkVcyJ5md-pSziHrhchbneL69Psy1W0cX8k6nhv6uuUL0LxoeERvWUFp4Y1TV38-WfV2NhISI-5DBA';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let platform = 'unknown';

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (_) {}
      }
      if (body && body.platform) platform = String(body.platform).toLowerCase();
    } else if (req.method === 'GET' && req.query && req.query.platform) {
      platform = String(req.query.platform).toLowerCase();
    }

    const userAgent = req.headers['user-agent'] || '';
    const country = req.headers['x-vercel-ip-country'] || 'Unknown';

    const rawUrl = process.env.TURSO_DATABASE_URL || DEFAULT_DB_URL;
    const dbUrl = rawUrl.replace(/^libsql:\/\//, 'https://');
    const token = process.env.TURSO_AUTH_TOKEN || DEFAULT_AUTH_TOKEN;

    const endpoint = `${dbUrl.replace(/\/$/, '')}/v2/pipeline`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            type: 'execute',
            stmt: {
              sql: 'INSERT INTO downloads (platform, user_agent, country) VALUES (?, ?, ?);',
              args: [
                { type: 'text', value: platform },
                { type: 'text', value: userAgent },
                { type: 'text', value: country }
              ]
            }
          },
          { type: 'close' }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Turso write failed:', errText);
      return res.status(200).json({ ok: false, error: 'Database write error' });
    }

    return res.status(200).json({ ok: true, platform, country });
  } catch (err) {
    console.error('Track handler error:', err);
    return res.status(200).json({ ok: false, error: err.message });
  }
};
