export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const dbUrl = (process.env.TURSO_DATABASE_URL || '').replace(/^libsql:\/\//, 'https://');
  const token = process.env.TURSO_AUTH_TOKEN || '';

  if (!dbUrl || !token) {
    return res.status(500).json({
      error: 'Environment variables TURSO_DATABASE_URL and/or TURSO_AUTH_TOKEN are missing in Vercel.'
    });
  }

  try {
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
              sql: 'SELECT LOWER(platform) as platform, COUNT(*) as count FROM downloads GROUP BY LOWER(platform);'
            }
          },
          {
            type: 'execute',
            stmt: {
              sql: 'SELECT COUNT(*) as total FROM downloads;'
            }
          },
          {
            type: 'execute',
            stmt: {
              sql: 'SELECT platform, downloaded_at, country FROM downloads ORDER BY id DESC LIMIT 15;'
            }
          },
          { type: 'close' }
        ]
      })
    });

    const data = await response.json();
    const platformRows = data.results[0]?.response?.result?.rows || [];
    const totalRow = data.results[1]?.response?.result?.rows || [];
    const recentRows = data.results[2]?.response?.result?.rows || [];

    const stats = { mac: 0, windows: 0, total: 0 };
    for (const r of platformRows) {
      const p = r[0]?.value?.toLowerCase();
      const count = Number(r[1]?.value || 0);
      if (p === 'mac') stats.mac = count;
      else if (p === 'windows') stats.windows = count;
      else stats[p] = count;
    }
    stats.total = Number(totalRow[0]?.[0]?.value || 0);

    const recent = recentRows.map(r => ({
      platform: r[0]?.value,
      downloaded_at: r[1]?.value,
      country: r[2]?.value || 'Unknown'
    }));

    return res.status(200).json({
      success: true,
      stats,
      recentDownloads: recent
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
