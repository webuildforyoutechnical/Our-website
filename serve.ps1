param(
    [int]$Port = 8000
)

$rootDir = $PSScriptRoot
if (-not $rootDir) { $rootDir = (Get-Location).Path }

$listener = New-Object System.Net.Sockets.TcpListener ([System.Net.IPAddress]::Loopback, $Port)
try {
    $listener.Start()
} catch {
    Write-Host "Error starting server on port $Port : $_" -ForegroundColor Red
    exit 1
}

$url = "http://localhost:$Port/"
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " Local server is running at: $url" -ForegroundColor Green
Write-Host " Serving directory: $rootDir" -ForegroundColor Gray
Write-Host " Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Cyan

$mime = @{
    ".html"  = "text/html; charset=utf-8"
    ".htm"   = "text/html; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".gif"   = "image/gif"
    ".svg"   = "image/svg+xml"
    ".ico"   = "image/x-icon"
    ".pdf"   = "application/pdf"
    ".woff"  = "font/woff"
    ".woff2" = "font/woff2"
    ".ttf"   = "font/ttf"
    ".eot"   = "application/vnd.ms-fontobject"
    ".otf"   = "font/otf"
    ".txt"   = "text/plain; charset=utf-8"
}

try {
    while ($true) {
        $client = $null
        try {
            $client = $listener.AcceptTcpClient()
            $stream = $client.GetStream()
            $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
            $writer = New-Object System.IO.BinaryWriter($stream)

            $reqLine = $reader.ReadLine()
            if (-not $reqLine) {
                continue
            }

            # Drain headers
            while (($hdr = $reader.ReadLine()) -and $hdr.Trim().Length -gt 0) {}

            $parts = $reqLine.Split(' ')
            if ($parts.Length -lt 2) {
                continue
            }

            $reqPath = $parts[1].Split('?')[0]
            if ($reqPath -eq '/' -or $reqPath -eq '') {
                $reqPath = '/index.html'
            }

            $decodedPath = [System.Uri]::UnescapeDataString($reqPath.TrimStart('/')) -replace '/', '\'
            $filePath = Join-Path $rootDir $decodedPath

            if ((Test-Path -Path $filePath -PathType Leaf) -and $filePath.StartsWith($rootDir, [System.StringComparison]::OrdinalIgnoreCase)) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                $writer.Write([System.Text.Encoding]::UTF8.GetBytes($header))
                $writer.Write($bytes)
                $writer.Flush()
            } else {
                $body = [System.Text.Encoding]::UTF8.GetBytes("<!DOCTYPE html><html><body><h1>404 Not Found</h1><p>File not found: $reqPath</p></body></html>")
                $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/html; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
                $writer.Write([System.Text.Encoding]::UTF8.GetBytes($header))
                $writer.Write($body)
                $writer.Flush()
            }
        } catch {
            # Catch client socket aborts, resets, or read/write errors and keep server running
        } finally {
            if ($client) {
                try { $client.Close() } catch {}
            }
        }
    }
} finally {
    $listener.Stop()
}
