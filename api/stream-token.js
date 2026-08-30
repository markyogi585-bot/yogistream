// Vercel Serverless Function: YogiStream Token & Stream Authorizer
// Copyright (c) 2026 @yogiprojects (YogiStream)

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const timestamp = Date.now();
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  
  // Generate session token
  const tokenPayload = {
    service: "YogiStream Live Engine",
    domain: "yogistream.xyz",
    brand: "@yogiprojects",
    telegram: "https://t.me/yogiprojects",
    ts: timestamp,
    clientIp: clientIp,
    status: "AUTHORIZED",
    version: "4.0.0-pro"
  };

  res.status(200).json({
    success: true,
    data: tokenPayload
  });
}
