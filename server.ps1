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
    # If 8080 is busy, fallback to 8888
    $port = 8888
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Prefixes.Add("http://127.0.0.1:$port/")
    $listener.Start()
}

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   📺 YOGISTREAM LOCAL SERVER RUNNING" -ForegroundColor Green
Write-Host "   URL: http://localhost:$port/" -ForegroundColor Yellow
Write-Host "   Directory: $basePath" -ForegroundColor White
Write-Host "   Official Domain: https://yogistream.xyz" -ForegroundColor Magenta
Write-Host "   Telegram: https://t.me/yogiprojects" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".avif" = "image/avif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".mpd"  = "application/dash+xml"
    ".m3u8" = "application/vnd.apple.mpegurl"
    ".xml"  = "application/xml; charset=utf-8"
    ".txt"  = "text/plain; charset=utf-8"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "index.html"
        }

        # Check clean routing (e.g. /jjtv -> /jjtv/index.html)
        $localFile = Join-Path $basePath $urlPath
        if (Test-Path $localFile -PathType Container) {
            $localFile = Join-Path $localFile "index.html"
        } elseif (-not (Test-Path $localFile) -and (Test-Path "$localFile.html")) {
            $localFile = "$localFile.html"
        } elseif (-not (Test-Path $localFile) -and (Test-Path (Join-Path $basePath "$urlPath/index.html"))) {
            $localFile = Join-Path $basePath "$urlPath/index.html"
        }

        # CORS Headers & Caching
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "*")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        if (Test-Path $localFile -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localFile).ToLower()
            $mime = $mimeTypes[$ext]
            if (-not $mime) { $mime = "application/octet-stream" }
            $response.ContentType = $mime

            $bytes = [System.IO.File]::ReadAllBytes($localFile)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    } catch {
        # ignore transient connection aborts
    }
}
