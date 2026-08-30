// Universal M3U Playlist & EPG API Endpoint for YogiStream (yogistream.xyz)

export default async function handler(req, res) {
  try {
    const host = req.headers.host || 'yogistream.xyz';
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${protocol}://${host}`;

    // Read channel list
    let channels = [];
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'api', 'channels199.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        channels = parsed.channels || [];
      }
    } catch(e) {}

    let m3u = '#EXTM3U\n';
    m3u += '#PLAYLIST:YogiStream Live TV Hub (@yogiprojects)\n\n';

    channels.forEach(ch => {
      const keyId = ch.clearkey?.keyId || '';
      const key = ch.clearkey?.key || '';
      const genre = ch.genre || 'Entertainment';
      const logo = ch.logo || `${baseUrl}/assets/logo.jpg`;
      const playUrl = `${baseUrl}/player.html?type=dash&mpd=${encodeURIComponent(ch.mpd)}&keyid=${encodeURIComponent(keyId)}&key=${encodeURIComponent(key)}&title=${encodeURIComponent(ch.name)}`;

      m3u += `#EXTINF:-1 tvg-id="${ch.id || ch.name}" tvg-name="${ch.name}" tvg-logo="${logo}" group-title="${genre}",${ch.name}\n`;
      if (keyId && key) {
        m3u += `#KODIPROP:inputstream.adaptive.license_type=clearkey\n`;
        m3u += `#KODIPROP:inputstream.adaptive.license_key=${keyId}:${key}\n`;
      }
      m3u += `${playUrl}\n\n`;
    });

    res.setHeader('Content-Type', 'audio/x-mpegurl; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="yogistream_playlist.m3u"');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).send(m3u);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
