// Vercel Serverless Function: YogiStream Universal Stream & CORS Proxy
// Copyright (c) 2026 @yogiprojects (YogiStream)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, ref, ua, cookie } = req.query;

  if (!url) {
    res.status(400).json({ error: 'Missing stream url parameter (?url=...)' });
    return;
  }

  try {
    const targetUrl = decodeURIComponent(url);
    const headers = {
      'User-Agent': ua || 'plaYtv/7.1.5 (Linux;Android 13) ExoPlayerLib/2.11.6',
      'Referer': ref || 'https://www.jiotv.com/',
      'Accept': '*/*'
    };

    if (cookie) {
      headers['Cookie'] = cookie.startsWith('__hdnea__=') ? cookie : `__hdnea__=${cookie}`;
    }

    const response = await fetch(targetUrl, {
      headers: headers,
      redirect: 'follow'
    });

    const contentType = response.headers.get('content-type') || 'application/vnd.apple.mpegurl';
    res.setHeader('Content-Type', contentType);

    const buffer = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: 'Proxy fetch failed', message: err.message });
  }
}
