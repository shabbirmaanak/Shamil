export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (_) {}
    }
    const platform = (body && body.platform) ? String(body.platform).toLowerCase() : 'unknown';
    const userAgent = req.headers['user-agent'] || '';
    const country = req.headers['x-vercel-ip-country'] || '';

    const dbUrl = (process.env.TURSO_DATABASE_URL || '').replace(/^libsql:\/\//, 'https://');
    const token = process.env.TURSO_AUTH_TOKEN || '';

    if (!dbUrl || !token) {
      console.warn('TURSO_DATABASE_URL or TURSO_AUTH_TOKEN not configured');
      return res.status(200).json({ ok: false, warning: 'Database environment variables not configured' });
    }

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
      console.error('Turso error:', errText);
      return res.status(200).json({ ok: false, error: 'Turso write error' });
    }

    return res.status(200).json({ ok: true, platform });
  } catch (err) {
    console.error('Track error:', err);
    return res.status(200).json({ ok: false, error: err.message });
  }
}
