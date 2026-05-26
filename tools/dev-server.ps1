param(
  [int]$Port = 4173
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$hostName = "127.0.0.1"

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png" = "image/png"
  ".jpg" = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".gif" = "image/gif"
  ".svg" = "image/svg+xml"
  ".ico" = "image/x-icon"
  ".md" = "text/markdown; charset=utf-8"
  ".webmanifest" = "application/manifest+json; charset=utf-8"
}

function Resolve-SafePath([string]$urlPath) {
  $relative = [Uri]::UnescapeDataString($urlPath.TrimStart("/"))
  if ([string]::IsNullOrWhiteSpace($relative)) {
    $relative = "index.html"
  }

  $candidate = [System.IO.Path]::GetFullPath((Join-Path $root $relative))
  $rootPath = [System.IO.Path]::GetFullPath($root)

  if (-not $candidate.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
    return $null
  }

  if ((Test-Path $candidate -PathType Container)) {
    $candidate = Join-Path $candidate "index.html"
  }

  return $candidate
}

function Send-HttpResponse($stream, [int]$statusCode, [string]$statusText, [byte[]]$body, [string]$contentType) {
  $headers = @(
    "HTTP/1.1 $statusCode $statusText",
    "Content-Type: $contentType",
    "Content-Length: $($body.Length)",
    "Cache-Control: no-store, max-age=0",
    "Connection: close",
    "",
    ""
  ) -join "`r`n"

  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
  $stream.Write($headerBytes, 0, $headerBytes.Length)
  $stream.Write($body, 0, $body.Length)
}

function Read-RequestLine($stream) {
  $buffer = New-Object byte[] 8192
  $requestBytes = New-Object System.Collections.Generic.List[byte]

  while ($stream.DataAvailable -or $requestBytes.Count -eq 0) {
    $count = $stream.Read($buffer, 0, $buffer.Length)
    if ($count -le 0) { break }
    for ($i = 0; $i -lt $count; $i++) {
      $requestBytes.Add($buffer[$i])
    }

    $requestText = [System.Text.Encoding]::ASCII.GetString($requestBytes.ToArray())
    if ($requestText.Contains("`r`n`r`n")) { break }
  }

  if ($requestBytes.Count -eq 0) {
    return $null
  }

  $text = [System.Text.Encoding]::ASCII.GetString($requestBytes.ToArray())
  return ($text -split "`r`n")[0]
}

$address = [System.Net.IPAddress]::Parse($hostName)
$listener = [System.Net.Sockets.TcpListener]::new($address, $Port)
$listener.Start()

Write-Host "VitalRise dev server running at http://127.0.0.1:$Port/" -ForegroundColor Green
Write-Host "Serving: $root"
Write-Host "Press Ctrl+C to stop."

try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    $client.ReceiveTimeout = 3000
    $client.SendTimeout = 3000

    try {
      $stream = $client.GetStream()
      $requestLine = Read-RequestLine $stream

      if (-not $requestLine -or $requestLine -notmatch "^(GET|HEAD)\s+([^\s]+)") {
        Send-HttpResponse $stream 400 "Bad Request" ([System.Text.Encoding]::UTF8.GetBytes("400 Bad Request")) "text/plain; charset=utf-8"
        continue
      }

      $requestPath = ($Matches[2] -split "\?")[0]
      $filePath = Resolve-SafePath $requestPath

      if (-not $filePath -or -not (Test-Path $filePath -PathType Leaf)) {
        Send-HttpResponse $stream 404 "Not Found" ([System.Text.Encoding]::UTF8.GetBytes("404 Not Found")) "text/plain; charset=utf-8"
        continue
      }

      $extension = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
      $contentType = if ($mimeTypes.ContainsKey($extension)) { $mimeTypes[$extension] } else { "application/octet-stream" }
      $body = [System.IO.File]::ReadAllBytes($filePath)

      if ($requestLine.StartsWith("HEAD ")) {
        $body = [byte[]]::new(0)
      }

      Send-HttpResponse $stream 200 "OK" $body $contentType
    } catch {
      try {
        if ($client.Connected) {
          Send-HttpResponse $client.GetStream() 500 "Server Error" ([System.Text.Encoding]::UTF8.GetBytes("500 Server Error")) "text/plain; charset=utf-8"
        }
      } catch {}
    } finally {
      $client.Close()
    }
  }
} finally {
  $listener.Stop()
}
