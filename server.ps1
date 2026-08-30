# YogiStream Standalone High-Speed Local Web Server
# Powered by @yogiprojects

$port = 8080
$basePath = $PSScriptRoot
if (-not $basePath) { $basePath = (Get-Location).Path }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
} catch {
    $port = 8888
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Prefixes.Add("http://127.0.0.1:$port/")
    $listener.Start()
}

Write-Host "========================================================"
Write-Host "   YOGISTREAM LOCAL SERVER RUNNING"
Write-Host "   URL: http://localhost:$port/"
Write-Host "   Directory: $basePath"
Write-Host "   Official Domain: https://yogistream.xyz"
Write-Host "   Telegram: https://t.me/yogiprojects"
Write-Host "========================================================"

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.htm'  = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.avif' = 'image/avif'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.mpd'  = 'application/dash+xml'
    '.m3u8' = 'application/vnd.apple.mpegurl'
    '.xml'  = 'application/xml; charset=utf-8'
    '.txt'  = 'text/plain; charset=utf-8'
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($rawPath)) {
            $rawPath = 'index.html'
        }

        $localFile = Join-Path $basePath $rawPath
        if (Test-Path $localFile -PathType Container) {
            $localFile = Join-Path $localFile 'index.html'
        } elseif (-not (Test-Path $localFile) -and (Test-Path ($localFile + '.html'))) {
            $localFile = $localFile + '.html'
        } elseif (-not (Test-Path $localFile) -and (Test-Path (Join-Path $basePath ($rawPath + '/index.html')))) {
            $localFile = Join-Path $basePath ($rawPath + '/index.html')
        }

        $response.Headers.Add('Access-Control-Allow-Origin', '*')
        $response.Headers.Add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        $response.Headers.Add('Access-Control-Allow-Headers', '*')

        if ($request.HttpMethod -eq 'OPTIONS') {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        if (Test-Path $localFile -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localFile).ToLower()
            $mime = $mimeTypes[$ext]
            if (-not $mime) { $mime = 'application/octet-stream' }
            $response.ContentType = $mime

            $bytes = [System.IO.File]::ReadAllBytes($localFile)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $msg = '404 Not Found: ' + $rawPath
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    } catch {
        # ignore client disconnects
    }
}
